// File path: /src/components/admin/order/create.order.tsx

import { App, Button, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import {
  createOrderDetailAPI,
  getOrderAPI,
  getProductAPI,
} from "../../../service/api";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

interface ICreateOrderDetailDTO {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

const CreateOrderDetail = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { message, notification } = App.useApp();

  // Load products & orders khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách sản phẩm
        const resProducts = await getProductAPI();
        setProducts(resProducts.data?.data?.result || []);

        // Lấy danh sách đơn hàng
        const resOrders = await getOrderAPI();
        setOrders(resOrders.data?.data);
      } catch (error) {
        console.error("Lỗi lấy products/orders", error);
        notification.error({
          message: "Lỗi tải dữ liệu",
          description: "Không thể lấy danh sách products hoặc orders từ server",
        });
      }
    };

    fetchData();
  }, [notification]);

  const onFinish = async (values: ICreateOrderDetailDTO) => {
    setIsSubmit(true);
    try {
      const res = await createOrderDetailAPI(values);
      if (res && res.data) {
        message.success("Tạo mới order detail thành công");
        form.resetFields();
        setOpen(false);
        refreshTable();
      } else {
        notification.error({ message: "Lỗi", description: "Tạo thất bại" });
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Có lỗi xảy ra",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm Order Detail"
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
          name="orderId"
          label="Order"
          rules={[{ required: true, message: "Vui lòng chọn order" }]}
        >
          <Select
            placeholder="Chọn order"
            options={orders.map((o) => ({
              label: `${o.id} - ${o.note || "Không có ghi chú"}`,
              value: o.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="productId"
          label="Product"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            options={products.map((p) => ({ label: p.name, value: p.id }))}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input type="" min={1} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <Input type="" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderDetail;
