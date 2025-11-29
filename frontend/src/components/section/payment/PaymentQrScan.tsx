import { QRCodeCanvas } from "qrcode.react";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";
import { formatCurrency } from "../../../utils/format";

interface PaymentQrScanProps {
  paymentData: any;
  onCancel: () => void;
}

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
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép!");
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
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

      <div className="flex items-center gap-2 text-green-600 font-medium animate-pulse mt-6">
        <span className="loading loading-spinner loading-sm">⏳</span> Hệ thống
        đang chờ nhận tiền...
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
