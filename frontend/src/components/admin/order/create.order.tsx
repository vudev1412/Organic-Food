// src/components/admin/order/create.order.tsx

import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Divider,
  Card,
  Image,
  Typography,
  App,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { createOrder, getProductsAPI } from "../../../service/api";

const { Text } = Typography;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

const getProductImageUrl = (image: string | undefined | null): string => {
  if (!image) return "/default-product.png";
  if (image.startsWith("http")) return image;
  return `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${image}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const CreateOrder = ({ open, setOpen, refreshTable }: IProps) => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProductsAPI("page=1&size=1000&active=true");
      setProducts(res.data?.data?.result || []);
    } catch {
      notification.error({ message: "Lỗi", description: "Không tải được sản phẩm" });
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    const payload = {
      customerDTO: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      shipAddress: values.address,
      note: values.note || "",
      orderDetails: values.orderDetails
        .filter((d: any) => d.productId && d.quantity > 0)
        .map((d: any) => ({
          productId: d.productId,
          quantity: d.quantity,
        })),
    };

    try {
      await createOrder(payload);
      message.success("Tạo đơn hàng thành công!");
      form.resetFields();
      setOpen(false);
      refreshTable();
    } catch (err: any) {
      notification.error({
        message: "Tạo đơn hàng thất bại",
        description: err.response?.data?.message || "Vui lòng thử lại",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title={<span className="text-xl font-bold text-blue-600">Tạo đơn hàng mới</span>}
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpen(false);
      }}
      okText="Tạo đơn hàng"
      cancelText="Hủy"
      confirmLoading={isSubmit}
      width={1000}
      destroyOnClose
      className="top-4"
    >
      <Form form={form} onFinish={onFinish} layout="vertical" className="mt-4">
        {/* Thông tin khách hàng */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
              <Input size="large" placeholder="Nguyễn Văn A" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input size="large" placeholder="khach@example.com" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, pattern: /^0\d{9}$/, message: "SĐT không hợp lệ" }]}
            >
              <Input size="large" placeholder="0901234567" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ giao hàng" rules={[{ required: true }]}>
              <Input.TextArea rows={2} size="large" placeholder="123 Đường Láng, Hà Nội..." />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú (tùy chọn)" className="md:col-span-2">
              <Input.TextArea rows={2} placeholder="Giao buổi chiều, gọi trước khi đến..." />
            </Form.Item>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Danh sách sản phẩm */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h3>

          <Form.List name="orderDetails" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} className="mb-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex flex-wrap items-start gap-4">
                      {/* Chọn sản phẩm */}
                      <Form.Item name={[name, "productId"]} rules={[{ required: true }]} className="mb-0 flex-1 min-w-64">
                        <Select
                          showSearch
                          size="large"
                          placeholder="Tìm & chọn sản phẩm..."
                          optionFilterProp="children"
                          loading={products.length === 0}
                          className="w-full"
                          options={products.map((p) => ({
                            label: p.name,
                            value: p.id,
                            product: p,
                          }))}
                          onChange={(_, option: any) => {
                            const product = option?.product as IProduct;
                            if (product) {
                              form.setFieldsValue({
                                orderDetails: {
                                  [name]: {
                                    preview: {
                                      name: product.name,
                                      image: product.image,
                                      price: product.price,
                                    },
                                  },
                                },
                              });
                            }
                          }}
                        />
                      </Form.Item>

                      {/* Số lượng */}
                      <Form.Item name={[name, "quantity"]} initialValue={1} rules={[{ required: true }]} className="mb-0">
                        <InputNumber min={1} size="large" className="w-32" />
                      </Form.Item>

                      {/* Xóa */}
                      {fields.length > 1 && (
                        <Button danger size="large" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      )}
                    </div>

                    {/* Preview sản phẩm đã chọn */}
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const preview = form.getFieldValue(["orderDetails", name, "preview"]);
                        if (!preview) return null;

                        const totalLine = (preview.price || 0) * (form.getFieldValue(["orderDetails", name, "quantity"]) || 1);

                        return (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <Space>
                              <Image
                                width={64}
                                height={64}
                                src={getProductImageUrl(preview.image)}
                                className="rounded-lg object-cover border"
                                preview={false}
                                fallback="/default-product.png"
                              />
                              <div>
                                <Text strong className="text-base block">{preview.name}</Text>
                                <Text type="secondary" className="text-sm">
                                  Giá: <span className="font-medium">{formatPrice(preview.price)}</span>
                                </Text>
                                <Text className="text-sm block mt-1">
                                  Thành tiền: <span className="text-lg font-bold text-red-600">{formatPrice(totalLine)}</span>
                                </Text>
                              </div>
                            </Space>
                          </div>
                        );
                      }}
                    </Form.Item>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  size="large"
                  className="h-12 text-base font-medium"
                >
                  Thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>
        </div>

        {/* Tổng tiền */}
        <Form.Item shouldUpdate noStyle>
          {() => {
            const details = form.getFieldValue("orderDetails") || [];
            const total = details.reduce((sum: number, item: any) => {
              const product = products.find(p => p.id === item.productId);
              const qty = item.quantity || 0;
              return sum + (product?.price || 0) * qty;
            }, 0);

            if (total === 0) return null;

            return (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
                <Text className="text-2xl font-bold block text-right">
                  Tổng tiền: {formatPrice(total)}
                </Text>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrder;