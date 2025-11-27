// src/pages/client/checkout.tsx

import React, { useState } from "react";
import { Button, Radio, Card, Divider, Space, Typography, message, Image, Spin } from "antd";
import { CreditCardOutlined, HomeOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../../components/context/app.context";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
import axios from "axios";

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCurrentApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
  const [loading, setLoading] = useState(false);

  // Tính tổng tiền
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  // Hàm thanh toán VNPay (giữ nguyên như bạn cung cấp)
  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/payment/vn-pay",
        { withCredentials: true }
      );

      const paymentUrl = response.data?.data?.data?.paymentUrl;
      console.log("Link thanh toán:", paymentUrl);

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        message.error("Không lấy được link thanh toán!");
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Lỗi khi gọi VNPay");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống!");
      return;
    }

    if (paymentMethod === "COD") {
      message.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất.");
      clearCart();
      setTimeout(() => navigate("/don-hang"), 1500);
    } else {
      handlePay();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Xác nhận đơn hàng
          </h1>
          <p className="text-gray-600 text-lg">
            Vui lòng kiểm tra lại thông tin trước khi thanh toán
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cột trái: Sản phẩm + Phương thức thanh toán */}
          <section className="lg:col-span-8 space-y-8">
            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <h2 className="text-2xl font-bold">Sản phẩm trong đơn hàng</h2>
                <p className="opacity-90">{cartItems.length} sản phẩm</p>
              </div>

              <div className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow">
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
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl font-bold text-red-600">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <del className="text-gray-400 text-lg">
                            {formatCurrency(item.originalPrice)}
                          </del>
                        )}
                      </div>
                      <Text type="secondary" className="text-base">
                        Số lượng: <strong>{item.quantity}</strong>
                      </Text>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Thành tiền</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold">Phương thức thanh toán</h2>
              </div>

              <div className="p-6">
                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full">
                  <Space direction="vertical" size={20} className="w-full">
                    {/* COD */}
                    <Radio value="COD">
                      <Card
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                          paymentMethod === "COD"
                            ? "border-green-500 shadow-xl bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Space size={24} align="center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <HomeOutlined className="text-3xl text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">
                              Thanh toán khi nhận hàng (COD)
                            </div>
                            <Text type="secondary" className="text-base">
                              Nhận hàng → Kiểm tra → Thanh toán tiền mặt/QR
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Radio>

                    {/* VNPAY */}
                    <Radio value="VNPAY">
                      <Card
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                          paymentMethod === "VNPAY"
                            ? "border-blue-500 shadow-xl bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <Space size={24} align="center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <CreditCardOutlined className="text-3xl text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">
                              Thanh toán qua VNPay
                            </div>
                            <Text type="secondary" className="text-base">
                              Thẻ ATM • Internet Banking • Ví điện tử • QR Code
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </section>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header tóm tắt */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
                <Title level={2} className="text-white mb-2">
                  Tổng thanh toán
                </Title>
                <div className="text-5xl font-bold">
                  {formatCurrency(total)}
                </div>
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
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <Text className="text-blue-700 font-medium">
                      Mua thêm <strong>{formatCurrency(500000 - subtotal)}</strong> để được{" "}
                      <strong>miễn phí vận chuyển</strong>!
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
                    background:
                      paymentMethod === "VNPAY"
                        ? "linear-gradient(90deg, #1e40af, #3b82f6)"
                        : "linear-gradient(90deg, #f97316, #ea580c)",
                    border: "none",
                  }}
                >
                  {loading ? (
                    <Spin />
                  ) : paymentMethod === "COD" ? (
                    "Đặt hàng & Thanh toán khi nhận hàng"
                  ) : (
                    "Thanh toán qua VNPay"
                  )}
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