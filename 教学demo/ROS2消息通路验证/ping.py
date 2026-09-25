#!/usr/bin/env python3
"""Ping 侧：向 /kilo_ping 发 N 轮，逐轮等待 /kilo_pong 并统计往返时延。

跑在 WSL2 上（宿主 ros2 已 source）。用法：
    ROS_DOMAIN_ID=42 python3 ping.py [轮数] [每轮超时秒]
返回码 0 表示全部轮次都收到回包。
"""
import sys
import time

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

PING_TOPIC = "kilo_ping"
PONG_TOPIC = "kilo_pong"


class Ping(Node):
    def __init__(self):
        super().__init__("kilo_ping")
        self.pub = self.create_publisher(String, PING_TOPIC, 10)
        self.sub = self.create_subscription(String, PONG_TOPIC, self.on_pong, 10)
        self.pending = {}   # seq -> perf_counter 发送时刻
        self.results = []   # (seq, rtt_ms, pong_data)

    def on_pong(self, msg):
        try:
            seq = int(msg.data.split("|", 1)[0])
        except (ValueError, IndexError):
            return
        if seq in self.pending:
            sent_at = self.pending.pop(seq)
            self.results.append((seq, (time.perf_counter() - sent_at) * 1000.0, msg.data))

    def wait_for_peer(self, timeout=20.0):
        deadline = time.time() + timeout
        while time.time() < deadline and self.pub.get_subscription_count() == 0:
            rclpy.spin_once(self, timeout_sec=0.2)
        return self.pub.get_subscription_count() > 0


def main():
    rounds = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    timeout = float(sys.argv[2]) if len(sys.argv) > 2 else 3.0

    rclpy.init()
    node = Ping()
    print(f"waiting for pong peer on /{PING_TOPIC} ...")
    if not node.wait_for_peer(20.0):
        print("ERROR: 20s 内没发现对端，检查 ROS_DOMAIN_ID 与网络")
        node.destroy_node()
        rclpy.shutdown()
        return 2
    print("peer found, starting ping-pong")

    for seq in range(1, rounds + 1):
        payload = f"{seq}|wsl|{time.time():.3f}"
        node.pending[seq] = time.perf_counter()
        node.pub.publish(String(data=payload))
        print(f"seq={seq:02d} -> sent {payload}")
        deadline = time.time() + timeout
        while seq in node.pending and time.time() < deadline:
            rclpy.spin_once(node, timeout_sec=0.05)
        if seq in node.pending:
            node.pending.pop(seq, None)
            print(f"seq={seq:02d} <- TIMEOUT after {timeout:.1f}s")

    print("\n---- summary ----")
    for seq, rtt, data in node.results:
        print(f"seq={seq:02d} rtt={rtt:7.1f} ms  pong='{data}'")
    if node.results:
        rtts = [r for _, r, _ in node.results]
        print(f"min={min(rtts):.1f} ms  max={max(rtts):.1f} ms  avg={sum(rtts) / len(rtts):.1f} ms")
    print(f"{len(node.results)}/{rounds} rounds answered")

    node.destroy_node()
    rclpy.shutdown()
    return 0 if len(node.results) == rounds else 1


if __name__ == "__main__":
    sys.exit(main())
