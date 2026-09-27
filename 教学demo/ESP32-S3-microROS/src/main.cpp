// ESP32-S3 micro-ROS 固件
// 结构照奇果派官方示例（micro-ROS.zip 的 src/main.cpp）：FreeRTOS 后台任务里管
// WiFi + Agent 连接（ping 检测 / 断线重建实体 / 定时发心跳），
// 本工程只把官方示例里"只打印"的 twist_callback 换成 QGP_EVMotor 麦轮底盘控制。
#include <Arduino.h>
#include <micro_ros_platformio.h>
#include <WiFi.h>
#include <EMotionPI.h>

#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>
#include <geometry_msgs/msg/twist.h>
#include <std_msgs/msg/int32.h>

// ---- 配置参数：按现场修改 ----
#define WIFI_SSID "your_wifi_ssid"       // 必须是 2.4 GHz
#define WIFI_PASSWORD "your_wifi_password"
#define AGENT_IP "192.168.31.29"         // 树莓派在同一网段的地址，不是 127.0.0.1
#define AGENT_PORT 8888
// ------------------------------

// 超过这么久没收到 /cmd_vel 就停车（丢包 / Agent 断连保护）
#define CMD_TIMEOUT_MS 1000
// 速度限幅：米/秒、弧度/秒
#define MAX_LINEAR 0.5f
#define MAX_ANGULAR 2.0f

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

// 底盘（QGP_EVMotor）
EMotionPI emo;
BaseChassis *chassis = nullptr;
static volatile unsigned long last_cmd_ms = 0;
static volatile bool moving = false;

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

// 收到 Twist 时：官方示例只打印，这里换成真实控车
void twist_callback(const void *msg_in) {
  const geometry_msgs__msg__Twist *twist_msg =
      (const geometry_msgs__msg__Twist *)msg_in;
  float linear_x = twist_msg->linear.x;
  float linear_y = twist_msg->linear.y;
  float angular_z = twist_msg->angular.z;
  Serial.printf("Received Twist message: xyz = %f,%f,%f\n", linear_x, linear_y,
                angular_z);

  if (!chassis) return;
  // Twist（m/s, m/s, rad/s）与麦轮底盘速度定义一致，直接下发
  chassis->updateVelocity(clampf(linear_x, MAX_LINEAR),
                          clampf(linear_y, MAX_LINEAR),
                          clampf(angular_z, MAX_ANGULAR));
  last_cmd_ms = millis();
  moving = true;
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

  // 底盘先初始化：上电即为停止状态
  emo.begin();
  chassis = emo.createBaseChassis(BaseChassis::MECANUM);

  xTaskCreatePinnedToCore(microros_task, "microros_task", 10240, NULL, 1, NULL, 0);
  Serial.println("setup done");
}

void loop() {
  // 这里放其它逻辑；当前只做断连/丢包保护：1 s 没收到 /cmd_vel 就停车
  if (moving && chassis && (millis() - last_cmd_ms) > CMD_TIMEOUT_MS) {
    chassis->stop();
    moving = false;
  }
  delay(10);
}
