// ESP32-S3 micro-ROS 固件
// 结构照奇果派官方 micro-ROS 示例（micro-ROS.zip 的 src/main.cpp）：FreeRTOS 后台任务里管
// WiFi + Agent 连接（ping 检测 / 断线重建实体 / 定时发心跳）。
// 控车部分照官方 A2 履带示例：直接驱动 M1 / M2 两个 EMO_DCMotor。
//
// 实测记录（2026-09）：
//   · BaseChassis::updateVelocity() 走编码器 PID，零速会被算成满 PWM（轮子自己转），
//     且必须先对编码器电机 begin(减速比)；updateDuty() 在本板不出 PWM。故改用直接驱动。
#include <Arduino.h>
#include <micro_ros_platformio.h>
#include <WiFi.h>
#include <EMotionPI.h>

#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>
#include <geometry_msgs/msg/twist.h>
#include <std_msgs/msg/int32.h>

// 私密配置（Wi-Fi 密码、Agent IP）放 include/secrets.h：该文件已在 .gitignore 里，不入库。
// 没有它时用下面的占位默认值；模板见 include/secrets.example.h。
#if __has_include("secrets.h")
#include "secrets.h"
#endif

// ---- 配置参数（secrets.h 里未定义时的默认值） ----
#ifndef WIFI_SSID
#define WIFI_SSID "your_wifi_ssid"       // 必须是 2.4 GHz
#endif
#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD "your_wifi_password"
#endif
#ifndef AGENT_IP
#define AGENT_IP "192.168.31.29"         // 树莓派在同一网段的地址，不是 127.0.0.1
#endif
#ifndef AGENT_PORT
#define AGENT_PORT 8888
#endif
// ---------------------------------------------

// 超过这么久没收到 /cmd_vel 就停车（丢包 / Agent 断连保护）
#define CMD_TIMEOUT_MS 1000
// /cmd_vel 到 PWM 的换算上限：米/秒、弧度/秒
#define MAX_LINEAR 0.5f
#define MAX_ANGULAR 2.0f
// 电机：实车是履带/两轮差速，只接 M1（左）、M2（右）
#define MOTOR_LEFT M1
#define MOTOR_RIGHT M2
// 官方 A2 履带示例：起步 30、上限 100。但本车实测 40~50 低于静摩擦阈值（轮子不转），
// 60 起能走、100 满速，所以最小起步值取 60。
#define MOTOR_MIN_PWM 60.0f
#define MOTOR_MAX_PWM 100.0f

rclc_executor_t executor;
rclc_support_t support;
rcl_allocator_t allocator;
rcl_node_t node;
rcl_subscription_t subscriber;
rcl_publisher_t heartbeat_publisher;
geometry_msgs__msg__Twist sub_msg;
std_msgs__msg__Int32 pub_msg;

bool micro_ros_connected = false;
int heartbeat_count = 0;

// 电机（句柄在 setup() 里取；全局先置空）
EMotionPI emo;
EMO_DCMotor *motor_left = nullptr;   // M1 左履带
EMO_DCMotor *motor_right = nullptr;  // M2 右履带

static volatile unsigned long last_cmd_ms = 0;
static volatile bool moving = false;
// 目标占空比（由核心 0 的回调写、核心 1 的 loop 下发；库调用只在核心 1 做）
static volatile float target_l = 0.0f;
static volatile float target_r = 0.0f;

// 函数声明
bool create_entities();
void destroy_entities();
void twist_callback(const void *msg_in);
bool wait_for_wifi(unsigned long timeout_ms);

static float clampf(float v, float limit) {
  if (v > limit) return limit;
  if (v < -limit) return -limit;
  return v;
}

// 把归一化速度 n∈[-1,1] 映射到占空比：0 → 0（停），非零 → [MOTOR_MIN_PWM, MOTOR_MAX_PWM]。
// 这样一给指令就能越过静摩擦起步，同时速度随指令大小成比例（60 慢、100 满速）。
static float scale_duty(float n) {
  if (n > 1.0f) n = 1.0f;
  if (n < -1.0f) n = -1.0f;
  if (n == 0.0f) return 0.0f;
  float d = MOTOR_MIN_PWM + fabsf(n) * (MOTOR_MAX_PWM - MOTOR_MIN_PWM);
  return n > 0.0f ? d : -d;
}

