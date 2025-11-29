// File path: /src/components/section/payment/CartCoupon.tsx

interface CartCouponProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  handleApplyVoucher: () => void;
  handleRemoveVoucher: () => void;
  appliedVoucher: any;
  isApplying: boolean;
  voucherError: string | null;
  setVoucherError: (err: string | null) => void;
  // openClearCartModal đã bị xóa
}

const CartCoupon = ({
  voucherCode,
  setVoucherCode,
  handleApplyVoucher,
  handleRemoveVoucher,
  appliedVoucher,
  isApplying,
  voucherError,
  setVoucherError,
}: // openClearCartModal đã bị xóa
CartCouponProps) => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={voucherCode}
            onChange={(e) => {
              setVoucherCode(e.target.value);
              setVoucherError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyVoucher();
            }}
            disabled={isApplying || !!appliedVoucher}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
          />

          {appliedVoucher ? (
            <button
              onClick={handleRemoveVoucher}
              className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors whitespace-nowrap"
            >
              Hủy mã
            </button>
          ) : (
            <button
              onClick={handleApplyVoucher}
              disabled={isApplying}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isApplying ? "Đang áp dụng..." : "Áp dụng"}
            </button>
          )}

          {voucherError && (
            <p
              className={`absolute -bottom-6 left-0 text-sm ${
                appliedVoucher ? "text-green-600" : "text-red-500"
              }`}
            >
              {voucherError}
            </p>
          )}
        </div>
        {/* Nút Xóa tất cả đã bị xóa khỏi đây */}
      </div>
    </div>
  );
};

export default CartCoupon;
