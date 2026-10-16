"""Expose one board's serial stream as ROS 2 topics.

Publishes every line the board prints on ``/board/<board>/rx`` and writes any
``/board/<board>/tx`` message back to the board as a newline-terminated line.

The URL may be a real device (``/dev/ttyUSB0``) or a Windows serial bridge
(``socket://localhost:50013``).
"""

import threading
import time

import rclpy
import serial
from rclpy.node import Node
from std_msgs.msg import String


class SerialBridge(Node):
    def __init__(self):
        super().__init__("serial_bridge")
        self.declare_parameter("board", "green")
        self.declare_parameter("url", "socket://localhost:50013")
        self.declare_parameter("baud", 115200)

        self.board = self.get_parameter("board").value
        self.url = self.get_parameter("url").value
        self.baud = self.get_parameter("baud").value

        self.publisher = self.create_publisher(String, "/board/%s/rx" % self.board, 10)
        self.create_subscription(String, "/board/%s/tx" % self.board, self.on_tx, 10)

        self.lock = threading.Lock()
        self.serial = None
        self.running = True
        self.thread = threading.Thread(target=self.read_loop, daemon=True)
        self.thread.start()
        self.get_logger().info("%s board on %s" % (self.board, self.url))

    def on_tx(self, msg):
        with self.lock:
            ser = self.serial
        if ser is None:
            self.get_logger().warning("not connected, dropping: %s" % msg.data)
            return
        try:
            ser.write((msg.data + "\n").encode())
        except Exception as exc:
            self.get_logger().error("write failed: %s" % exc)

    def connect(self):
        while self.running:
            try:
                ser = serial.serial_for_url(self.url, baudrate=self.baud, timeout=0.5)
                with self.lock:
                    self.serial = ser
                self.get_logger().info("connected to %s" % self.url)
                return ser
            except Exception as exc:
                self.get_logger().warning("connect failed (%s), retrying" % exc)
                time.sleep(2)
        return None

    def read_loop(self):
        while self.running:
            ser = self.connect()
            if ser is None:
                return
            while self.running:
                try:
                    raw = ser.readline()
                except Exception as exc:
                    self.get_logger().error("read failed: %s" % exc)
                    break
                if not raw:
                    continue
                line = raw.decode(errors="replace").strip()
                if line:
                    self.publisher.publish(String(data=line))
            with self.lock:
                if self.serial is ser:
                    self.serial = None
            try:
                ser.close()
            except Exception:
                pass

    def stop(self):
        self.running = False
        with self.lock:
            ser = self.serial
        if ser is not None:
            try:
                ser.close()
            except Exception:
                pass


def main(args=None):
    rclpy.init(args=args)
    node = SerialBridge()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.stop()
        node.destroy_node()
        rclpy.shutdown()
