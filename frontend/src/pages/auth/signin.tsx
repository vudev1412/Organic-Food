import { App, Button, Divider, Form, Input, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../service/api";
import { useCurrentApp } from "../../components/context/app.context";
import fb from "../../assets/png/facebook.png";
import gg from "../../assets/png/google.png";


interface FieldType {
  username: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    try {
      const res = await loginAPI(username, password);
      if (res?.data) {
        setIsAuthenticated(true);
        setUser(res.data.data.userLogin);
        localStorage.setItem("access_token", res.data.data.access_token);
        message.success("Đăng nhập tài khoản thành công");
        navigate("/");
      } else {
        notification.error({
          message: "Xảy ra lỗi",
          description: res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="flex min-h-screen">


      {/* Right form */}
      <div className="flex flex-1 justify-center items-center bg-white">
        <div className="w-full max-w-md p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng quay lại!</h2>
          

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Tài khoản"
              name="username"
              rules={[{ required: true, message: "Tài khoản không được để trống" }]}
            >
              <Input placeholder="Nhập email hoặc số điện thoại" size="large" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mật khẩu không được để trống" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#3A5B22] hover:bg-[#2e4718] text-white font-semibold"
                loading={isSubmit}
                size="large"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="flex justify-end mb-4">
            <Link className="text-sm text-[#3A5B22] hover:underline" to={"/"}>
              Quên mật khẩu?
            </Link>
          </div>

          <Divider>Hoặc</Divider>

          <div className="flex gap-4 mb-6">
            <Button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100">
              <img src={gg} alt="Google" className="w-5 h-5" />
              <span className="text-gray-700">Google</span>
            </Button>
            <Button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100">
              <img src={fb} alt="Facebook" className="w-5 h-5" />
              <span className="text-gray-700">Facebook</span>
            </Button>
          </div>

          <div className="text-center">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link className="text-[#3A5B22] font-semibold hover:underline" to={"/dang-ky"}>
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
