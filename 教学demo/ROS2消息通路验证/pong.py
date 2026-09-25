#!/usr/bin/env python3
"""Pong 侧：收到 /kilo_ping 后回一条 /kilo_pong。

跑在树莓派上（ros:jazzy-ros-base 容器内，容器用 --network host）。
回包格式： "<ping 原始载荷>|pong#<序号>@<主机名>"，带上主机名以证明是树莓派回的。
"""
import socket

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

PING_TOPIC = "kilo_ping"
PONG_TOPIC = "kilo_pong"


class Pong(Node):
    def __init__(self):
        super().__init__("kilo_pong")
        self.host = socket.gethostname()
        self.count = 0
        self.pub = self.create_publisher(String, PONG_TOPIC, 10)
        self.sub = self.create_subscription(String, PING_TOPIC, self.on_ping, 10)
        self.get_logger().info(f"pong ready on {self.host}, waiting for {PING_TOPIC}")

    def on_ping(self, msg):
        self.count += 1
        data = f"{msg.data}|pong#{self.count}@{self.host}"
        self.pub.publish(String(data=data))
        self.get_logger().info(f"<- {msg.data}    -> {data}")


def main():
    rclpy.init()
    node = Pong()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()
