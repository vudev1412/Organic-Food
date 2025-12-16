import { QRCodeCanvas } from "qrcode.react";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";
import { formatCurrency } from "../../../utils/format";
import { useEffect, useRef, useState } from "react";

interface PaymentQrScanProps {
  paymentData: any;
  onCancel: () => void;
}

const INITIAL_TIME_SECONDS = 10 * 60;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // Định dạng thành MM:SS, ví dụ: 09:30
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};
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

const PaymentQrScan = ({ paymentData, onCancel }: PaymentQrScanProps) => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    // Thoát khỏi effect nếu thời gian đã hết
    if (timeLeft <= 0) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }

      // *** LOGIC HỦY GIAO DỊCH KHI HẾT GIỜ ***
      // Gọi onCancel (hàm handleCancelAndClear ở component cha)
      onCancel();
      message.error(
        "Đã hết thời gian thanh toán. Giao dịch đã bị hủy tự động."
      );
      return;
    }

    // Thiết lập interval 1 giây
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup function: Xóa interval khi component unmount hoặc timeLeft về 0
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, onCancel]); // Thêm onCancel vào dependency array
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép!");
  };
  const isExpired = timeLeft <= 0;
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div
        className={`text-xl font-extrabold mb-4 p-2 rounded-lg ${
          isExpired
            ? "text-gray-500 bg-gray-100"
            : "text-orange-600 bg-orange-50/70"
        }`}
      >
        {isExpired ? (
          <span>Đã hết hạn!</span>
        ) : (
          <span>Thời gian còn lại: {formatTime(timeLeft)}</span>
        )}
      </div>
      <div className="p-3 bg-white border-2 border-green-500 rounded-xl shadow-sm mb-6">
        <QRCodeCanvas
          value={paymentData.qrCode || ""}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">Ngân hàng:</span>
          <span className="font-bold text-gray-800">
            {getBankName(paymentData.bin)}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">Số tài khoản:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-base">
              {paymentData.accountNumber}
            </span>
            <button
              onClick={() => handleCopy(paymentData.accountNumber)}
              className="text-green-600 hover:bg-green-100 p-1 rounded"
            >
              <CopyOutlined />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">Số tiền:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600 text-base">
              {formatCurrency(paymentData.amount)}
            </span>
            <button
              onClick={() => handleCopy(paymentData.amount.toString())}
              className="text-green-600 hover:bg-green-100 p-1 rounded"
            >
              <CopyOutlined />
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">
              {paymentData.description}
            </span>
            <button
              onClick={() => handleCopy(paymentData.description)}
              className="text-green-600 hover:bg-green-100 p-1 rounded"
            >
              <CopyOutlined />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center gap-2 font-medium mt-6 ${
          isExpired ? "text-red-500" : "text-green-600 animate-pulse"
        }`}
      >
        <span
          className={`${
            isExpired ? "hidden" : "loading loading-spinner loading-sm"
          }`}
        >
          ⏳
        </span>
        {isExpired
          ? "Giao dịch đã bị hủy do hết thời gian."
          : "Hệ thống đang chờ nhận tiền..."}
      </div>

      <button
        onClick={onCancel}
        className="mt-4 text-sm text-gray-400 underline hover:text-red-500"
      >
        Quay lại
      </button>
    </div>
  );
};

export default PaymentQrScan;
