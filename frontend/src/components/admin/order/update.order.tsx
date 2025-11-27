// src/components/admin/order/update.order.tsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Tag,
  Space,
  message,
  Card,
  Image,
  InputNumber,
  Divider,
  Avatar,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { updateOrder, getProductsAPI } from "../../../service/api";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IOrder | null;
  refreshTable: () => void;
}

// Enum trạng thái - PHẢI ĐÚNG Y HỆT backend
const statusOptions = [
  { value: "PENDING", label: "Chờ xác nhận", color: "orange" },
  { value: "PROCESSING", label: "Đang xử lý", color: "blue" },
  { value: "SHIPPING", label: "Đang giao hàng", color: "purple" },
  { value: "DELIVERED", label: "Đã giao", color: "green" },
  { value: "CANCELLED", label: "Đã hủy", color: "red" },
];

const getProductImageUrl = (image: string | undefined | null) => {
  if (!image) return "/default-product.png";
  return image.startsWith("http")
    ? image
    : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${image}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const UpdateOrder = ({ open, setOpen, data, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (open) loadProducts();
  }, [open]);

  const loadProducts = async () => {
    try {
      const res = await getProductsAPI("page=1&size=1000&active=true");
      setProducts(res.data?.data?.result || []);
    } catch (error) {
      message.error("Không tải được danh sách sản phẩm");
    }
  };

  // Fill form khi mở modal
  useEffect(() => {
    if (!data || products.length === 0) return;

    form.setFieldsValue({
      statusOrder: data.statusOrder, // ĐÚNG TÊN FIELD BACKEND
      shipAddress: data.shipAddress,
      note: data.note,
      estimatedDate: data.estimatedDate ? dayjs(data.estimatedDate) : null,
      actualDate: data.actualDate ? dayjs(data.actualDate) : null,
      orderDetails: data.orderDetails?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })) || [],
    });
  }, [data, products, form]);

  const handleSubmit = async (values: any) => {
    if (!data?.id) return;

    setLoading(true);
    try {
      const payload = {
        statusOrder: values.statusOrder,           // ĐÃ ĐÚNG
        shipAddress: values.shipAddress || null,
        note: values.note || null,
        estimatedDate: values.estimatedDate?.toISOString() || null,
        actualDate: values.actualDate?.toISOString() || null,
        orderDetails: (values.orderDetails || [])
          .filter((d: any) => d.productId && d.quantity > 0)
          .map((d: any) => ({
            productId: Number(d.productId),
            quantity: Number(d.quantity),
          })),
      };

      console.log("Payload gửi đi:", payload); // Debug

      await updateOrder(data.id, payload);
      message.success("Cập nhật đơn hàng thành công!");
      setOpen(false);
      refreshTable(); // BẮT BUỘC
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space align="center">
          <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
            Cập nhật đơn hàng
          </Title>
          <Tag color="blue" style={{ fontSize: 18, padding: "8px 16px", fontWeight: 600 }}>
            DH{String(data?.id || "").padStart(6, "0")}
          </Tag>
        </Space>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
        {/* TRẠNG THÁI ĐƠN HÀNG */}
        <Card style={{ marginBottom: 24, borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
          <Form.Item
            label={<Text strong style={{ fontSize: 16 }}>Trạng thái đơn hàng</Text>}
            name="statusOrder"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select size="large" placeholder="Chọn trạng thái đơn hàng">
              {statusOptions.map(s => (
                <Select.Option key={s.value} value={s.value}>
                  <Tag color={s.color} style={{ margin: 0, fontWeight: 600 }}>
                    {s.label}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Địa chỉ giao hàng" name="shipAddress">
              <Input size="large" placeholder="Nhập địa chỉ giao hàng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} placeholder="Ghi chú cho shipper..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Ngày dự kiến giao" name="estimatedDate">
              <DatePicker
                showTime
                size="large"
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn ngày dự kiến"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ngày giao thực tế" name="actualDate">
              <DatePicker
                showTime
                size="large"
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn ngày giao thực tế"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* CHI TIẾT SẢN PHẨM */}
        <Divider>
          <span className="text-xl font-semibold text-blue-600">Chi tiết sản phẩm</span>
        </Divider>

        <Form.List name="orderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card key={key} className="mb-6 shadow-md" size="small">
                  <Space align="start" size={16} className="w-full">
                    <Form.Item
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Chọn sản phẩm" }]}
                      className="mb-0 flex-1"
                    >
                      <Select
                        showSearch
                        size="large"
                        placeholder="Tìm & chọn sản phẩm..."
                        optionFilterProp="children"
                        loading={products.length === 0}
                      >
                        {products.map(p => (
                          <Select.Option key={p.id} value={p.id}>
                            <Space>
                              <Avatar size={32} src={getProductImageUrl(p.image)} shape="square" />
                              <div>
                                <div className="font-medium">{p.name}</div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {formatPrice(p.price)}
                                </Text>
                              </div>
                            </Space>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item name={[name, "quantity"]} rules={[{ required: true }]} initialValue={1}>
                      <InputNumber min={1} size="large" style={{ width: 120 }} />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger size="large" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    )}
                  </Space>
                </Card>
              ))}

              <Button type="dashed" block size="large" icon={<PlusOutlined />} onClick={() => add()}>
                Thêm sản phẩm
              </Button>
            </>
          )}
        </Form.List>

        {/* TỔNG TIỀN */}
        <Form.Item shouldUpdate noStyle>
          {() => {
            const details = form.getFieldValue("orderDetails") || [];
            const total = details.reduce((sum: number, item: any) => {
              const product = products.find(p => p.id === item.productId);
              return sum + (product?.price || 0) * (item.quantity || 0);
            }, 0);

            if (total === 0) return null;

            return (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-right shadow-xl">
                <Text className="text-3xl font-bold">Tổng tiền: {formatPrice(total)}</Text>
              </div>
            );
          }}
        </Form.Item>

        <div className="flex justify-end gap-4 mt-10">
          <Button size="large" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={loading} className="px-12 font-bold text-lg">
            Cập nhật đơn hàng
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateOrder;