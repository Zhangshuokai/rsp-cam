#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32
import time

class HeartbeatListener(Node):
    def __init__(self):
        super().__init__('heartbeat_listener')
        
        # 订阅ESP32的心跳话题
        self.subscription = self.create_subscription(
            Int32,
            '/esp32/heartbeat',
            self.heartbeat_callback,
            10)
        
        self.get_logger().info('心跳监听节点已启动，等待ESP32心跳...')
        self.last_heartbeat_time = time.time()
        self.heartbeat_count = 0
        self.heartbeat_timeout = 5.0
        
        # 创建定时器检查心跳超时
        self.timer = self.create_timer(1.0, self.check_heartbeat_timeout)
    
    def heartbeat_callback(self, msg):
        """收到心跳消息时的回调函数"""
        current_time = time.time()
        time_diff = current_time - self.last_heartbeat_time
        self.last_heartbeat_time = current_time
        self.heartbeat_count += 1
        
        # 计算心跳频率
        if time_diff > 0:
            freq = 1.0 / time_diff
        else:
            freq = 0
            
        self.get_logger().info(
            '收到心跳 #{} | 计数: {} | 频率: {:.1f} Hz'.format(
                msg.data, self.heartbeat_count, freq
            )
        )
    
    def check_heartbeat_timeout(self):
        """检查心跳是否超时"""
        time_since_last = time.time() - self.last_heartbeat_time
        if time_since_last > self.heartbeat_timeout:
            self.get_logger().warn(
                '心跳丢失！已经 {:.1f} 秒未收到心跳'.format(time_since_last)
            )

def main(args=None):
    rclpy.init(args=args)
    node = HeartbeatListener()
    
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('用户中断，关闭心跳监听节点')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
