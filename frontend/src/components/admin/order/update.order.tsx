// File path: /src/components/admin/order/update.order.tsx

import { App, Divider, Form, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateOrderDetailAPI } from "../../../service/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IOrderDetailFull | null;
  setDataUpdate: (v: IOrderDetailFull | null) => void;
  products: IProduct[];
  orders: IOrder[];
}

const UpdateOrderDetail = ({
  open,
  setOpen,
  refreshTable,
  dataUpdate,
  setDataUpdate,
  products,
  orders,
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
    if (!dataUpdate) return;
    setIsSubmit(true);
    try {
      await updateOrderDetailAPI(
        dataUpdate.orderId,
        dataUpdate.productId,
        values
      );
      message.success("Cập nhật thành công");
      form.resetFields();
      setOpen(false);
      setDataUpdate(null);
      refreshTable();
    } catch (error) {
      notification.error({ message: "Lỗi", description: "Cập nhật thất bại" });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật Order Detail"
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
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOrderDetail;
