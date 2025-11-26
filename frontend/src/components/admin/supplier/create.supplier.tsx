// File path: /src/components/admin/supplier/create.supplier.tsx

import { App, Button, Divider, Form, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { createSupplierAPI } from "../../../service/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

const CreateSupplier = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  // Tự động sinh code từ tên
  const handleNameChange = (name: string) => {
    if (name) {
      const code = name
        .normalize("NFD") // tách dấu
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/\s+/g, "-") // thay khoảng trắng bằng "-"
        .replace(/[^a-zA-Z0-9\-]/g, ""); // bỏ ký tự đặc biệt
      form.setFieldsValue({ code });
    } else {
      form.setFieldsValue({ code: "" });
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await createSupplierAPI(values);

    if (res && res.data) {
      message.success("Tạo mới supplier thành công");
      form.resetFields();
      setOpen(false);
      refreshTable();
    } else {
      notification.error({ message: "Lỗi", description: "Tạo thất bại" });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm Supplier"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input onChange={(e) => handleNameChange(e.target.value)} />
        </Form.Item>

        <Form.Item label="Mã" name="code" hidden>
          <Input disabled placeholder="Tự động sinh từ tên" />
        </Form.Item>

        <Form.Item label="Mã số thuế" name="taxNo">
          <Input />
        </Form.Item>

        <Form.Item
          label="Điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không hợp lệ (VD: 0987654321)",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSupplier;