// pwm > 0 正转、< 0 反转、0 停。用官方 EMO_DCMotor::spin(int)（-100~100 开环占空比）。
static void drive_motor(EMO_DCMotor *m, float pwm) {
  if (!m) return;
  if (pwm > MOTOR_MAX_PWM) pwm = MOTOR_MAX_PWM;
  if (pwm < -MOTOR_MAX_PWM) pwm = -MOTOR_MAX_PWM;
  m->spin((int)pwm);
}

// 收到 Twist：linear.x 前后、angular.z 转向（>0 逆时针/左转）
void twist_callback(const void *msg_in) {
  const geometry_msgs__msg__Twist *twist_msg =
      (const geometry_msgs__msg__Twist *)msg_in;
  float linear_x = twist_msg->linear.x;
  float linear_y = twist_msg->linear.y;   // 履带车用不到，保留打印
  float angular_z = twist_msg->angular.z;
  Serial.printf("Received Twist message: xyz = %f,%f,%f\n", linear_x, linear_y,
                angular_z);

  float fwd = clampf(linear_x / MAX_LINEAR, 1.0f);    // ±1
  float turn = clampf(angular_z / MAX_ANGULAR, 1.0f); // ±1
  // 只算目标值，真正的库调用放到 loop()（核心 1）里做；差速：左 = 前进 − 转向，右 = 前进 + 转向
  target_l = scale_duty(clampf(fwd - turn, 1.0f));
  target_r = scale_duty(clampf(fwd + turn, 1.0f));
  Serial.printf("cmd L=%d R=%d\n", (int)target_l, (int)target_r);

  last_cmd_ms = millis();
  moving = (fwd != 0.0f || turn != 0.0f);
}

// 创建 micro-ROS 实体
bool create_entities() {
  Serial.println("[ROS] Creating entities...");

  allocator = rcl_get_default_allocator();

  rcl_ret_t ret = rclc_support_init(&support, 0, NULL, &allocator);
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to init support");
    return false;
  }

  ret = rclc_node_init_default(&node, "esp32_car", "", &support);
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to init node");
    return false;
  }

  ret = rclc_subscription_init_default(
      &subscriber, &node,
      ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist), "/cmd_vel");
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to init subscriber");
    return false;
  }

  ret = rclc_publisher_init_default(
      &heartbeat_publisher, &node,
      ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32), "/esp32/heartbeat");
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to init publisher");
    return false;
  }

  ret = rclc_executor_init(&executor, &support.context, 2, &allocator);
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to init executor");
    return false;
  }

  ret = rclc_executor_add_subscription(&executor, &subscriber, &sub_msg,
                                       &twist_callback, ON_NEW_DATA);
  if (ret != RCL_RET_OK) {
    Serial.println("[ROS] Failed to add subscription");
    return false;
  }

  Serial.println("[ROS] Entities created successfully");
  return true;
}

// 销毁 micro-ROS 实体（断线后重建用）
void destroy_entities() {
  Serial.println("[ROS] Destroying entities...");
  rcl_subscription_fini(&subscriber, &node);
  rcl_publisher_fini(&heartbeat_publisher, &node);
  rcl_node_fini(&node);
  rclc_support_fini(&support);
  micro_ros_connected = false;
}

// 等待 WiFi 连接
bool wait_for_wifi(unsigned long timeout_ms) {
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (millis() - start > timeout_ms) {
      Serial.println("\n[WiFi] Connection timeout!");
      return false;
    }
  }

  Serial.println("\n[WiFi] Connected!");
  Serial.print("[WiFi] IP address: ");
  Serial.println(WiFi.localIP());
  return true;
}

