import { App, Button, Divider, Form, Input, InputNumber, Modal, DatePicker, type FormProps } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { createUserAPI, createEmployeeProfileAPI } from "../../../service/api";

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
  hireDate: Dayjs | null; // dayjs object
  salary: number;
  address: string;
};

const CreateEmployee = ({ openModelCreate, setOpenModalCreate, refreshTable }: IProps) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<FieldType>();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      // 1️⃣ Tạo user
      const resUser = await createUserAPI(
        values.name,
        values.email,
        values.password,
        values.phone,
        "EMPLOYEE"
      );
      if (!resUser?.data?.data?.id) throw new Error("Tạo user thất bại");

      const userId = resUser.data.data.id;

      // 2️⃣ Tạo EmployeeProfile
      const resProfile = await createEmployeeProfileAPI({
        user: { id: userId },
        hireDate: values.hireDate ? values.hireDate.toISOString() : "",
        salary: values.salary,
        address: values.address,
      });
      if (!resProfile?.data?.data?.id) throw new Error("Tạo profile thất bại");

      message.success("Tạo nhân viên thành công");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } catch (err: any) {
      notification.error({
        message: "Xảy ra lỗi",
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Thêm mới nhân viên"
      open={openModelCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpenModalCreate(false);
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không hợp lệ (VD: 0987654321)",
            },
          ]}
        >
          <Input placeholder="0987654321" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu làm việc"
          name="hireDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="Lương"
          name="salary"
          rules={[{ required: true, message: "Vui lòng nhập lương!" }]}
        >
          <Input style={{ width: "100%" }} min={0} placeholder="5000000" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEmployee;
