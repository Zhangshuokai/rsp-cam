import os

from launch import LaunchDescription
from launch_ros.actions import Node

GREEN_URL = os.environ.get("GREEN_URL", "socket://localhost:50013")
BLUE_URL = os.environ.get("BLUE_URL", "socket://localhost:50014")


def generate_launch_description():
    return LaunchDescription(
        [
            Node(
                package="board_bridge",
                executable="serial_bridge",
                name="green_bridge",
                parameters=[{"board": "green", "url": GREEN_URL}],
                output="screen",
            ),
            Node(
                package="board_bridge",
                executable="serial_bridge",
                name="blue_bridge",
                parameters=[{"board": "blue", "url": BLUE_URL}],
                output="screen",
            ),
            Node(
                package="board_bridge",
                executable="relay",
                name="board_relay",
                output="screen",
            ),
        ]
    )