// 后台任务：管连接 + 收发（官方示例结构）
void microros_task(void *param) {
  (void)param;

  // 1. 先连 WiFi
  if (!wait_for_wifi(30000)) {
    Serial.println("[ERROR] WiFi connection failed, restarting...");
    ESP.restart();
  }

  // 2. 设置 micro-ROS 传输
  IPAddress agent_ip;
  agent_ip.fromString(AGENT_IP);
  set_microros_wifi_transports((char *)WIFI_SSID, (char *)WIFI_PASSWORD,
                               agent_ip, AGENT_PORT);
  delay(1000);

  // 3. 连接与主循环
  unsigned long last_heartbeat_time = 0;
  const unsigned long heartbeat_interval = 1000;  // 1 秒一次心跳

  while (true) {
    if (!micro_ros_connected) {
      Serial.println("[ROS] Attempting to connect to agent...");
      if (rmw_uros_ping_agent(100, 1) == RMW_RET_OK) {
        Serial.println("[ROS] Agent found, creating entities...");
        if (create_entities()) {
          micro_ros_connected = true;
          heartbeat_count = 0;
          Serial.println("[ROS] Connected and ready!");
        }
      } else {
        Serial.println("[ROS] Agent not available, retrying in 1s...");
        delay(1000);
        continue;
      }
    }

    if (micro_ros_connected) {
      rcl_ret_t ret = rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));

      // 连接丢失：销毁实体后重连
      if (ret != RCL_RET_OK || rmw_uros_ping_agent(100, 3) != RMW_RET_OK) {
        Serial.println("[ROS] Connection lost!");
        destroy_entities();
        target_l = 0.0f;   // 断连即停（实际下发在核心 1 的 loop 里）
        target_r = 0.0f;
        moving = false;
        continue;
      }

      // 定时发心跳
      if (millis() - last_heartbeat_time > heartbeat_interval) {
        pub_msg.data = heartbeat_count++;
        rcl_ret_t pub_ret = rcl_publish(&heartbeat_publisher, &pub_msg, NULL);
        if (pub_ret == RCL_RET_OK) {
          Serial.printf("[ROS] Heartbeat sent: %d\n", pub_msg.data);
        }
        last_heartbeat_time = millis();
      }

      delay(10);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // 电机初始化（实测结论，2026-09）：
  // ① emo.begin() 初始化板级外设；
  // ② emo.getEncoderMotor(M1/M2)->begin(90) 必须调（本板电机无编码器也照样要调）：
  //    它负责把电机驱动输出初始化起来，少这一步所有 spin()/run() 都不出 PWM；减速比 1:90。
  // ③ 之后用 EMO_DCMotor::spin(±pwm) 开环驱动即可（官方 A9 的用法）；注意 pwm 要够大，
  //    40~50 带不动电机，实测 60 起步、100 满速。
  emo.begin();
  EMO_EncoderMotor *enc_left = emo.getEncoderMotor(MOTOR_LEFT);
  EMO_EncoderMotor *enc_right = emo.getEncoderMotor(MOTOR_RIGHT);
  if (enc_left) enc_left->begin(90);
  if (enc_right) enc_right->begin(90);

  motor_left = emo.getMotor(MOTOR_LEFT);
  motor_right = emo.getMotor(MOTOR_RIGHT);
  Serial.printf("motors: left=%p right=%p enc=%p/%p\n", (void *)motor_left,
                (void *)motor_right, (void *)enc_left, (void *)enc_right);
  drive_motor(motor_left, 0);
  drive_motor(motor_right, 0);

  xTaskCreatePinnedToCore(microros_task, "microros_task", 10240, NULL, 1, NULL, 0);
  Serial.println("setup done");
}

void loop() {
  // 电机库调用统一在本函数（核心 1，Arduino loopTask）里做：
  // 实测从核心 0 的 micro-ROS 任务里调 spin() 不出 PWM，放核心 1 才有效。
  if (moving && (millis() - last_cmd_ms) > CMD_TIMEOUT_MS) {
    target_l = 0.0f;   // 丢包/断连保护：1 s 没收到就停
    target_r = 0.0f;
    moving = false;
  }
  drive_motor(motor_left, target_l);
  drive_motor(motor_right, target_r);
  delay(10);
}
