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
  Image,
  Typography,
  App,
  Tag,
} from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { createOrder, getProductsAPI, getCustomersAPI } from "../../../service/api";

const { Text } = Typography;

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  refreshTable: () => void;
}

interface ICustomer {
  id: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    if (open) {
      loadProducts();
      loadCustomers();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      const res = await getProductsAPI("page=1&size=1000&active=true");
      setProducts(res.data?.data?.result || []);
    } catch {
      notification.error({ message: "Lỗi", description: "Không tải được sản phẩm" });
    }
  };

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await getCustomersAPI("");
      if (res?.data?.data?.result) {
        const list = res.data.data.result.map((c: any) => ({
          label: c.user?.name || `Customer #${c.id}`,
          value: c.id,
          customer: c,
        }));
        setCustomers(list);
      }
    } catch {
      notification.error({ message: "Lỗi", description: "Không tải được danh sách khách hàng" });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSelect = (customerId: number, option: any) => {
    const customer = option?.customer;
    if (customer) {
      setSelectedCustomer(customer);
      // Lưu userId vào form (ẩn)
      form.setFieldsValue({
        userId: customer.user?.id,
      });
      // Auto-fill phone nếu có
      if (customer.user?.phone) {
        form.setFieldsValue({
          phone: customer.user.phone,
        });
      }
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    
    // Lấy userId từ selectedCustomer
    const userId = selectedCustomer?.user?.id;
    
    if (!userId) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy thông tin user của khách hàng",
      });
      setIsSubmit(false);
      return;
    }
    
    const payload = {
      userId: userId, // userId từ customer.user.id
      shipAddress: values.address,
      note: values.note || "",
      estimatedDate: new Date().toISOString(), // Thêm estimatedDate
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
      setSelectedCustomer(null);
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
        setSelectedCustomer(null);
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <UserOutlined className="mr-2" />
            Thông tin khách hàng
          </h3>
          
          <div className="grid grid-cols-1 gap-5">
            {/* Hidden field để lưu userId */}
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>
            
            {/* Chọn khách hàng */}
            <Form.Item 
              name="customerId" 
              label="Chọn khách hàng" 
              rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Tìm khách hàng theo tên..."
                optionFilterProp="children"
                loading={loadingCustomers}
                className="w-full"
                onChange={handleCustomerSelect}
                filterOption={(input, option) => {
                  const label = option?.label?.toString().toLowerCase() || "";
                  return label.includes(input.toLowerCase());
                }}
                options={customers}
              />
            </Form.Item>

            {/* Hiển thị thông tin khách hàng đã chọn */}
            {selectedCustomer?.user && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Space direction="vertical" size="small" className="w-full">
                  <div>
                    <Text type="secondary" className="text-xs">Họ tên:</Text>
                    <Text strong className="block text-base">{selectedCustomer.user.name}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs">Email:</Text>
                    <Text className="block">{selectedCustomer.user.email}</Text>
                  </div>
                  {selectedCustomer.user.phone && (
                    <div>
                      <Text type="secondary" className="text-xs">Số điện thoại:</Text>
                      <Text className="block">{selectedCustomer.user.phone}</Text>
                    </div>
                  )}
                </Space>
              </div>
            )}

            {/* Số điện thoại (nếu chưa có) */}
            <Form.Item
              name="phone"
              label="Số điện thoại giao hàng (nếu khác)"
              rules={[
                { pattern: /^0\d{9}$/, message: "SĐT không hợp lệ" }
              ]}
            >
              <Input 
                size="large" 
                placeholder="0901234567" 
                className="rounded-lg"
              />
            </Form.Item>

            {/* Địa chỉ giao hàng */}
            <Form.Item 
              name="address" 
              label="Địa chỉ giao hàng" 
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ giao hàng" }]}
            >
              <Input.TextArea 
                rows={3} 
                size="large" 
                placeholder="123 Đường Láng, Đống Đa, Hà Nội..." 
                className="rounded-lg"
              />
            </Form.Item>

            {/* Ghi chú */}
            <Form.Item name="note" label="Ghi chú (tùy chọn)">
              <Input.TextArea 
                rows={2} 
                placeholder="Giao buổi chiều, gọi trước khi đến..." 
                className="rounded-lg"
              />
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
                      <Form.Item 
                        name={[name, "productId"]} 
                        rules={[{ required: true, message: "Chọn sản phẩm" }]} 
                        className="mb-0 flex-1 min-w-64"
                      >
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
                      <Form.Item 
                        name={[name, "quantity"]} 
                        initialValue={1} 
                        rules={[{ required: true, message: "Nhập số lượng" }]} 
                        className="mb-0"
                      >
                        <InputNumber min={1} size="large" className="w-32" />
                      </Form.Item>

                      {/* Xóa */}
                      {fields.length > 1 && (
                        <Button 
                          danger 
                          size="large" 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)} 
                        />
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
                <Text className="text-2xl font-bold block text-right text-white">
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