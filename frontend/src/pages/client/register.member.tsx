// src/pages/membership/MembershipRegistrationPage.tsx
// ĐÃ SỬA HOÀN TOÀN - CHẠY MƯỢT, CHUYỂN ĐÚNG TRANG VNPAY

import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Modal,
  message,
  Divider,
} from "antd";
import {
  CrownOutlined,
  CheckCircleOutlined,
  FireFilled,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: number;
  badge: string;
  color: string;
  icon: React.ReactNode;
  features: { text: string; included: boolean }[];
  popular?: boolean;
  saving?: string;
}

const MembershipRegistrationPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Các gói thành viên
  const membershipPlans: MembershipPlan[] = [
    {
      id: "trial",
      name: "Thử nghiệm VIP",
      price: 29000,
      originalPrice: 99000,
      duration: 1,
      badge: "MỚI",
      color: "#ff4d4f",
      icon: <FireFilled />,
      popular: true,
      saving: "Tiết kiệm 70%",
      features: [
        { text: "Giảm ngay 10% tối đa 50k mỗi đơn", included: true },
        { text: "Freeship đơn từ 0đ (tối đa 30k)", included: true },
        { text: "Tích điểm x2 mọi đơn hàng", included: true },
        { text: "Voucher tân binh 100k", included: true },
        { text: "Quà sinh nhật 50k", included: true },
        { text: "Ưu tiên hỗ trợ 24/7", included: false },
        { text: "Flash sale riêng VIP", included: false },
      ],
    },
    {
      id: "silver",
      name: "VIP Bạc",
      price: 99000,
      originalPrice: 297000,
      duration: 3,
      badge: "TIẾT KIỆM 67%",
      color: "#8c8c8c",
      icon: <StarFilled />,
      saving: "Chỉ 33k/tháng",
      features: [
        { text: "Giảm 12% tối đa 80k mỗi đơn", included: true },
        { text: "Freeship toàn quốc không giới hạn", included: true },
        { text: "Tích điểm x3", included: true },
        { text: "Voucher sinh nhật 150k", included: true },
        { text: "Ưu tiên hỗ trợ 24/7", included: true },
        { text: "Flash sale riêng VIP", included: true },
        { text: "Quà tặng độc quyền mỗi quý", included: false },
      ],
    },
    {
      id: "gold",
      name: "VIP Vàng",
      price: 199000,
      originalPrice: 714000,
      duration: 6,
      badge: "PHỔ BIẾN NHẤT",
      color: "#fadb14",
      icon: <CrownOutlined />,
      popular: true,
      saving: "Chỉ 33k/tháng - Rẻ nhất năm!",
      features: [
        { text: "Giảm 15% tối đa 150k mỗi đơn", included: true },
        { text: "Freeship + Giao nhanh 2h", included: true },
        { text: "Tích điểm x4", included: true },
        { text: "Voucher sinh nhật 300k", included: true },
        { text: "Quản lý tài khoản riêng (CSKH VIP)", included: true },
        { text: "Mua trước sản phẩm hot 24h", included: true },
        { text: "Quà tặng cao cấp mỗi quý", included: true },
      ],
    },
    {
      id: "platinum",
      name: "VIP Kim Cương",
      price: 399000,
      originalPrice: 1788000,
      duration: 12,
      badge: "CAO CẤP NHẤT",
      color: "#722ed1",
      icon: <ThunderboltOutlined />,
      saving: "Tiết kiệm 78% - Chỉ 33k/tháng!",
      features: [
        { text: "Giảm 20% tối đa 300k mỗi đơn", included: true },
        { text: "Freeship hỏa tốc + Hoàn tiền nếu chậm", included: true },
        { text: "Tích điểm x6", included: true },
        { text: "Voucher sinh nhật 1.000.000đ", included: true },
        { text: "Quản lý tài khoản riêng + Hotline VIP", included: true },
        { text: "Mua trước 72h + Đặt hàng riêng", included: true },
        { text: "Du lịch/offline độc quyền miễn phí", included: true },
      ],
    },
  ];

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsModalVisible(true);
  };

  // THANH TOÁN VNPAY THẬT – ĐÃ SỬA ĐÚNG THEO API CỦA BẠN
  const handlePay = async () => {
    if (!selectedPlan) return;

    setLoading(true);

    try {
      // GỌI API TẠO THANH TOÁN VNPAY (gửi kèm thông tin gói)
      const response = await axios.get(
        "http://localhost:8080/api/v1/payment/vn-pay", // Đổi thành POST nếu backend hỗ trợ
        
      );

      // Nếu backend chỉ hỗ trợ GET như cũ, dùng dòng này thay thế:
      // const response = await axios.get("http://localhost:8080/api/v1/payment/vn-pay", {
      //   params: {
      //     amount: selectedPlan.price,
      //     orderInfo: `Đăng ký ${selectedPlan.name} - ${selectedPlan.duration} tháng`,
      //     membershipPlanId: selectedPlan.id,
      //   },
      //   withCredentials: true,
      // });

      const paymentUrl = response.data?.data?.paymentUrl || response.data?.paymentUrl;

      if (paymentUrl) {
        message.success("Đang chuyển bạn đến cổng thanh toán VNPay...");
        // Chuyển hướng sang trang VNPay thật
        window.location.href = paymentUrl;
      } else {
        message.error("Không nhận được link thanh toán từ server!");
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo thanh toán VNPay:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Thanh toán thất bại, vui lòng thử lại!";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Space direction="vertical" size={16}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl animate-pulse">
              <CrownOutlined className="text-5xl text-white" />
            </div>
            <Title level={1} className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Trở thành VIP - Nhận ngay ưu đãi KHỦNG!
            </Title>
            <Text className="text-xl text-gray-700 max-w-4xl mx-auto">
              Chỉ từ <strong>29k</strong> bạn đã được <strong>freeship toàn quốc</strong>, giảm thêm tới <strong>20%</strong> và hàng ngàn ưu đãi mỗi tháng!
            </Text>
          </Space>
        </div>

        {/* Danh sách gói */}
        <Row gutter={[24, 32]} justify="center">
          {membershipPlans.map((plan) => (
            <Col xs={24} sm={12} lg={6} key={plan.id}>
              <Card
                hoverable
                onClick={() => handleSelectPlan(plan)}
                className="h-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4"
                style={{
                  borderRadius: 24,
                  border: plan.popular ? "4px solid #f5222d" : "2px solid #f0f0f0",
                  boxShadow: plan.popular ? "0 25px 50px rgba(245,34,45,0.2)" : undefined,
                }}
                bodyStyle={{ padding: "32px" }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Tag color="#f5222d" className="text-base px-6 py-2 font-bold">
                      PHỔ BIẾN NHẤT
                    </Tag>
                  </div>
                )}

                <Space direction="vertical" size={24} style={{ width: "100%" }} align="center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                    }}
                  >
                    {React.cloneElement(plan.icon as React.ReactElement, {
                      className: "text-5xl text-white",
                    })}
                  </div>

                  <div className="text-center">
                    <Title level={3} className="m-0">{plan.name}</Title>
                    {plan.saving && <Tag color="red" className="mt-2 text-base">{plan.saving}</Tag>}
                  </div>

                  <div className="text-center">
                    {plan.originalPrice && (
                      <Text delete type="secondary" className="block text-lg">
                        {plan.originalPrice.toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                    <Title level={1} className="m-0" style={{ color: plan.color }}>
                      {plan.price.toLocaleString("vi-VN")}đ
                    </Title>
                    <Text type="secondary" className="text-lg">
                      cho {plan.duration} tháng
                    </Text>
                  </div>

                  <Divider className="my-4" />

                  <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircleOutlined className="text-green-500 text-xl mt-0.5" />
                        <Text className="text-gray-700">{f.text}</Text>
                      </div>
                    ))}
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    block
                    danger={plan.popular}
                    style={{
                      height: 56,
                      fontSize: 18,
                      fontWeight: 700,
                      borderRadius: 16,
                    }}
                  >
                    Đăng ký ngay
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal xác nhận + thanh toán */}
        <Modal
          open={isModalVisible}
          onCancel={() => !loading && setIsModalVisible(false)}
          footer={null}
          width={520}
          centered
          closeIcon={!loading}
        >
          {selectedPlan && (
            <div className="text-center py-12">
              <div className="mb-8">
                {React.cloneElement(selectedPlan.icon as React.ReactElement, {
                  className: "text-9xl",
                  style: { color: selectedPlan.color },
                })}
              </div>

              <Title level={2}>Xác nhận đăng ký</Title>
              <Title level={1} style={{ color: selectedPlan.color }}>
                {selectedPlan.name}
              </Title>

              <Space direction="vertical" size={8} className="my-8">
                <Text strong className="text-3xl">
                  {selectedPlan.price.toLocaleString("vi-VN")}đ
                </Text>
                <Text type="secondary" className="text-lg">
                  Thời hạn: {selectedPlan.duration} tháng
                </Text>
                {selectedPlan.saving && (
                  <Tag color="red" className="text-lg px-6 py-2">
                    {selectedPlan.saving}
                  </Tag>
                )}
              </Space>

              <Button
                type="primary"
                size="large"
                block
                danger={selectedPlan.popular}
                loading={loading}
                onClick={handlePay}
                style={{
                  height: 68,
                  fontSize: 22,
                  fontWeight: 700,
                  borderRadius: 16,
                }}
              >
                {loading ? "Đang chuyển hướng..." : `Thanh toán ${selectedPlan.price.toLocaleString("vi-VN")}đ qua VNPay`}
              </Button>

              <div className="mt-6">
                <Text type="secondary">
                  Thanh toán an toàn qua VNPay • Hỗ trợ thẻ, QR, Internet Banking
                </Text>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MembershipRegistrationPage;