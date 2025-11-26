// File path: /src/components/admin/supplier/update.supplier.tsx

import { App, Divider, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateSupplierAPI } from "../../../service/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: ISupplier | null;
  setDataUpdate: (v: ISupplier | null) => void;
}
const UpdateSupplier = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue(dataUpdate);
    }
  }, [dataUpdate]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const res = await updateSupplierAPI(values.id, values);

    if (res && res.data) {
      message.success("Cập nhật thành công");
      form.resetFields();
      setOpen(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({ message: "Lỗi", description: "Cập nhật thất bại" });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật Supplier"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpen(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
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

export default UpdateSupplier;
