// src/components/PaymentStatus/PaymentSuccess.tsx

import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircleFilled, HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

const PaymentSuccess: React.FC = () => {
  // Lấy orderId từ URL (VD: ?orderId=DH000123)
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full">
        {/* Header xanh lá đẹp */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-12 px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <CheckCircleFilled className="text-6xl text-white drop-shadow-lg" />
          </div>
          <Title level={1} className="!text-white !mb-3 !text-4xl font-bold">
            Thanh toán thành công!
          </Title>
          <Text className="text-white/90 text-lg">
            Cảm ơn quý khách đã tin tưởng mua sắm tại <strong>GreenMart</strong>
          </Text>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12 text-center">
          {orderId && (
            <div className="mb-8">
              <Text type="secondary" className="text-lg block mb-2">
                Mã đơn hàng của bạn
              </Text>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-4 rounded-2xl border-2 border-emerald-200 shadow-md">
                <span className="text-3xl font-bold text-emerald-700 tracking-widest">
                  {orderId}
                </span>
              </div>
            </div>
          )}

          <Paragraph className="text-gray-600 text-lg leading-relaxed mb-10">
            Đơn hàng đã được xác nhận và đang được xử lý. Chúng tôi sẽ gửi email thông báo khi đơn hàng được giao.
          </Paragraph>

          {/* Nút hành động */}
          <Space direction="vertical" size="large" className="w-full">
            <Link to="/account/order" className="block w-full">
              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingOutlined />}
                className="h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-emerald-600 to-green-600 border-0"
              >
                Xem chi tiết đơn hàng
              </Button>
            </Link>

            <Link to="/" className="block w-full">
              <Button
                size="large"
                block
                icon={<HomeOutlined />}
                className="h-14 text-lg font-semibold rounded-xl border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                Quay về Trang chủ
              </Button>
            </Link>
          </Space>

          {/* Footer nhỏ xinh */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Text type="secondary" className="text-sm">
              Cần hỗ trợ? Liên hệ hotline{" "}
              <a href="tel:19001000" className="text-emerald-600 font-bold">
                1900 1000
              </a>{" "}
              hoặc email{" "}
              <a href="support@greenmart.com" className="text-emerald-600 font-bold">
                support@greenmart.com
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;