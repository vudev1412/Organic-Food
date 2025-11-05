import { Button, Form, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const ChangePassword = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-[400px] text-center">
        {/* Nút quay lại + Tiêu đề */}
        <div className="flex items-center mb-6">
          <h2 className="flex-1 text-center text-lg font-semibold text-gray-800">
            Nhập mật khẩu
          </h2>
        </div>

        {/* Form */}
        <Form
          name="passwordForm"
          layout="vertical"
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại để xác minh"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="h-12 text-base"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#f86c5e] hover:bg-[#f74d3d] text-white w-full h-11 text-base font-medium rounded-md border-none"
            >
              XÁC NHẬN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
