// File path: /src/components/section/payment/CartCoupon.tsx

// Chỉ giữ lại các icon cần thiết, loại bỏ Tag và Spin của Ant Design
import {
  CheckCircleFilled,
  DollarOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const CustomLoadingIcon = (
  <LoadingOutlined className="animate-spin" style={{ fontSize: 18 }} />
);

// Interface gợi ý cho appliedVoucher (Giữ nguyên)
interface Voucher {
  code: string;
  typeVoucher: "FREESHIP" | "FIXED_AMOUNT" | "PERCENT";
  value: number;
  maxDiscountAmount?: number;
}

interface CartCouponProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  handleApplyVoucher: () => void;
  handleRemoveVoucher: () => void;
  appliedVoucher: Voucher | null;
  isApplying: boolean;
  voucherError: string | null;
  setVoucherError: (err: string | null) => void;
}

// Hàm Helper để định dạng giá trị giảm giá và đơn vị phù hợp (Giữ nguyên)
const formatDiscountValue = (voucher: Voucher): string => {
  const value = voucher.value;
  switch (voucher.typeVoucher) {
    case "FIXED_AMOUNT":
    case "FREESHIP":
      return `${value.toLocaleString("vi-VN")} đ`;

    case "PERCENT": {
      let displayValue = `${value}%`;

      if (voucher.maxDiscountAmount && voucher.maxDiscountAmount > 0) {
        displayValue += ` (Tối đa ${voucher.maxDiscountAmount.toLocaleString(
          "vi-VN"
        )} đ)`;
      }
      return displayValue;
    }

    default:
      return "...";
  }
};

const CartCoupon = ({
  voucherCode,
  setVoucherCode,
  handleApplyVoucher,
  handleRemoveVoucher,
  appliedVoucher,
  isApplying,
  voucherError,
  setVoucherError,
}: CartCouponProps) => {
  const isVoucherApplied = !!appliedVoucher;
  const discountDisplay = appliedVoucher
    ? formatDiscountValue(appliedVoucher)
    : "...";

  // Tùy chỉnh nội dung thông báo thành công
  const successMessage = appliedVoucher
    ? appliedVoucher.typeVoucher === "FREESHIP"
      ? `Đã áp dụng mã ${appliedVoucher.code}. Bạn được miễn phí vận chuyển ${discountDisplay}!`
      : `Đã áp dụng mã ${appliedVoucher.code}. Bạn được giảm ${discountDisplay}!`
    : "Đang xử lý...";

  // === TẠO COMPONENT THÔNG BÁO TÙY CHỈNH ===
  const CustomAlert = ({
    type,
    message,
  }: {
    type: "success" | "error";
    message: string;
  }) => {
    const isSuccess = type === "success";
    const bgColor = isSuccess
      ? "bg-green-100 border-green-400"
      : "bg-red-100 border-red-400";
    const textColor = isSuccess ? "text-green-700" : "text-red-700";
    const Icon = isSuccess ? (
      <CheckCircleFilled className="text-lg text-green-500 min-w-[1.25rem]" />
    ) : (
      <WarningOutlined className="text-lg text-red-500 min-w-[1.25rem]" />
    );

    // Thay thế Antd Tag bằng div/span được style bằng Tailwind
    return (
      <div
        className={`flex items-start gap-2 p-2 border rounded-lg shadow-sm w-full text-xs sm:text-sm ${bgColor}`}
      >
        <div className="pt-0.5">{Icon}</div>
        <span
          className={`font-medium ${textColor} whitespace-normal break-words flex-1`}
        >
          {message}
        </span>
      </div>
    );
  };
  // ==========================================

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-4 sm:p-5">
      <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3 sm:mb-4 gap-2">
        <DollarOutlined className="text-green-600" />
        Mã giảm giá
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Input và Button Wrapper */}
        <div className="flex flex-1 gap-3 relative flex-wrap">
          <input
            type="text"
            placeholder={
              isVoucherApplied ? appliedVoucher.code : "Nhập mã giảm giá"
            }
            value={isVoucherApplied ? appliedVoucher.code : voucherCode}
            onChange={(e) => {
              if (!isVoucherApplied) {
                setVoucherCode(e.target.value);
              }
              setVoucherError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isVoucherApplied && !isApplying) {
                handleApplyVoucher();
              }
            }}
            disabled={isApplying || isVoucherApplied}
            className={`w-full sm:flex-1 border-2 rounded-xl px-4 py-3 focus:outline-none transition-all text-gray-800 text-sm 
              ${
                isVoucherApplied
                  ? "border-green-400 bg-green-50 cursor-default font-semibold"
                  : "border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              }
              ${isApplying && "bg-gray-100 cursor-wait"}
            `}
          />

          {/* Nút HÀNH ĐỘNG: Áp dụng / Hủy mã */}
          {isVoucherApplied ? (
            <button
              onClick={handleRemoveVoucher}
              className="bg-red-500 text-white px-4 py-3 sm:px-6 rounded-xl font-bold hover:bg-red-600 transition-colors whitespace-nowrap shadow-md text-sm w-full sm:w-auto"
            >
              Hủy mã
            </button>
          ) : (
            <button
              onClick={handleApplyVoucher}
              disabled={isApplying || voucherCode.trim().length === 0}
              className="bg-green-600 text-white px-4 py-3 sm:px-6 rounded-xl font-bold hover:bg-green-700 transition-colors whitespace-nowrap shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm w-full sm:w-auto"
            >
              {isApplying ? (
                // Thay thế Antd Spin bằng CustomLoadingIcon
                <span className="h-4 w-4 flex items-center justify-center">
                  {CustomLoadingIcon}
                </span>
              ) : (
                "Áp dụng"
              )}
            </button>
          )}
        </div>
      </div>

      {/* HIỂN THỊ THÔNG BÁO VÀ TRẠNG THÁI */}
      <div className="mt-3 min-h-[35px]">
        {" "}
        {isVoucherApplied && (
          <CustomAlert type="success" message={successMessage} />
        )}
        {/* THÔNG BÁO LỖI (Sử dụng CustomAlert) */}
        {voucherError && !isVoucherApplied && (
          <CustomAlert type="error" message={`Lỗi: ${voucherError}`} />
        )}
        {/* Trạng thái mặc định hoặc hướng dẫn */}
        {!isVoucherApplied && !voucherError && (
          <p className="text-xs text-gray-500 italic">
            Nhập mã và nhấn "Áp dụng" để nhận ưu đãi.
          </p>
        )}
      </div>
    </div>
  );
};

export default CartCoupon;
