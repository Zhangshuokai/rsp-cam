"""ROS 2 TCP server for WiFi-connected boards.

Each board connects to this node and identifies itself with ``HELLO <NAME>``.
Every line the board sends is published on ``/board/<board>/rx``; messages on
``/board/<board>/tx`` are written back to the board as newline-terminated lines.
This replaces the COM/serial bridge so boards need no USB connection at runtime.
"""

import socket
import threading

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

BOARDS = ("green", "blue", "xrs")


class WifiServer(Node):
    def __init__(self):
        super().__init__("wifi_server")
        self.declare_parameter("port", 6001)
        self.port = self.get_parameter("port").value

        self.lock = threading.Lock()
        self.connections = {}
        self.publishers_by_board = {}
        for board in BOARDS:
            self.publishers_by_board[board] = self.create_publisher(
                String, "/board/%s/rx" % board, 10
            )
            self.create_subscription(
                String, "/board/%s/tx" % board, self.make_tx_callback(board), 10
            )

        self.running = True
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server.bind(("0.0.0.0", self.port))
        self.server.listen(5)
        self.get_logger().info("listening on 0.0.0.0:%d" % self.port)
        threading.Thread(target=self.accept_loop, daemon=True).start()

    def make_tx_callback(self, board):
        def callback(msg):
            with self.lock:
                conn = self.connections.get(board)
            if conn is None:
                self.get_logger().warning("%s offline, dropping: %s" % (board, msg.data))
                return
            try:
                conn.sendall((msg.data + "\n").encode())
            except OSError as exc:
                self.get_logger().error("send to %s failed: %s" % (board, exc))
        return callback

    def accept_loop(self):
        while self.running:
            try:
                conn, addr = self.server.accept()
            except OSError:
                break
            threading.Thread(
                target=self.handle_client, args=(conn, addr), daemon=True
            ).start()

    def handle_client(self, conn, addr):
        board = None
        buf = b""
        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                buf += data
                while b"\n" in buf:
                    line, buf = buf.split(b"\n", 1)
                    text = line.decode(errors="replace").strip()
                    if not text:
                        continue
                    if board is None:
                        if text.startswith("HELLO "):
                            name = text.split(" ", 1)[1].strip().lower()
                            if name in BOARDS:
                                board = name
                                with self.lock:
                                    self.connections[board] = conn
                                self.get_logger().info(
                                    "%s registered from %s" % (board, addr)
                                )
                        continue
                    self.publishers_by_board[board].publish(String(data=text))
        except OSError as exc:
            self.get_logger().warning("connection error (%s): %s" % (board, exc))
        finally:
            if board is not None:
                with self.lock:
                    if self.connections.get(board) is conn:
                        del self.connections[board]
                self.get_logger().info("%s disconnected" % board)
            try:
                conn.close()
            except OSError:
                pass

    def stop(self):
        self.running = False
        try:
            self.server.close()
        except OSError:
            pass
        with self.lock:
            for conn in self.connections.values():
                try:
                    conn.close()
                except OSError:
                    pass


def main(args=None):
    rclpy.init(args=args)
    node = WifiServer()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.stop()
        node.destroy_node()
        rclpy.shutdown()
