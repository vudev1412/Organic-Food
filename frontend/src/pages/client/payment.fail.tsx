// src/components/PaymentStatus/PaymentFailure.tsx

import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { WarningFilled, HomeOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography; // ĐÃ SỬA Ở ĐÂY

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("code") || searchParams.get("vnp_ResponseCode");

  const getErrorMessage = (code: string | null) => {
    if (!code) return "Giao dịch không thành công.";
    const messages: Record<string, string> = {
      "00": "Giao dịch thành công (lạ nhỉ?)",
      "01": "Giao dịch đã tồn tại",
      "02": "Merchant không hợp lệ",
      "04": "Khởi tạo GD không thành công do lỗi website",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ",
      "09": "Thẻ/Tài khoản không đủ tiền",
      "10": "Vượt hạn mức thanh toán",
      "11": "Quá thời gian thanh toán",
      "12": "Thẻ/Tài khoản bị khóa",
      "13": "Sai mã OTP",
      "24": "Khách hàng hủy giao dịch",
      "51": "Tài khoản không đủ số dư",
      "65": "Vượt hạn mức giao dịch trong ngày",
      "75": "Ngân hàng đang bảo trì",
      "79": "Nhập sai mật khẩu quá nhiều lần",
      "99": "Lỗi không xác định",
    };
    return messages[code] || `Giao dịch thất bại (mã lỗi: ${code})`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-12 px-8 text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-2xl">
            <WarningFilled className="text-7xl text-white drop-shadow-2xl" />
          </div>
          <Title level={1} className="!text-white !mb-3 !text-4xl font-bold">
            Thanh toán không thành công
          </Title>
          <Text className="text-white/90 text-lg block max-w-md mx-auto">
            Đã xảy ra lỗi trong quá trình thanh toán. Đơn hàng chưa được tạo.
          </Text>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12 text-center">
          <div className="mb-10">
            <Text type="secondary" className="text-lg block mb-3">
              Nguyên nhân
            </Text>
            <div className="inline-flex items-center gap-4 bg-red-50 px-8 py-5 rounded-2xl border-2 border-red-200 shadow-md">
              <WarningFilled className="text-4xl text-red-500" />
              <Text strong className="text-xl text-red-700">
                {getErrorMessage(errorCode)}
              </Text>
            </div>

            {errorCode && (
              <Text type="secondary" className="block mt-4 text-sm">
                Mã lỗi hệ thống:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded font-mono">{errorCode}</code>
              </Text>
            )}
          </div>

          <Paragraph className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Vui lòng kiểm tra lại thông tin thẻ/tài khoản hoặc thử phương thức thanh toán khác.
          </Paragraph>

          {/* Nút hành động */}
          <Space direction="vertical" size="large" className="w-full">
            <Link to="/gio-hang" className="block w-full">
              <Button
                type="primary"
                danger
                size="large"
                block
                icon={<CreditCardOutlined />}
                className="h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Thử thanh toán lại
              </Button>
            </Link>

            <Link to="/" className="block w-full">
              <Button
                size="large"
                block
                icon={<HomeOutlined />}
                className="h-14 text-lg font-semibold rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all"
              >
                Quay về Trang chủ
              </Button>
            </Link>
          </Space>

          {/* Hỗ trợ */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Text type="secondary" className="text-sm block mb-2">
              Cần hỗ trợ ngay? Gọi hotline
            </Text>
            <a href="tel:19001000" className="text-red-600 font-bold text-xl">
              1900 1000
            </a>
            <Text type="secondary" className="text-sm block mt-3">
              Hoặc chat với chúng tôi qua{" "}
              <a href="#" className="text-red-600 font-bold underline">
                Zalo / Facebook
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;