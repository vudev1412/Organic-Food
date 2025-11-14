import { App, Button, Divider, Form, Input, Modal } from "antd";
import { useState } from "react";
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

  const onFinish = async (values: ICreateSupplierDTO) => {
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
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mã" name="code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tax No" name="taxNo">
          <Input />
        </Form.Item>
        <Form.Item label="Điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
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
