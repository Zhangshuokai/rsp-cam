// ESP32-S3 micro-ROS 最小固件（PlatformIO + micro_ros_platformio）
// 发心跳 /esp32/heartbeat、收 /cmd_vel
// 对应 教学webppt/ESP32-S3接入micro-ROS 的「固件骨架 / 发心跳 / 收 /cmd_vel」页。
#include <micro_ros_platformio.h>

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

rcl_allocator_t allocator;
rclc_support_t support;
rcl_node_t node;

rcl_publisher_t pub;
std_msgs__msg__Int32 hb_msg;
rcl_timer_t timer;

rcl_subscription_t sub;
geometry_msgs__msg__Twist cmd_msg;

rclc_executor_t executor;

void timer_cb(rcl_timer_t *timer, int64_t last_call_time) {
  (void)timer;
  (void)last_call_time;
  hb_msg.data++;
  rcl_publish(&pub, &hb_msg, NULL);
}

void cmd_cb(const void *msgin) {
  const geometry_msgs__msg__Twist *m = (const geometry_msgs__msg__Twist *)msgin;
  // m->linear.x 前后 / m->linear.y 横移 / m->angular.z 转向
  // TODO：换成 QGP_EVMotor 的 EMO_DCMotor::run() / setSpeed()
  (void)m;
}

void setup() {
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
}
