/******************************************************************
 * 奇果派 EMotionPI 电机控制库
 * 
 * 此库用于ESP32S3控制电机驱动板，支持直流电机、编码器电机、舵机和底盘控制
 * 兼容QGPMaker电机驱动板
 * 
 * 官方网站: http://www.7gp.cn
 * version: 1.0.2
 * 
 ******************************************************************/

 #ifndef _QGPMaker_MotorShield_h_
 #define _QGPMaker_MotorShield_h_
 #include <Arduino.h>
 #include <inttypes.h>
 #include <Wire.h>
 #include "driver/mcpwm.h"
 #include <ESP32Encoder.h>
 // #define MOTORDEBUG // 取消注释以启用电机调试输出
 
 // 电机通道定义
 #define M1 0 // 电机1通道
 #define M2 1 // 电机2通道
 #define M3 2 // 电机3通道
 #define M4 3 // 电机4通道
 
 // 舵机通道定义
 #define S1 0 // 舵机1通道
 #define S2 1 // 舵机2通道
 #define S3 2 // 舵机3通道
 #define S4 3 // 舵机4通道
 
 // 电机运行模式
 #define FORWARD 1  // 正向运行
 #define BACKWARD 2 // 反向运行
 #define BRAKE 3    // 刹车
 #define RELEASE 4  // 释放(停止)
 
 // 引脚定义
 #define PIN_SW 45      // 开关引脚
 #define PIN_RGBLED 46  // RGB LED引脚
 
 // 转换常量
 #define RPM_TO_RPS 1 / 60 // RPM(每分钟转数)转换为RPS(每秒转数)
 
 #define LOG(...) printf(__VA_ARGS__) // 日志输出宏，用于调试
 class EMotionPI; // 前置声明
 
 /**
  * @brief 直流电机控制类
  * 
  * 提供对直流电机的基本控制功能，支持PWM速度控制
  */
 class EMO_DCMotor
 {
 public:
   /**
    * @brief 构造一个直流电机对象
    * 
    * @param unit MCPWM单元
    * @param timer MCPWM定时器
    * @param io_signal_a A信号输出引脚
    * @param io_signal_b B信号输出引脚
    * @param in_a_pin A控制引脚
    * @param in_b_pin B控制引脚
    * @param pwm_frequency PWM频率，默认16kHz
    */
   EMO_DCMotor(mcpwm_unit_t unit, mcpwm_timer_t timer,mcpwm_io_signals_t io_signal_a, mcpwm_io_signals_t io_signal_b,uint8_t in_a_pin, uint8_t in_b_pin, uint32_t pwm_frequency = 16000);
   friend class EMotionPI; // 允许EMotionPI类访问私有成员
   
   /**
    * @brief 运行电机
    * @param cmd 命令(FORWARD, BACKWARD, BRAKE, RELEASE)
    */
   void run(uint8_t);
   
   /**
    * @brief 设置电机速度
    * @param speed 速度值(0-100)
    */
   void setSpeed(uint8_t);
   
   /**
    * @brief 以特定PWM值旋转电机
    * @param pwm PWM值(-100到100)，负值表示反向旋转
    */
   void spin(int pwm);
   
   /**
    * @brief 电机正向旋转
    * @param duty 占空比(0.0-100.0)
    */
   void forward(float);
   
   /**
    * @brief 电机反向旋转
    * @param duty 占空比(0.0-100.0)
    */
   void reverse(float);
   
   /**
    * @brief 电机制动
    * @param duty 制动强度(0.0-100.0)
    */
   void brake(float);
   
   /**
    * @brief 释放电机(停止输出)
    */
   void release();
 
 private:
   uint8_t _speed, MDIR;
   EMotionPI *MC;
   uint8_t motornum;
   mcpwm_unit_t unit_;
   mcpwm_timer_t timer_;
   mcpwm_io_signals_t io_signal_a_;
   mcpwm_io_signals_t io_signal_b_;
   uint8_t in_a_pin_;
   uint8_t in_b_pin_;
 };
 
 /**
  * @brief 带编码器的电机控制类
  * 
  * 继承自EMO_DCMotor，增加了编码器和PID控制功能
  */
 class EMO_EncoderMotor : public EMO_DCMotor
 {
 public:
   /**
    * @brief 构造带编码器的电机对象
    * 
    * @param unit MCPWM单元
    * @param timer MCPWM定时器
    * @param io_signal_a A信号输出引脚
    * @param io_signal_b B信号输出引脚
    * @param in_a_pin A控制引脚
    * @param in_b_pin B控制引脚
    * @param encoder_pinA 编码器A相引脚
    * @param encoder_pinB 编码器B相引脚
    * @param cpr 每转计数次数
    * @param pwm_frequency PWM频率，默认16kHz
    */
   EMO_EncoderMotor(mcpwm_unit_t unit, mcpwm_timer_t timer, mcpwm_io_signals_t io_signal_a, mcpwm_io_signals_t io_signal_b, uint8_t in_a_pin, uint8_t in_b_pin, uint8_t encoder_pinA, uint8_t encoder_pinB, int cpr, uint32_t pwm_frequency = 16000);
   
   /**
    * @brief 初始化编码器电机
    * 
    * @param gearRation 齿轮减速比
    * @param ppr 每转脉冲数(默认12)
    */
   void begin(float gearRation, int ppr=12);

   void clearEncoderPos();
   
   /**
    * @brief 获取当前RPM(每分钟转速)
    * @return int 转速值
    */
   int getRPM();
   
   /**
    * @brief 获取编码器计数值
    * @return long 计数器值
    */
   long getTicks();
   
   /**
    * @brief 获取编码器位置
    * @return long 位置值
    */
   long getEncoderPos();
   
   /**
    * @brief 计算PID控制输出
    * 
    * @param setpoint 目标值
    * @param measured_value 测量值
    * @return double PID输出
    */
   double compute(float setpoint, float measured_value);
   
   /**
    * @brief 更新PID控制参数
    * 
    * @param kp 比例系数
    * @param ki 积分系数
    * @param kd 微分系数
    */
   void updatePIDConstants(float kp, float ki, float kd);
   
   /**
    * @brief 以指定RPM旋转电机
    * @param pwm 目标RPM
    */
   void spinRPM(int pwm);
   
   /**
    * @brief 将电机移动到指定角度
    * @param angle 目标角度(度)
    */
   bool moveToAngle(float angle, int timeout = 1000,int error_limit = 10);
   
   /**
    * @brief 更新当前RPM计算
    */
   void updateRPM();
 
 private:
   uint8_t encoder_pinA_;
   uint8_t encoder_pinB_;
   uint8_t encoder_num;
   long encoderPos;
   int counts_per_rev_;
   unsigned long prev_update_time_;
   long prev_encoder_ticks_;
   double current_rpm_;
   ESP32Encoder encoder;
   EMotionPI *MC;
 
   // =====PID======
   float min_val_ = -100;
   float max_val_ = 100;
   float kp_ ;
   float ki_ ;
   float kd_;
   float kp_p;
   float ki_p;
   float kd_p;
   double integral_;
   double derivative_;
   double prev_error_;
 };
 
 /**
  * @brief 舵机控制类
  * 
  * 提供舵机的基本控制功能
  */
 class EMO_Servo
 {
 public:
   /**
    * @brief 构造一个舵机对象
    * 
    * @param unit MCPWM单元
    * @param timer MCPWM定时器
    * @param iosignal 输出信号
    * @param op MCPWM操作符
    * @param in_a_pin 控制引脚
    * @param pwm_frequency PWM频率，默认50Hz
    */
   EMO_Servo(mcpwm_unit_t unit, mcpwm_timer_t timer, mcpwm_io_signals_t iosignal, mcpwm_operator_t op, int in_a_pin, uint32_t pwm_frequency = 50);
   friend class EMotionPI;
   
   /**
    * @brief 绑定舵机到指定引脚
    * 
    * @param pin 引脚号
    * @return uint8_t 通道号，失败则返回INVALID_SERVO
    */
   uint8_t attach(int pin);
   
   /**
    * @brief 绑定舵机到指定引脚并设置脉宽范围
    * 
    * @param pin 引脚号
    * @param min 最小脉宽(微秒)
    * @param max 最大脉宽(微秒)
    * @return uint8_t 通道号，失败则返回INVALID_SERVO
    */
   uint8_t attach(int pin, int min, int max);
   
   /**
    * @brief 解绑舵机
    */
   void detach();
   
   /**
    * @brief 写入舵机角度或脉宽
    * 
    * @param value 如果<200则作为角度(0-180)，否则作为脉宽(微秒)
    */
   void write(int value);
   
   /**
    * @brief 写入脉宽(微秒)
    * @param value 脉宽值(通常在1000-2000之间)
    */
   void writeMicroseconds(int value);
   
   /**
    * @brief 读取当前舵机角度
    * @return int 角度值(0-180)
    */
   int read();
   
   /**
    * @brief 读取当前脉宽
    * @return int 脉宽值(微秒)
    */
   int readMicroseconds();
   
   /**
    * @brief 设置PWM占空比
    * @param duty_cycle 占空比(0.0-100.0)
    */
   void setPwm(float duty_cycle);
 
 private:
   mcpwm_unit_t unit_;
   mcpwm_timer_t timer_;
   mcpwm_io_signals_t iosignal_;
   mcpwm_operator_t op_;
   uint8_t in_a_pin_;
   uint16_t PWMfreq;
   EMotionPI *MC;
   uint8_t servonum, currentAngle;
   uint16_t min_;
   uint16_t max_;
 };
 
 /**
  * @brief 底盘控制类
  * 
  * 提供差速、滑移转向和麦克纳姆轮底盘的运动控制
  */
 class BaseChassis
 {
 public:
   friend class EMotionPI;
   
   /**
    * @brief 底盘类型枚举
    */
   enum base
   {
       DIFFERENTIAL_DRIVE, // 差速驱动(两轮)
       SKID_STEER,         // 滑移转向(四轮差速)
       MECANUM             // 麦克纳姆轮(全向)
   };
 
   base base_platform_; // 底盘类型
 
   /**
    * @brief 电机RPM结构体
    */
   struct rpm
   {
       float motor1; // 电机1转速
       float motor2; // 电机2转速
       float motor3; // 电机3转速
       float motor4; // 电机4转速
   };
 
   /**
    * @brief 速度结构体
    */
   struct velocities
   {
       float linear_x;  // X轴线速度
       float linear_y;  // Y轴线速度
       float angular_z; // Z轴角速度
   };
 
   /**
    * @brief PWM输出结构体
    */
   struct pwm
   {
       int motor1; // 电机1 PWM值
       int motor2; // 电机2 PWM值
       int motor3; // 电机3 PWM值
       int motor4; // 电机4 PWM值
   };
   
   /**
    * @brief 简单构造底盘对象
    * @param robot_base 底盘类型
    */
   BaseChassis(base robot_base);
 
   /**
    * @brief 详细构造底盘对象
    * 
    * @param robot_base 底盘类型
    * @param motor_max_rpm 电机最大RPM
    * @param gear_ratio 齿速比
    * @param ppr 电机编码器每转脉冲数
    * @param wheel_diameter 车轮直径(米)
    * @param wheels_y_distance 轮距(米)
    */
   BaseChassis(base robot_base, int motor_max_rpm, int gear_ratio,int ppr,float motor_operating_voltage,
               float wheel_diameter, float wheels_y_distance);
   
   /**
    * @brief 从电机转速计算底盘速度
    * 
    * @param rpm1 电机1 RPM
    * @param rpm2 电机2 RPM
    * @param rpm3 电机3 RPM
    * @param rpm4 电机4 RPM
    * @return velocities 底盘速度
    */
   velocities getVelocities(float rpm1, float rpm2, float rpm3, float rpm4);
   
   /**
    * @brief 从期望速度计算电机RPM
    * 
    * @param linear_x X轴线速度(米/秒)
    * @param linear_y Y轴线速度(米/秒)
    * @param angular_z Z轴角速度(弧度/秒)
    * @return rpm 各电机RPM
    */
   rpm getRPM(float linear_x, float linear_y, float angular_z);
   
   /**
    * @brief 从期望速度计算电机PWM
    * 
    * @param linear_x X轴线速度(米/秒)
    * @param linear_y Y轴线速度(米/秒)
    * @param angular_z Z轴角速度(弧度/秒)
    * @return pwm 各电机PWM
    */
   pwm getPWM(float linear_x, float linear_y, float angular_z);
   
   /**
    * @brief 获取最大RPM
    * @return float 最大RPM
    */
   float getMaxRPM();
   
   /**
    * @brief 设置最大PWM输出
    * @param max_pwm 最大PWM值(0-100)
    */
   void setMaxPWM(int max_pwm);
 
   /**
    * @brief 更新底盘速度
    * 
    * @param linear_x X轴线速度(米/秒)
    * @param linear_y Y轴线速度(米/秒)
    * @param angular_z Z轴角速度(弧度/秒)
    */
   void updateVelocity(float linear_x, float linear_y, float angular_z);
   
   /**
    * @brief 更新电机占空比
    * 
    * @param duty_x X轴占空比(-100.0到100.0)
    * @param duty_y Y轴占空比(-100.0到100.0)
    * @param duty_z Z轴旋转占空比(-100.0到100.0)
    */
   void updateDuty(float duty_x, float duty_y, float duty_z);
   
   /**
    * @brief 获取里程计数据
    * 
    * @param x 输出X位置(米)
    * @param y 输出Y位置(米)
    * @param theta 输出角度(弧度)
    */
   void getOdometry(float &x, float &y, float &theta);
 
   /**
    * @brief 停止所有电机
    * @param duty 停止强度(0.0-100.0)，默认为0
    */
   void stop(float duty=0);
 
 private:
   rpm calculateRPM(float linear_x, float linear_y, float angular_z);
   pwm calculatePWM(float linear_x, float linear_y, float angular_z);
   int getTotalWheels(base robot_base);
   EMotionPI *MC;
   float max_rpm_;
   float wheels_y_distance_;
   float pwm_res_;
   float wheel_circumference_;
   int total_wheels_;
   int max_pwm_;
 };
 
 /**
  * @brief EMotionPI主控制类
  *
  * 此类提供了控制直流电机、舵机和编码器电机的接口。
  * 还包括测量电压和创建底盘控制器的功能。
  */
 class EMotionPI
 {
 public:
   /**
    * @brief 构造EMotionPI对象
    */
   EMotionPI();
   friend class EMO_DCMotor;
   friend class BaseChassis;
   
   /**
    * @brief 初始化控制器
    */
   void begin();
 
   /**
    * @brief 设置PWM输出
    * 
    * @param pin 引脚号
    * @param val PWM值
    */
   void setPWM(uint8_t pin, uint16_t val);
   
   /**
    * @brief 设置引脚输出状态
    * 
    * @param pin 引脚号
    * @param val 状态(HIGH/LOW)
    */
   void setPin(uint8_t pin, boolean val);
   
   /**
    * @brief 获取直流电机实例
    * 
    * @param n 电机编号(0-3)
    * @return EMO_DCMotor* 电机对象指针
    */
   EMO_DCMotor *getMotor(uint8_t n);
   
   /**
    * @brief 获取舵机实例
    * 
    * @param n 舵机编号(0-3)
    * @return EMO_Servo* 舵机对象指针
    */
   EMO_Servo *getServo(uint8_t n);
   
   /**
    * @brief 获取编码器电机实例
    * 
    * @param n 电机编号(0-3)
    * @return EMO_EncoderMotor* 编码器电机对象指针
    */
   EMO_EncoderMotor *getEncoderMotor(uint8_t n);
   
   /**
    * @brief 读取电源电压
    * @return float 电压值(伏特)
    */
   float readVoltage();
 
   /**
    * @brief 创建底盘控制器
    * 
    * @param robot_base 底盘类型
    * @return BaseChassis* 底盘对象指针
    */
   BaseChassis *createBaseChassis(BaseChassis::base robot_base);

    /**
      * @brief 获取底盘控制器实例
      * @param robot_base 底盘类型
      * @param motor_max_rpm 电机最大RPM
      * @param gear_ratio 齿速比
      * @param ppr 电机编码器每转脉冲数
      * @param motor_operating_voltage 电机工作电压
      * @param wheel_diameter 车轮直径(米)
      * @param wheels_y_distance 轮距(米)
      * @return BaseChassis* 底盘对象指针
      */
   BaseChassis *createBaseChassis(BaseChassis::base robot_base, int motor_max_rpm, int gear_ratio,int ppr,float motor_operating_voltage,
               float wheel_diameter, float wheels_y_distance);
 
 private:
   EMO_DCMotor dcmotors[4];
   EMO_Servo servos[4];
   EMO_EncoderMotor encoderMotors[4];
   BaseChassis *chassis;
   float voltage;
   uint16_t analogReadAvg(uint8_t pin);
 };
 
 #endif