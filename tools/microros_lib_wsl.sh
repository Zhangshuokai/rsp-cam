#!/bin/bash
# 在 WSL 里（重新）构建 micro-ROS 静态库，并拷回 Windows 工程。
#
# 为什么需要它：micro_ros_platformio 首次构建会用 POSIX shell + colcon 从源码编
# libmicroros，Windows 的 cmd 跑不了；WSL Ubuntu 里有 ROS 2 Jazzy + colcon，编好后
# 把 libmicroros/ 放回工程的 .pio 库目录，之后 Windows 上 pio run/upload 就能用。
#
# 在 WSL 里执行：
#   bash /mnt/c/vibecoding/rsp/tools/microros_lib_wsl.sh
#
# 改动 board_microros_distro / transport 后要先清库再来一遍：
#   cd <工程> && pio run -t clean_microros      （或直接删 .pio 库目录里的 libmicroros/）
set -euo pipefail

REPO_WSL=${REPO_WSL:-/mnt/c/vibecoding/rsp}
PROJ_REL="教学demo/ESP32-S3-microROS"
ENV_NAME="esp32-s3-devkitc-1"
WORK=${WORK:-$HOME/esp32microros}
VENV=${VENV:-$HOME/.pio-venv}

PROJ_WSL="$REPO_WSL/$PROJ_REL"
LIB_REL=".pio/libdeps/$ENV_NAME/micro_ros_platformio/libmicroros"

echo "== 1/4 准备 PlatformIO =="
if [ ! -x "$VENV/bin/pio" ]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q --upgrade pip
  "$VENV/bin/pip" install -q platformio
fi
[ -e "$HOME/.platformio/penv" ] || ln -s "$VENV" "$HOME/.platformio/penv"
"$VENV/bin/pio" --version

echo "== 2/4 同步工程到 $WORK =="
mkdir -p "$WORK/src"
cp -f "$PROJ_WSL/platformio.ini" "$WORK/"
cp -f "$PROJ_WSL/src/"*.cpp "$WORK/src/"
if [ -d "$PROJ_WSL/lib" ]; then
  rm -rf "$WORK/lib"
  cp -R "$PROJ_WSL/lib" "$WORK/lib"
fi

echo "== 3/4 构建（首次会 clone micro-ROS 源码并交叉编译，数分钟）=="
cd "$WORK"
"$VENV/bin/pio" run

echo "== 4/4 拷回 libmicroros =="
mkdir -p "$PROJ_WSL/$LIB_REL"
rm -rf "$PROJ_WSL/$LIB_REL"
cp -R "$WORK/$LIB_REL" "$PROJ_WSL/$LIB_REL"
ls -l "$PROJ_WSL/$LIB_REL/libmicroros.a"
echo "完成。回到 Windows 工程跑 pio run 即可（会跳过编库、直接链接）。"
