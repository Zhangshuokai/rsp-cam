# QGP_EVMotor（精简子集，随工程内置）

官方「奇果派 S3 机器人控制板」Arduino 库 `QGP_EVMotor` 的**裁剪子集**，只保留 micro-ROS
固件要用的电机/底盘/编码器部分：

```
library.properties
src/EMotionPI.h          EMotionPI / EMO_DCMotor / EMO_EncoderMotor / EMO_Servo / BaseChassis
src/ESP32Encoder.h       编码器头文件（EMotionPI.h 依赖）
src/esp32s3/libqgpmotor.a 官方预编译静态库（esp32s3，core 2.0.x）
```

**未包含**：蓝牙手柄（`BLEControlStick.h` + NimBLE 全套，约 4.5 MB）、PS2、MQTT、
SBUS、WFJoystick、IMU/MPU6050 与 11 个 Arduino 示例——micro-ROS 固件里用不到。
完整官方包（1.6 MB）见 `教学webppt/ESP32-S3电机驱动板/files/QGP_EVMotor.zip`，
API 速查见 `docs/ESP32-S3电机驱动板资料.md` 第三节。

## 为什么 platformio.ini 里要加 `-lqgpmotor`

`library.properties` 声明了 `precompiled=true`，PlatformIO 会据此把
`src/esp32s3/` 加进 `LIBPATH`，但**不会自动加 `-lqgpmotor`**（归档名 `libqgpmotor.a`
与库名 `QGP_EVMotor` 对不上）。不补这一行，链接会报一串
`undefined reference to EMotionPI::begin()` 之类。所以本工程写了：

```ini
build_flags =
  -Llib/QGP_EVMotor/src/esp32s3
  -lqgpmotor
```

来源：奇果派工坊（`QGP_EVMotor.zip`），此处仅为工程内可复现的裁剪副本。
