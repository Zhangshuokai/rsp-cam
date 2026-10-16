import os

from launch import LaunchDescription
from launch_ros.actions import Node

PORT = int(os.environ.get("WIFI_PORT", "6001"))
UI_PORT = int(os.environ.get("UI_PORT", "8080"))
UI_HOST = os.environ.get("UI_HOST", "127.0.0.1")


def generate_launch_description():
    return LaunchDescription(
        [
            Node(
                package="board_bridge",
                executable="wifi_server",
                name="wifi_server",
                parameters=[{"port": PORT}],
                output="screen",
            ),
            Node(
                package="board_bridge",
                executable="relay",
                name="board_relay",
                output="screen",
            ),
            Node(
                package="board_bridge",
                executable="led_ui",
                name="led_ui",
                parameters=[{"port": UI_PORT, "host": UI_HOST}],
                output="screen",
            ),
        ]
    )
