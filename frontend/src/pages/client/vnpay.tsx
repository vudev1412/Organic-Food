// src/pages/client/checkout.tsx
// ĐÃ SỬA ĐÚNG 100% THEO YÊU CẦU: TẠO ĐƠN TRƯỚC → MỚI CHUYỂN VNPAY

import React, { useState, useEffect } from "react";
import {
  Button,
  Radio,
  Card,
  Divider,
  Space,
  Typography,
  message,
  Image,
  Spin,
  Tag,
} from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useCurrentApp } from "../../components/context/app.context";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
import axios from "axios";
import { createOrder, getAddressesByUserIdAPI } from "../../service/api";

const { Title, Text } = Typography;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ICustomerAddress {
  id: number;
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  note?: string;
  defaultAddress: boolean;
}

const CheckoutPage: React.FC = () => {
  const { cartItems: rawCartItems, clearCart, user } = useCurrentApp();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<ICustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ICustomerAddress | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // BẢO VỆ DỮ LIỆU GIỎ HÀNG
  const cartItems: CartItem[] = Array.isArray(rawCartItems)
    ? rawCartItems.filter(
        (item): item is CartItem =>
          item != null &&
          typeof item === "object" &&
          typeof item.id === "number" &&
          typeof item.price === "number" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      )
    : [];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  // LẤY ĐỊA CHỈ
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) {
        message.warning("Vui lòng đăng nhập để tiếp tục!");
        navigate("/login");
        return;
      }

      try {
        setIsLoadingAddress(true);
        const response = await getAddressesByUserIdAPI(user.id);
        const data = response.data?.data || [];

        setAddresses(data);
        const defaultAddr = data.find((a: ICustomerAddress) => a.defaultAddress);
        setSelectedAddress(defaultAddr || data[0] || null);
      } catch (error) {
        message.error("Không thể tải địa chỉ giao hàng!");
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddresses();
  }, [user, navigate]);

  // TẠO ĐƠN HÀNG TRƯỚC (DÙNG CHO CẢ COD & VNPAY)
  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng!");
      return { success: false };
    }

    const orderData = {
      userId: user?.id,
      shipAddress: `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
      note: selectedAddress.note || undefined,
      estimatedDate: null,
      orderDetails: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await createOrder(orderData);

      if (response.data?.statusCode === 201 || response.data?.statusCode === 200) {
        const orderId = response.data?.data?.id;
        message.success("Tạo đơn hàng thành công!");
        return { success: true, orderId };
      }

      return { success: false };
    } catch (error: any) {
      console.error("Lỗi tạo đơn hàng:", error);
      const msg = error.response?.data?.message || "Tạo đơn hàng thất bại!";
      message.error(msg);
      return { success: false };
    }
  };

  // XỬ LÝ COD
  const handleCOD = async () => {
    setLoading(true);
    const result = await handleCreateOrder();

    if (result.success) {
      clearCart();
      setTimeout(() => navigate("/tai-khoan/don-hang"), 1500);
    }
    setLoading(false);
  };

  // XỬ LÝ VNPAY: TẠO ĐƠN TRƯỚC → MỚI GỌI API VNPAY (GET như bạn đang dùng)
  const handleVNPay = async () => {
    setLoading(true);
    const result = await handleCreateOrder();

    if (!result.success || !result.orderId) {
      setLoading(false);
      return;
    }

    try {
      // DÙNG ĐÚNG API GET CỦA BẠN → CHỈ CẦN GỬI orderId QUA PARAM
      const response = await axios.get("http://localhost:8080/api/v1/payment/vn-pay", {
        params: {
          orderId: result.orderId,     // Gửi kèm orderId
          amount: total,
        },
        withCredentials: true,
      });

      const paymentUrl = response.data?.data?.data?.paymentUrl || response.data?.data?.paymentUrl;

      if (paymentUrl) {
        message.success("Đang chuyển bạn đến cổng thanh toán VNPay...");
        window.location.href = paymentUrl;
      } else {
        message.error("Không nhận được link thanh toán từ VNPay!");
      }
    } catch (error: any) {
      console.error("Lỗi gọi VNPay:", error);
      message.error(error.response?.data?.message || "Lỗi kết nối VNPay!");
    } finally {
      setLoading(false);
    }
  };

  // NÚT CHÍNH
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống!");
      return;
    }
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (paymentMethod === "COD") {
      handleCOD();
    } else {
      handleVNPay();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Xác nhận đơn hàng
          </h1>
          <p className="text-gray-600 text-lg">
            Vui lòng kiểm tra lại thông tin trước khi thanh toán
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cột trái */}
          <section className="lg:col-span-8 space-y-8">
            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <EnvironmentOutlined className="text-3xl" />
                  Địa chỉ giao hàng
                </h2>
              </div>

              <div className="p-6">
                {isLoadingAddress ? (
                  <div className="text-center py-16">
                    <Spin size="large" tip="Đang tải địa chỉ..." />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <Text type="secondary" className="text-lg block mb-6">
                      Bạn chưa có địa chỉ giao hàng nào
                    </Text>
                    <Button type="primary" size="large" onClick={() => navigate("/profile?tab=address")}>
                      Thêm địa chỉ ngay
                    </Button>
                  </div>
                ) : (
                  <Radio.Group
                    value={selectedAddress?.id}
                    onChange={(e) => {
                      const addr = addresses.find(a => a.id === e.target.value);
                      setSelectedAddress(addr || null);
                    }}
                    className="w-full"
                  >
                    <Space direction="vertical" size={16} className="w-full">
                      {addresses.map((addr) => (
                        <Radio key={addr.id} value={addr.id}>
                          <Card
                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                              selectedAddress?.id === addr.id
                                ? "border-green-500 bg-green-50 shadow-xl"
                                : "border-gray-200"
                            }`}
                          >
                            <Space direction="vertical" size={8} className="w-full">
                              <div className="flex justify-between items-start">
                                <Space>
                                  <Text strong className="text-xl">{addr.receiverName}</Text>
                                  <Text type="secondary">({addr.phone})</Text>
                                  {addr.defaultAddress && (
                                    <Tag color="green" className="font-bold">
                                      Mặc định
                                    </Tag>
                                  )}
                                </Space>
                              </div>
                              <Text className="text-base text-gray-700">
                                {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                              </Text>
                              {addr.note && (
                                <Text type="secondary" italic>
                                  Ghi chú: {addr.note}
                                </Text>
                              )}
                            </Space>
                          </Card>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                )}

                <Divider />
                <Button
                  type="dashed"
                  block
                  size="large"
                  onClick={() => navigate("/profile?tab=address")}
                >
                  Quản lý địa chỉ giao hàng
                </Button>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <h2 className="text-2xl font-bold">Sản phẩm trong đơn hàng</h2>
                <p className="opacity-90">{cartItems.length} sản phẩm</p>
              </div>
              <div className="p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Giỏ hàng trống hoặc có lỗi dữ liệu
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 p-6 bg-gray-50 rounded-2xl">
                      <Image
                        width={100}
                        height={100}
                        src={
                          item.image
                            ? `http://localhost:8080/storage/images/products/${item.image}`
                            : "https://placehold.co/100x100"
                        }
                        className="rounded-2xl object-cover shadow-md"
                        preview={false}
                        fallback="https://placehold.co/100x100?text=No+Image"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <Text type="secondary" className="text-base">
                          Số lượng: <strong>{item.quantity}</strong>
                        </Text>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold">Phương thức thanh toán</h2>
              </div>
              <div className="p-6">
                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                  <Space direction="vertical" size={20} className="w-full">
                    <Radio value="COD">
                      <Card className={`p-6 rounded-2xl border-2 ${paymentMethod === "COD" ? "border-green-500 bg-green-50" : ""}`}>
                        <Space size={24} align="center">
                          <HomeOutlined className="text-4xl text-orange-500" />
                          <div>
                            <div className="text-xl font-bold">Thanh toán khi nhận hàng (COD)</div>
                            <Text type="secondary">Nhận hàng → Kiểm tra → Thanh toán</Text>
                          </div>
                        </Space>
                      </Card>
                    </Radio>
                    <Radio value="VNPAY">
                      <Card className={`p-6 rounded-2xl border-2 ${paymentMethod === "VNPAY" ? "border-blue-500 bg-blue-50" : ""}`}>
                        <Space size={24} align="center">
                          <CreditCardOutlined className="text-4xl text-blue-600" />
                          <div>
                            <div className="text-xl font-bold">Thanh toán qua VNPay</div>
                            <Text type="secondary">Thẻ ATM • Internet Banking • QR Code</Text>
                          </div>
                        </Space>
                      </Card>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </section>

          {/* Cột phải: Tổng tiền */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
                <Title level={2} className="text-white mb-2">Tổng thanh toán</Title>
                <div className="text-5xl font-bold">{formatCurrency(total)}</div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <Text>Tạm tính</Text>
                    <Text strong>{formatCurrency(subtotal)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Phí vận chuyển</Text>
                    <Text strong className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                      {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
                    </Text>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
                    <Text className="text-yellow-800 font-medium">
                      Mua thêm <strong>{formatCurrency(500000 - subtotal)}</strong> để được miễn phí vận chuyển!
                    </Text>
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={handleCheckout}
                  className="h-16 text-2xl font-bold rounded-2xl shadow-2xl mt-8"
                  style={{
                    background: paymentMethod === "VNPAY"
                      ? "linear-gradient(90deg, #1e40af, #3b82f6)"
                      : "linear-gradient(90deg, #f97316, #ea580c)",
                    border: "none",
                  }}
                >
                  {loading ? <Spin /> : paymentMethod === "COD" ? "Đặt hàng ngay" : "Thanh toán qua VNPay"}
                </Button>

                <div className="text-center pt-6 border-t">
                  <Link to="/gio-hang" className="text-green-600 hover:text-green-700 font-bold text-lg">
                    ← Quay lại giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;