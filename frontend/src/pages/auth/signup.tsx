import { App, Button, Divider, Form, Input, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import fb from "../../assets/png/facebook.png";
import gg from "../../assets/png/google.png";
import { useState } from "react";
import { registerAPI } from "../../service/api"; 

interface FieldType {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, email, password } = values;
    setIsSubmit(true);
    const res = await registerAPI(name, email, password);
    setIsSubmit(false);

    if (res?.data) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/dang-nhap"); 
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res?.message && Array.isArray(res.message)
            ? res.message[0]
            : res?.message || "Đăng ký thất bại!",
        duration: 5,
      });
    }
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="flex justify-center items-center">
        <div className="h-[600px]">
          <div>
            <h1>Tạo tài khoản mới</h1>
            <span>Vui lòng nhập thông tin để bắt đầu</span>
          </div>

          <div className="mt-[40px]">
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Họ tên không được để trống" }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Mật khẩu không được để trống" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="default"
                  className="w-full !bg-[#3A5B22] text-white"
                  htmlType="submit"
                  loading={isSubmit}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="my-[50px]">
            <Divider>Hoặc</Divider>
          </div>

          <div className="flex gap-4">
            <Button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:!bg-gray-100">
              <img src={gg} alt="Google" className="w-5 h-5" />
              <span className="text-gray-700">Đăng ký với Google</span>
            </Button>

            <Button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:!bg-gray-100">
              <img src={fb} alt="Facebook" className="w-5 h-5" />
              <span className="text-gray-700">Đăng ký với Facebook</span>
            </Button>
          </div>

          <div className="flex justify-center mt-[40px]">
            <div>
              Đã có tài khoản? <Link to={"/dang-nhap"}>Đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
