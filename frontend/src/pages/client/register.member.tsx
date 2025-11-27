// src/pages/auth/RegisterPage.tsx

import React from "react";
import { Button, Form, Input, DatePicker, Radio, message, Typography, Card, Space } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const RegisterMemBerPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Gọi API đăng ký ở đây
      // const res = await registerAPI(values);
      // if (res.success) {
      //   message.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.");
      //   navigate("/login");
      // }

      // Giả lập thành công
      console.log("Đăng ký thành công:", values);
      message.success("Đăng ký thành công! Chuyển đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "40px 32px" }}
      >
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          {/* Logo + Tiêu đề */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 80,
                height: 80,
                margin: "0 auto 16px",
                background: "linear-gradient(135deg, #1890ff, #722ed1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(24,144,255,0.3)",
              }}
            >
              <UserOutlined style={{ fontSize: 40, color: "#fff" }} />
            </div>
            <Title level={2} style={{ margin: 0, color: "#1a1a1a" }}>
              Đăng ký tài khoản
            </Title>
            <Text type="secondary">Tham gia cùng chúng tôi ngay hôm nay!</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
            initialValues={{ gender: "other" }}
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0901234567" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item name="birthday" label="Ngày sinh">
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => current && current > dayjs().subtract(13, "year")}
              />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính">
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1890ff, #722ed1)",
                  border: "none",
                }}
              >
                Đăng ký ngay
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Đã có tài khoản?{" "}
              <Link to="/login" style={{ color: "#1890ff", fontWeight: 600 }}>
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default RegisterMemBerPage;