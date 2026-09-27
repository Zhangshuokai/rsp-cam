// ESP32-S3 micro-ROS 固件：收 /cmd_vel 控车、发 /esp32/heartbeat
// 电机/底盘用官方 QGP_EVMotor 库（内置精简子集，见 lib/QGP_EVMotor/README.md）。
#include <micro_ros_platformio.h>
#include <EMotionPI.h>

#include <rcl/rcl.h>
#include <rcl/error_handling.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>
#include <std_msgs/msg/int32.h>
#include <geometry_msgs/msg/twist.h>

// ---- 按现场修改：2.4 GHz Wi-Fi 与树莓派 Agent 地址 ----
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASS "your_wifi_password"
#define AGENT_OCTET_0 192
#define AGENT_OCTET_1 168
#define AGENT_OCTET_2 31
#define AGENT_OCTET_3 29
#define AGENT_PORT 8888
// -----------------------------------------------------

// 超过这么久没收到 /cmd_vel 就停车（丢包/断连保护）
#define CMD_TIMEOUT_MS 1000
// 速度上限：米/秒、弧度/秒（teleop 默认 0.5 m/s，这里做一层限幅）
#define MAX_LINEAR 0.5f
#define MAX_ANGULAR 2.0f

EMotionPI emo;
BaseChassis *chassis = nullptr;

rcl_allocator_t allocator;
rclc_support_t support;
rcl_node_t node;

rcl_publisher_t pub;
std_msgs__msg__Int32 hb_msg;
rcl_timer_t timer;

rcl_subscription_t sub;
geometry_msgs__msg__Twist cmd_msg;

rclc_executor_t executor;

static unsigned long last_cmd_ms = 0;
static bool moving = false;

static float clampf(float v, float limit) {
  if (v > limit) return limit;
  if (v < -limit) return -limit;
  return v;
}

void timer_cb(rcl_timer_t *timer, int64_t last_call_time) {
  (void)timer;
  (void)last_call_time;
  hb_msg.data++;
  rcl_publish(&pub, &hb_msg, NULL);
}

void cmd_cb(const void *msgin) {
  const geometry_msgs__msg__Twist *m = (const geometry_msgs__msg__Twist *)msgin;
  if (!chassis) return;
  // Twist (m/s, m/s, rad/s) 与麦轮底盘的速度定义一致，直接下发
  chassis->updateVelocity(clampf(m->linear.x, MAX_LINEAR),
                          clampf(m->linear.y, MAX_LINEAR),
                          clampf(m->angular.z, MAX_ANGULAR));
  last_cmd_ms = millis();
  moving = true;
}

void setup() {
  // 先初始化底盘：上电后电机处于停止状态
  emo.begin();
  chassis = emo.createBaseChassis(BaseChassis::MECANUM);

  set_microros_wifi_transports(
      (char *)WIFI_SSID, (char *)WIFI_PASS,
      IPAddress(AGENT_OCTET_0, AGENT_OCTET_1, AGENT_OCTET_2, AGENT_OCTET_3),
      AGENT_PORT);
  delay(2000);

  allocator = rcl_get_default_allocator();
  rclc_support_init(&support, 0, NULL, &allocator);
  rclc_node_init_default(&node, "esp32_node", "", &support);

  rclc_publisher_init_default(
      &pub, &node, ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
      "esp32/heartbeat");
  rclc_timer_init_default(&timer, &support, RCL_MS_TO_NS(1000), timer_cb);

  rclc_subscription_init_default(
      &sub, &node, ROSIDL_GET_MSG_TYPE_SUPPORT(geometry_msgs, msg, Twist),
      "cmd_vel");

  rclc_executor_init(&executor, &support.context, 2, &allocator);
  rclc_executor_add_timer(&executor, &timer);
  rclc_executor_add_subscription(&executor, &sub, &cmd_msg, cmd_cb, ON_NEW_DATA);
}

void loop() {
  rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));

  if (moving && chassis && (millis() - last_cmd_ms) > CMD_TIMEOUT_MS) {
    chassis->stop();
    moving = false;
  }
}
