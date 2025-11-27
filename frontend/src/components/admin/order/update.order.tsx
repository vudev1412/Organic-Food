// File path: /src/components/admin/order/update.order.tsx

import { Modal, Form, Input, Select, DatePicker, Button, Tag, Space, message, Card, Image, InputNumber, Divider, Avatar } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { updateOrder, getProductsAPI } from "../../../service/api";
import { Text } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IOrder | null;
  refreshTable: () => void;
}

const getProductImageUrl = (image: string | undefined | null) => {
  if (!image) return "/default-product.png";
  return image.startsWith("http") ? image : `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}${image}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const UpdateOrder = ({ open, setOpen, data, refreshTable }: IProps) => {
  const [form] = useForm();
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

  // KHI MỞ MODAL → HIỆN LUÔN TÊN + ẢNH SẢN PHẨM
  useEffect(() => {
    if (data && products.length > 0) {
      const orderDetails = data.orderDetails?.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          preview: product ? {
            name: product.name,
            image: product.image,
            price: product.price,
          } : null,
        };
      }) || [];

      form.setFieldsValue({
        statusOrder: data.statusOrder,
        shipAddress: data.shipAddress,
        note: data.note,
        estimatedDate: data.estimatedDate ? dayjs(data.estimatedDate) : null,
        actualDate: data.actualDate ? dayjs(data.actualDate) : null,
        orderDetails,
      });
    }
  }, [data, products, form]);

  const handleSubmit = async (values: any) => {
    if (!data?.id) return;

    setLoading(true);
    try {
      const payload = {
        statusOrder: values.statusOrder,
        shipAddress: values.shipAddress,
        note: values.note,
        estimatedDate: values.estimatedDate?.toISOString() || null,
        actualDate: values.actualDate?.toISOString() || null,
        orderDetails: values.orderDetails
          ?.filter((d: any) => d.productId && d.quantity > 0)
          .map((d: any) => ({
            productId: d.productId,
            quantity: d.quantity,
          })),
      };

      await updateOrder(data.id, payload);
      message.success("Cập nhật đơn hàng thành công!");
      setOpen(false);
      refreshTable();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="text-2xl font-bold text-blue-600">
          Cập nhật đơn hàng <Tag color="blue" className="text-xl px-4 py-1">{`DH${String(data?.id || "").padStart(6, "0")}`}</Tag>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1100}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Form.Item label="Trạng thái" name="statusOrder" rules={[{ required: true }]}>
            <Select size="large" placeholder="Chọn trạng thái">
              <Select.Option value="PENDING">Chờ xác nhận</Select.Option>
              <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
              <Select.Option value="SHIPPING">Đang giao</Select.Option>
              <Select.Option value="DELIVERED">Đã giao</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngày dự kiến giao" name="estimatedDate">
            <DatePicker size="large" showTime format="DD/MM/YYYY HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Ngày giao thực tế" name="actualDate">
            <DatePicker size="large" showTime format="DD/MM/YYYY HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Địa chỉ giao hàng" name="shipAddress">
            <Input size="large" />
          </Form.Item>
        </div>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider className="my-8">
          <span className="text-lg font-semibold">Chi tiết sản phẩm</span>
        </Divider>

        <Form.List name="orderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card key={key} className="mb-4 shadow-sm" size="small">
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
                        options={products.map(p => ({
                          label: (
                            <Space>
                              <Avatar size={24} src={getProductImageUrl(p.image)} />
                              <span>{p.name}</span>
                            </Space>
                          ),
                          value: p.id,
                          data: p,
                        }))}
                        onChange={(value, option: any) => {
                          const product = option.data as IProduct;
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
                        }}
                      />
                    </Form.Item>

                    <Form.Item name={[name, "quantity"]} rules={[{ required: true }]} initialValue={1} className="mb-0">
                      <InputNumber min={1} size="large" style={{ width: 120 }} />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger size="large" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    )}
                  </Space>

                  {/* Preview sản phẩm đã chọn */}
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const preview = form.getFieldValue(["orderDetails", name, "preview"]);
                      if (!preview) return null;

                      return (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Space>
                            <Image
                              width={56}
                              height={56}
                              src={getProductImageUrl(preview.image)}
                              className="rounded-lg object-cover"
                              preview={false}
                            />
                            <div>
                              <Text strong className="block">{preview.name}</Text>
                              <Text type="secondary">Giá: {formatPrice(preview.price)}</Text>
                            </div>
                          </Space>
                        </div>
                      );
                    }}
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" block size="large" icon={<PlusOutlined />} onClick={() => add()}>
                Thêm sản phẩm
              </Button>
            </>
          )}
        </Form.List>

        {/* Tổng tiền */}
        <Form.Item shouldUpdate noStyle>
          {() => {
            const details = form.getFieldValue("orderDetails") || [];
            const total = details.reduce((sum: number, item: any) => {
              const product = products.find(p => p.id === item.productId);
              return sum + (product?.price || 0) * (item.quantity || 0);
            }, 0);

            if (total === 0) return null;

            return (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-right shadow-lg">
                <Text className="text-3xl font-bold">Tổng tiền: {formatPrice(total)}</Text>
              </div>
            );
          }}
        </Form.Item>

        <div className="flex justify-end gap-4 mt-8">
          <Button size="large" onClick={() => setOpen(false)}>Hủy</Button>
          <Button type="primary" size="large" htmlType="submit" loading={loading} className="px-8 font-semibold">
            Cập nhật đơn hàng
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateOrder;