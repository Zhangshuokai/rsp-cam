"""Forward board events to every other board through ROS 2.

A ``DATA <NAME> <seq>`` heartbeat published on ``/board/<board>/rx`` becomes
``FROM <NAME> <seq>``, and a pad ``KEY <NAME>`` press becomes
``EVENT <BOARD> <KEY>``.  Each is sent to every other board's
``/board/<board>/tx``, where it shows up as ``[RX ...]``.
"""

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

BOARDS = ("green", "blue", "xrs")


class BoardRelay(Node):
    def __init__(self):
        super().__init__("board_relay")
        self.publishers_by_board = {}
        for board in BOARDS:
            self.publishers_by_board[board] = self.create_publisher(
                String, "/board/%s/tx" % board, 10
            )
        for board in BOARDS:
            self.create_subscription(
                String,
                "/board/%s/rx" % board,
                self.make_callback(board),
                10,
            )

    def make_callback(self, source):
        def callback(msg):
            if msg.data.startswith("DATA "):
                out = "FROM %s %s" % (source.upper(), msg.data.split(" ", 2)[2])
            elif msg.data.startswith("KEY "):
                out = "EVENT %s %s" % (source.upper(), msg.data[4:])
            else:
                return
            for target in BOARDS:
                if target != source:
                    self.publishers_by_board[target].publish(String(data=out))
            self.get_logger().info("%s -> others: %s" % (source, out))
        return callback


def main(args=None):
    rclpy.init(args=args)
    node = BoardRelay()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()
