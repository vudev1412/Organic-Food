import { Button, Divider, Form, Input } from "antd";
import { Link } from "react-router-dom";
import bg from "../assets/png/bg-auth.png";
import fb from "../assets/png/facebook.png";
import gg from "../assets/png/google.png";
const SingIn = () => {
  const [form] = Form.useForm();

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex justify-center items-center">
        <div className=" h-[600px]">
          <div className="">
            <h1>Chào mừng bạn quay lại!</h1>
            <span>Vui lòng nhập thông tin để truy cập tài khoản của bạn</span>
          </div>
          <div className="mt-[40px]">
            <Form
              layout={"vertical"}
              form={form}
              // initialValues={{ layout: ve }}
              // onValuesChange={onFormLayoutChange}
              // style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
            >
              <Form.Item label="Email">
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item label="Mật khẩu">
                <Input placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="default"
                  className="w-full !bg-[#3A5B22] text-white"
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
      <div className="w-1/2 h-screen">
        <div className="w-full h-full">
          <img src={bg} alt="" className="w-full h-full " />
        </div>
      </div>
    </div>
  );
};
export default SingIn;
