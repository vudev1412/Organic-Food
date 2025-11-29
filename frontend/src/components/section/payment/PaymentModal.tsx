import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  CloseOutlined,
  CopyOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { message } from "antd"; // Import message để thông báo copy đẹp hơn
import { PaymentAPI } from "../../../service/api";
import { formatCurrency } from "../../../utils/format";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSuccess: () => void;
}

// Hàm helper tra cứu tên ngân hàng qua BIN (PayOS thường là MB)
const getBankName = (bin: string) => {
  const banks: Record<string, string> = {
    "970422": "MBBank (Quân Đội)",
    "970436": "Vietcombank",
    "970415": "VietinBank",
    "970418": "BIDV",
    "970405": "Agribank",
    "970407": "Techcombank",
    "970423": "TPBank",
    "970432": "VPBank",
  };
  return banks[bin] || `Ngân hàng (BIN: ${bin})`;
};

const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  onSuccess,
}: PaymentModalProps) => {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const intervalRef = useRef<any>(null);

  // Xử lý Copy
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${label}: ${text}`);
  };

  useEffect(() => {
    if (!isOpen) {
      setPaymentData(null);
      setIsPaid(false);
      setBuyerName("");
      setBuyerPhone("");
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isOpen]);

  // 1. TẠO QR
  const handleCreatePayment = async () => {
    if (!buyerName || !buyerPhone) {
      message.error("Vui lòng nhập tên và số điện thoại");
      return;
    }
    setLoading(true);
    try {
      const res = await PaymentAPI.createPayment({
        amount: totalAmount,
        description: "Thanh toan don hang",
        buyerName,
        buyerPhone,
        orderId: Math.floor(Date.now() / 1000),
      });

      if (res.data) {
        setPaymentData(res.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  // 2. POLLING
  useEffect(() => {
    if (paymentData && !isPaid && isOpen) {
      const checkStatus = async () => {
        try {
          const code = paymentData.orderCode;
          if (!code) return;
          const res = await PaymentAPI.checkStatus(code);
          const status = res.data?.status;

          if (status === "SUCCESS" || status === "PAID") {
            setIsPaid(true);
            clearInterval(intervalRef.current);
            setTimeout(() => {
              onSuccess();
            }, 1500);
          }
        } catch (error) {
          console.error("Lỗi polling", error);
        }
      };
      intervalRef.current = setInterval(checkStatus, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paymentData, isPaid, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2"
        >
          <CloseOutlined className="text-xl" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            {isPaid
              ? "Thanh toán thành công!"
              : paymentData
              ? "Thanh toán qua VietQR"
              : "Thông tin người mua"}
          </h2>

          {/* TRƯỜNG HỢP 1: FORM NHẬP */}
          {!paymentData && !isPaid && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nguyễn Văn A"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="0912345678"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCreatePayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 mt-2"
              >
                {loading ? "Đang xử lý..." : "Xác nhận & Lấy mã QR"}
              </button>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: HIỂN THỊ QR VÀ THÔNG TIN CHI TIẾT */}
          {paymentData && !isPaid && (
            <div className="flex flex-col items-center">
              {/* Box chứa QR */}
              <div className="p-3 bg-white border-2 border-green-500 rounded-xl shadow-sm mb-6">
                <QRCodeCanvas
                  value={paymentData.qrCode || ""}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Thông tin chuyển khoản chi tiết */}
              <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200 text-sm">
                {/* Ngân hàng */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Ngân hàng:</span>
                  <span className="font-bold text-gray-800">
                    {getBankName(paymentData.bin)}
                  </span>
                </div>

                {/* Chủ tài khoản */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Chủ tài khoản:</span>
                  <span className="font-bold text-gray-800 uppercase">
                    {paymentData.accountName}
                  </span>
                </div>

                {/* Số tài khoản (Có Copy) */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-base">
                      {paymentData.accountNumber}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(paymentData.accountNumber, "Số tài khoản")
                      }
                      className="text-green-600 hover:bg-green-100 p-1 rounded transition"
                    >
                      <CopyOutlined />
                    </button>
                  </div>
                </div>

                {/* Số tiền (Có Copy) */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Số tiền:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 text-base">
                      {formatCurrency(paymentData.amount)}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(paymentData.amount.toString(), "Số tiền")
                      }
                      className="text-green-600 hover:bg-green-100 p-1 rounded transition"
                    >
                      <CopyOutlined />
                    </button>
                  </div>
                </div>

                {/* Nội dung (Có Copy) */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nội dung:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">
                      {paymentData.description}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(paymentData.description, "Nội dung")
                      }
                      className="text-green-600 hover:bg-green-100 p-1 rounded transition"
                    >
                      <CopyOutlined />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-600 font-medium animate-pulse mt-6">
                <span className="loading loading-spinner loading-sm">⏳</span>
                Hệ thống đang chờ nhận tiền...
              </div>

              <button
                onClick={() => setPaymentData(null)}
                className="mt-4 text-sm text-gray-400 underline hover:text-red-500"
              >
                Hủy & Quay lại
              </button>
            </div>
          )}

          {/* TRƯỜNG HỢP 3: THÀNH CÔNG */}
          {isPaid && (
            <div className="text-center py-8">
              <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h3>
              <p className="text-gray-500 text-sm">
                Đơn hàng của bạn đã được xác nhận.
                <br />
                Đang chuyển hướng...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
