import { App, Button, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useState } from "react";
import { createUserAPI } from "../../../service/api";

interface IProps {
  openModelCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}
type FieldType = {
  name: string;
  password: string;
  email: string;
  phone: string;
};
const CreateEmployee = (props: IProps) => {
  const { openModelCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { name, password, email, phone } = values;
    setIsSubmit(true);
    const res = await createUserAPI(
      name,
      email,
      password,
      phone,
      "EMPLOYEE"
    );
    if (res && res.data) {
      message.success("Tạo mới user thành công");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Xảy ra lỗi",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
    setIsSubmit(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModelCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
          form.resetFields();
        }}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form 
            form={form}
            name="basic"
            style={{maxWidth:600}}
            onFinish={onFinish}
            autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password />
          </Form.Item>

         
        </Form>
      </Modal>
    </>
  );
};
export default CreateEmployee;
