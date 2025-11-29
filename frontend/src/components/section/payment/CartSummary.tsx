// File path: /src/components/section/payment/CartSummary.tsx

import { formatCurrency } from "../../../utils/format";

// --- Heroicons-like SVG Icons ---
const CheckCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ReceiptPercentIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <path d="M13 2v7h7" />
    <circle cx="9" cy="15" r="3" />
    <path d="M12 18l-1.5-3.5L9 11l-1.5 3.5L6 18h6z" />
  </svg>
);

const TruckIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const TagIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-2.4 1.4-3 2-3 2V6a2 2 0 012-2h4l6 6v7a2 2 0 01-2 2H9z" />
    <path d="M10 8h.01" />
  </svg>
);

const SparklesIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3L9 9M9 3L3 9M13.5 10.5L10.5 13.5M19.5 19.5L16.5 16.5M19.5 16.5L16.5 19.5M12 21l2-4 4-2-4-2-2-4-2 4-4 2 4 2 2 4z" />
  </svg>
);

const PercentIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="5" x2="5" y2="19"></line>
    <circle cx="6.5" cy="6.5" r="2.5"></circle>
    <circle cx="17.5" cy="17.5" r="2.5"></circle>
  </svg>
);
// -------------------------------------------------------------------

interface CartSummaryProps {
  subtotal: number;
  totalSavings: number;
  shipping: number;
  taxAmount: number; // [QUAN TRỌNG] Nhận giá trị thuế từ Parent
  total: number; // [QUAN TRỌNG] Nhận tổng tiền cuối cùng từ Parent
  discountAmount: number;
  appliedVoucher: any;
  onCheckout: () => void;
}

const CartSummary = ({
  subtotal,
  totalSavings,
  shipping,
  total, // Sử dụng trực tiếp prop này
  taxAmount, // Sử dụng trực tiếp prop này
  discountAmount,
  appliedVoucher,
  onCheckout,
}: CartSummaryProps) => {
  // ===================== TÍNH NGÀY GIAO HÀNG =====================
  const expectedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Cộng thêm 3 ngày
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Tính tổng số tiền tiết kiệm được (để hiển thị UI)
  const grandTotalSavings =
    totalSavings +
    discountAmount +
    (appliedVoucher && appliedVoucher.typeVoucher === "FREESHIP"
      ? shipping
      : 0);

  return (
    <div className="sticky top-8 bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
        <ReceiptPercentIcon className="w-6 h-6 text-green-600" />
        Tóm tắt đơn hàng
      </h2>

      <dl className="space-y-4">
        {/* Tạm tính (Subtotal) */}
        <div className="flex items-center justify-between">
          <dt className="text-gray-600 flex items-center gap-2">Tạm tính</dt>
          <dd className="font-semibold text-gray-900">
            {formatCurrency(subtotal)}
          </dd>
        </div>

        {/* Tiết kiệm từ giảm giá sản phẩm */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
            <dt className="flex items-center gap-2 text-green-700 font-bold">
              <TagIcon className="w-5 h-5 text-green-500" />
              Tiết kiệm từ sản phẩm
            </dt>
            <dd className="font-bold text-green-700">
              -{formatCurrency(totalSavings)}
            </dd>
          </div>
        )}

        {/* Giảm giá từ Voucher (Áp dụng cho voucher không phải Freeship) */}
        {appliedVoucher &&
          appliedVoucher.typeVoucher !== "FREESHIP" &&
          discountAmount > 0 && (
            <div className="flex items-center justify-between">
              <dt className="text-gray-600 flex items-center gap-2">
                <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Voucher
                </span>
                <span className="text-purple-700 font-medium text-sm">
                  ({appliedVoucher.code})
                </span>
              </dt>
              <dd className="font-bold text-red-600">
                -{formatCurrency(discountAmount)}
              </dd>
            </div>
          )}

        {/* THUẾ GTGT 8% */}
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
          <dt className="text-gray-600 flex items-center gap-2">
            <PercentIcon className="w-5 h-5 text-red-500" />
            Thuế GTGT (8%)
          </dt>
          <dd className="font-semibold text-gray-900">
            {/* Hiển thị giá trị taxAmount được truyền từ Parent */}
            {formatCurrency(taxAmount)}
          </dd>
        </div>

        {/* Phí vận chuyển */}
        <div className="flex items-center justify-between">
          <dt className="text-gray-600 flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-gray-500" />
            Phí vận chuyển
          </dt>
          <dd className="font-semibold text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600 font-bold">Miễn phí</span>
            ) : (
              formatCurrency(shipping)
            )}
          </dd>
        </div>

        {/* Thông báo khuyến mãi (Nếu cần mua thêm) */}
        {subtotal < 500000 && shipping !== 0 && (
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận
              chuyển!
            </p>
          </div>
        )}

        {/* Thông báo Voucher FREESHIP */}
        {appliedVoucher &&
          appliedVoucher.typeVoucher === "FREESHIP" &&
          shipping === 0 && (
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <p className="text-sm text-purple-700 font-medium">
                Voucher FREESHIP ({appliedVoucher.code}) đã được áp dụng thành
                công.
              </p>
            </div>
          )}

        {/* Tổng cộng */}
        <div className="flex items-center justify-between border-t-2 border-green-600 pt-4 mt-4">
          <dt className="text-xl font-extrabold text-gray-900">TỔNG CỘNG</dt>
          <dd className="text-3xl font-extrabold text-red-600">
            {/* Hiển thị giá trị total được truyền từ Parent */}
            {formatCurrency(total)}
          </dd>
        </div>

        {/* Tổng tiết kiệm toàn bộ (Thông báo nổi bật) */}
        {grandTotalSavings > 0 && (
          <div className="pt-2">
            <p className="text-sm font-bold text-left text-green-800 bg-green-200 p-3 rounded-xl shadow-inner">
              Bạn đã TIẾT KIỆM được tổng cộng:
              <span> {formatCurrency(grandTotalSavings)}</span>
            </p>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onCheckout}
          className="w-full bg-green-600 text-white font-extrabold text-lg py-4 rounded-xl shadow-xl hover:bg-green-700 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
        >
          <span>Thanh toán ngay</span>
        </button>

        <a
          href="/san-pham"
          className="block w-full text-center text-green-600 font-bold py-3 hover:text-green-700 transition-colors border border-green-200 rounded-xl"
        >
          Tiếp tục mua sắm
        </a>
      </div>

      {/* Phần thông tin bổ sung */}
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
        <p className="font-semibold text-gray-700 mb-3">Chính sách đảm bảo:</p>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <TruckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>
            Dự kiến nhận hàng vào:
            <strong className="text-gray-900"> {expectedDeliveryDate()}</strong>
          </span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <TruckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Giao hàng nhanh chóng trong 2-3 ngày làm việc.</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            ></path>
          </svg>
          <span>Thanh toán an toàn và bảo mật thông tin tuyệt đối.</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          <span>Đổi trả linh hoạt trong vòng 7 ngày nếu sản phẩm lỗi.</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
