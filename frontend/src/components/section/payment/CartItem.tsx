import { Link } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../../utils/format";

// Định nghĩa Interface cho props
interface CartItemProps {
  item: any;
  updateCartQuantity: (id: number, quantity: number) => void;
  openDeleteItemModal: (id: number) => void;
}

const CartItem = ({
  item,
  updateCartQuantity,
  openDeleteItemModal,
}: CartItemProps) => {
  const finalPrice = item.price;
  const originalPrice = item.originalPrice || item.price;
  const isDiscounted = originalPrice > finalPrice;
  const itemTotal = finalPrice * item.quantity;
  const maxStock = item.maxQuantityAvailable || 100;
  const isAtMaxStock = item.quantity >= maxStock;

  // Xử lý input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      const clampedVal = Math.min(Math.max(val, 1), maxStock);
      updateCartQuantity(item.id, clampedVal);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      e.target.value = "1";
      if (item.quantity !== 1) updateCartQuantity(item.id, 1);
    } else if (val > maxStock) {
      e.target.value = maxStock.toString();
      if (item.quantity !== maxStock) updateCartQuantity(item.id, maxStock);
    }
  };

  return (
    <li className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4 sm:gap-6">
        {/* Hình ảnh */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <Link to={`/san-pham/${item.slug}`} state={{ productId: item.id }}>
              <img
                src={
                  item.image
                    ? `http://localhost:8080/storage/images/products/${item.image}`
                    : "https://placehold.co/100x100/a0e0a0/333"
                }
                alt={item.name}
                className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl object-cover object-center ring-1 ring-gray-200"
              />
            </Link>
            {isDiscounted && item.discount && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {item.discount.type === "PERCENT"
                  ? `-${item.discount.value}%`
                  : `-${(item.discount.value / 1000).toLocaleString()}K`}
              </div>
            )}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h3 className="cart-product-name">
                <Link
                  to={`/san-pham/${item.slug}`}
                  state={{ productId: item.id }}
                  className="hover:text-green-600 transition-colors"
                >
                  {item.name}
                </Link>
              </h3>

              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    isDiscounted ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(finalPrice)}
                </span>
                {isDiscounted && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>

              {isAtMaxStock && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit">
                  <span>Đã đạt số lượng tối đa ({maxStock})</span>
                </div>
              )}
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500 mb-1">Thành tiền</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(itemTotal)}
              </p>
            </div>
          </div>

          {/* Controls: Số lượng & Xóa */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                disabled={item.quantity <= 1}
                className={`px-3 py-2 transition-colors ${
                  item.quantity <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                -
              </button>

              <input
                type="number"
                value={item.quantity}
                min={1}
                max={maxStock}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                className="w-9 sm:w-8 text-right py-1.5 px-1.5 bg-gray-100 font-semibold text-sm text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                disabled={isAtMaxStock}
                className={`px-3 py-2 transition-colors ${
                  isAtMaxStock
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              onClick={() => openDeleteItemModal(item.id)}
            >
              <CloseOutlined className="text-base" />
              <span className="hidden sm:inline">Xóa</span>
            </button>
          </div>

          <div className="mt-3 sm:hidden">
            <p className="text-lg font-bold text-gray-900 text-right">
              {formatCurrency(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
