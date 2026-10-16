import os
from glob import glob

from setuptools import setup

package_name = "board_bridge"

setup(
    name=package_name,
    version="0.1.0",
    packages=[package_name],
    data_files=[
        ("share/ament_index/resource_index/packages", ["resource/" + package_name]),
        ("share/" + package_name, ["package.xml"]),
        (os.path.join("share", package_name, "launch"), glob("launch/*.launch.py")),
    ],
    install_requires=["setuptools"],
    zip_safe=True,
    maintainer="Developer",
    maintainer_email="dev@example.com",
    description="Bridge ESP32-S3 MicroPython boards to ROS 2 topics",
    license="MIT",
    entry_points={
        "console_scripts": [
            "serial_bridge = board_bridge.serial_bridge:main",
            "wifi_server = board_bridge.wifi_server:main",
            "relay = board_bridge.relay:main",
            "led_ui = board_bridge.led_ui:main",
        ],
    },
)
