import React, { useEffect } from "react";
import { Link } from "react-router-dom";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const CartDropdown: React.FC<CartDropdownProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onUpdateQuantity,
}) => {
  useEffect(() => {
    const linkId = "fontawesome-cdn";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(link);
    }
  }, []);

  if (!isOpen) return null;

  const getDiscountedPrice = (
    price: number,
    discount?: { type: string; value: number } | null
  ) => {
    if (!discount) return price;
    const type = discount.type ? discount.type.toLowerCase() : "";

    if (type === "percent") return price * (1 - discount.value / 100);
    if (type === "fixed_amount") return Math.max(0, price - discount.value);
    return price;
  };
  const totalPrice = cartItems.reduce((total, item) => {
    const price = getDiscountedPrice(item.price, item.discount);
    return total + price * item.quantity;
  }, 0);

  const originalTotalPrice = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price;
    return total + originalPrice * item.quantity;
  }, 0);

  const savedAmount = originalTotalPrice - totalPrice;

  const handleNavigate = () => onClose();

  return (
    <div className="fixed right-0 top-20 w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-emerald-100 z-[9999] overflow-hidden font-sans animate-fade-in-up">
      {/* Arrow */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-emerald-600 transform rotate-45"></div>

      {/* Header - Đã sửa lại màu icon */}
      <div className="px-6 py-2 bg-emerald-600 text-white flex justify-between items-center shadow-md relative z-10">
        <div className="flex items-center gap-3">
          {/* Thay đổi: Nền trắng, Icon xanh để nổi bật hơn */}
          <div className="bg-white p-2.5 rounded-xl shadow-sm backdrop-blur-sm">
            <i className="fas fa-shopping-basket text-lg text-emerald-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Giỏ Hàng</h3>
            <p className="text-emerald-100 text-xs font-medium">
              {cartItems.length} sản phẩm tươi ngon
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200 group"
        >
          <i className="fas fa-times text-lg text-emerald-50 group-hover:text-white group-hover:rotate-90 transition-all"></i>
        </button>
      </div>

      {/* Body */}
      <div className="bg-white">
        {cartItems.length > 0 ? (
          <>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {cartItems.map((item, index) => {
                const discountedPrice = getDiscountedPrice(
                  item.price,
                  item.discount
                );
                const itemTotalPrice = discountedPrice * item.quantity;
                const hasDiscount = !!item.discount;

                return (
                  <div
                    key={item.id}
                    className={`px-5 py-4 border-b border-gray-100 hover:bg-emerald-50/30 transition-all duration-200 ${
                      index === cartItems.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link
                        to={`/san-pham/${item.slug}`}
                        onClick={handleNavigate}
                        className="relative group/img"
                      >
                        <div className="overflow-hidden rounded-2xl border border-gray-200 w-20 h-20">
                          <img
                            src={`http://localhost:8080/storage/images/products/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/80x80?text=No+Image";
                            }}
                          />
                        </div>

                        {hasDiscount && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                            {item.discount.type === "percent"
                              ? `-${item.discount.value}%`
                              : `-${(
                                  item.discount.value / 1000
                                ).toLocaleString()}K`}
                          </span>
                        )}
                      </Link>

                      {/* Right content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/san-pham/${item.slug}`}
                              onClick={handleNavigate}
                            >
                              <p className="text-[13px] font-semibold text-gray-700 hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                {item.name}
                              </p>
                            </Link>

                            {/* Thay đổi: Icon thùng rác rõ hơn */}
                            <button
                              onClick={() => onRemove(item.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-all ml-1"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>

                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-bold text-emerald-700 text-[14px]">
                              {formatVND(discountedPrice)}
                            </span>

                            {hasDiscount && (
                              <span className="text-[11px] text-gray-400 line-through decoration-gray-400">
                                {formatVND(item.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity - Thay đổi style nút bấm */}
                        <div className="flex justify-between items-center mt-2 ">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm h-7 ">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-7 h-full rounded-l-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                            >
                              <i className="fas fa-minus text-[9px]"></i>
                            </button>

                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                onUpdateQuantity(item.id, val);
                              }}
                              className="w-12  bg-transparent text-xs text-right font-bold text-gray-700 focus:outline-none h-full"
                            />

                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-full rounded-r-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                            >
                              <i className="fas fa-plus text-[9px]"></i>
                            </button>
                          </div>

                          <div className="ml-2 text-right">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md min-w-[80px] inline-block text-right whitespace-nowrap">
                              {formatVND(itemTotalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-2 border-t border-emerald-100">
              {savedAmount > 0 && (
                <div className="mb-3 flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium shadow-sm">
                  <i className="fas fa-gift text-orange-500"></i>
                  <span>
                    Đã tiết kiệm:{" "}
                    <span className="font-bold text-orange-800">
                      {formatVND(savedAmount)}
                    </span>
                  </span>
                </div>
              )}

              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-600 text-sm font-medium">
                  Tạm tính:
                </span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-700 block leading-none">
                    {formatVND(totalPrice)}
                  </span>
                </div>
              </div>

              <Link to="/gio-hang" onClick={handleNavigate}>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <span>Thanh toán ngay</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
              </Link>
            </div>
          </>
        ) : (
          // Empty State - Thay đổi màu icon tươi hơn
          <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-white">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <i className="fas fa-leaf text-4xl text-emerald-500"></i>
            </div>
            <h4 className="text-gray-800 font-bold text-lg mb-2">
              Chưa có sản phẩm nào
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              Khám phá ngay thực phẩm tươi sạch tại cửa hàng nhé!
            </p>
            <Link to="/san-pham" onClick={handleNavigate}>
              <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm shadow-md shadow-emerald-200">
                <i className="fas fa-store"></i>
                Mua sắm ngay
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
