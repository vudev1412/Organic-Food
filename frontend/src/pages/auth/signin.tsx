import { App, Button, Divider, Form, Input, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/png/bg-auth.png";
import fb from "../../assets/png/facebook.png";
import gg from "../../assets/png/google.png";
import { useState } from "react";
import { loginAPI } from "../../service/api";
import { useCurrentApp } from "../../components/context/app.context";
interface FieldType {
  username: string;
  password: string;
}
const SingIn = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const {message, notification} = App.useApp();
  const {setIsAuthenticated, setUser} = useCurrentApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await loginAPI(username, password);
    console.log(res.data);
    setIsSubmit(false);
    if (res?.data) {
      setIsAuthenticated(true); 
      setUser(res.data.data.userLogin);
      localStorage.setItem("access_token", res.data?.data?.access_token);
      message.success("Đăng nhập tài khoản thành công");
      navigate("/");
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
          duration: 5
      });
    }
  };
  return (
    <div className="flex h-screen justify-center">
      <div className=" flex justify-center items-center">
        <div className=" h-[600px]">
          <div className="">
            <h1>Chào mừng bạn quay lại!</h1>
            <span>Vui lòng nhập thông tin để truy cập tài khoản của bạn</span>
          </div>
          <div className="mt-[40px]">
            <Form
              layout={"vertical"}
              form={form}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="username"
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
                rules={[
                  { required: true, message: "Mật khẩu không được để trống" },
                ]}
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
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-end">
            <Link to={"/"}>Quên mật khẩu</Link>
          </div>
          <div className="my-[50px]">
            <Divider>Hoặc</Divider>
          </div>
          <div className="flex gap-4">
            <div className="">
              <Button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:!bg-gray-100">
                <img src={gg} alt="Google" className="w-5 h-5" />
                <span className="text-gray-700">Đăng nhập với Google </span>
              </Button>
            </div>
            <div className="">
              <Button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:!bg-gray-100">
                <img src={fb} alt="Facebook" className="w-5 h-5" />
                <span className="text-gray-700">Đăng nhập với Facebook</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-[40px]">
            <div className="">
              Chưa có tài khoản? <Link to={"/dang-ky"}>Đăng ký</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingIn;
