// File path: /src/components/common/cart.dropdown.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ICartItem[];
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onUpdateQuantity,
}) => {
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  // ✅ 1. TÍNH TỔNG TIỀN (Dùng item.price là giá chuẩn)
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // ✅ 2. TÍNH TỔNG GIÁ GỐC (Dùng originalPrice)
  const originalTotalPrice = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price;
    return total + originalPrice * item.quantity;
  }, 0);

  const savedAmount = originalTotalPrice - totalPrice;

  const handleNavigate = () => onClose();

  const handleDeleteClick = (productId: number) => {
    if (!productId) return;
    setItemToDelete(productId);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      onRemove(itemToDelete);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => setItemToDelete(null);

  const handleUpdateSafe = (productId: number, quantity: number) => {
    if (!productId) return;
    onUpdateQuantity(productId, quantity);
  };

  const getImageUrl = (imageName: string) => {
    if (!imageName) return "";
    if (imageName.startsWith("http")) return imageName;
    return `http://localhost:8080/storage/images/products/${imageName}`;
  };

  return (
    <div className="fixed right-0 top-20 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-emerald-100 z-[9999] overflow-hidden font-sans animate-fade-in-up mx-4 sm:mx-0">
      {/* Arrow */}
      <div className="absolute -top-2 right-6 sm:right-6 w-4 h-4 bg-emerald-600 transform rotate-45"></div>

      {/* Header */}
      <div className="px-4 sm:px-6 py-2 bg-emerald-600 text-white flex justify-between items-center shadow-md relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white p-2 sm:p-2.5 rounded-xl shadow-sm backdrop-blur-sm">
            <i className="fas fa-shopping-basket text-base sm:text-lg text-emerald-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-tight">
              Giỏ Hàng
            </h3>
            <p className="text-emerald-100 text-[11px] sm:text-xs font-medium">
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
      <div className="bg-white relative min-h-[200px]">
        {/* Modal Delete */}
        {itemToDelete !== null && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <i className="fas fa-trash-alt text-2xl text-red-500 animate-bounce"></i>
            </div>
            <h4 className="text-gray-800 font-bold text-lg mb-1">
              Xóa sản phẩm?
            </h4>
            <p className="text-gray-500 text-sm mb-6 text-center px-4">
              Bạn có chắc chắn muốn xóa không?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {/* List Items */}
        {cartItems.length > 0 ? (
          <>
            <div className="max-h-[50vh] sm:max-h-[400px] lg:max-h-[400px] overflow-y-auto custom-scrollbar">
              {cartItems.map((item, index) => {
                if (!item.id) return null;

                // ✅ LOGIC MỚI: Lấy trực tiếp, không tính toán
                const currentPrice = item.price; // Giá bán (đã giảm)
                const originalPrice = item.originalPrice || item.price; // Giá gốc

                // Chỉ hiển thị giảm giá nếu Giá gốc > Giá bán
                const isDiscounted = originalPrice > currentPrice;
                const itemTotalPrice = currentPrice * item.quantity;

                // ✅ LẤY STOCK TỪ maxQuantityAvailable
                const maxStock = item.maxQuantityAvailable || 100;
                const isAtMaxStock = item.quantity >= maxStock;

                return (
                  <div
                    key={item.id}
                    className={`px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 hover:bg-emerald-50/30 transition-all duration-200 ${
                      index === cartItems.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Image */}
                      <Link
                        to={`/san-pham/${item.slug}`}
                        onClick={handleNavigate}
                        state={{ productId: item.id }}
                        className="relative group/img"
                      >
                        <div className="overflow-hidden rounded-2xl border border-gray-200 w-16 h-16 sm:w-20 sm:h-20">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/80x80?text=No+Image";
                            }}
                          />
                        </div>

                        {/* ✅ Badge % Giảm giá */}
                        {isDiscounted && item.discount && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                            {item.discount.type === "PERCENT"
                              ? `-${item.discount.value}%`
                              : `-${(
                                  item.discount.value / 1000
                                ).toLocaleString()}K`}
                          </span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/san-pham/${item.slug}`}
                              onClick={handleNavigate}
                              state={{ productId: item.id }}
                            >
                              <p className="text-[12px] sm:text-[13px] font-semibold text-gray-700 hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                {item.name}
                              </p>
                            </Link>

                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-all ml-1"
                            >
                              <i className="fas fa-trash-alt text-sm"></i>
                            </button>
                          </div>

                          <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
                            {/* ✅ HIỂN THỊ GIÁ BÁN (ĐẬM) */}
                            <span
                              className={`font-bold text-[13px] sm:text-[14px] ${
                                isDiscounted
                                  ? "text-red-600"
                                  : "text-emerald-700"
                              }`}
                            >
                              {formatCurrency(currentPrice)}
                            </span>

                            {/* ✅ HIỂN THỊ GIÁ GỐC (GẠCH NGANG) */}
                            {isDiscounted && (
                              <span className="text-[10px] sm:text-[11px] text-gray-400 line-through decoration-gray-400">
                                {formatCurrency(originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* ✅ HIỂN THỊ STOCK WARNING */}
                          {isAtMaxStock && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-600">
                              <i className="fas fa-exclamation-triangle"></i>
                              <span>Đã đạt tối đa ({maxStock})</span>
                            </div>
                          )}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm h-7">
                            {/* DECREASE BUTTON */}
                            <button
                              onClick={() =>
                                handleUpdateSafe(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className={`w-7 h-full rounded-l-lg flex items-center justify-center transition-colors ${
                                item.quantity <= 1
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white"
                              }`}
                            >
                              <i className="fas fa-minus text-[9px]"></i>
                            </button>

                            {/* INPUT FIELD - ✅ GIỚI HẠN MAX = STOCK */}
                            <input
                              type="number"
                              value={item.quantity}
                              min={1}
                              max={maxStock}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                // Chỉ cập nhật khi giá trị hợp lệ
                                if (
                                  !isNaN(val) &&
                                  val >= 1 &&
                                  val <= maxStock
                                ) {
                                  handleUpdateSafe(item.id, val);
                                }
                              }}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value);
                                // Nếu giá trị không hợp lệ, reset về quantity hiện tại
                                if (isNaN(val) || val < 1) {
                                  e.target.value = "1";
                                  if (item.quantity !== 1) {
                                    handleUpdateSafe(item.id, 1);
                                  }
                                } else if (val > maxStock) {
                                  e.target.value = maxStock.toString();
                                  if (item.quantity !== maxStock) {
                                    handleUpdateSafe(item.id, maxStock);
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-12 bg-transparent text-xs text-center font-bold text-gray-700 focus:outline-none h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            {/* INCREASE BUTTON - ✅ DISABLED KHI ĐẠT MAX */}
                            <button
                              onClick={() =>
                                handleUpdateSafe(item.id, item.quantity + 1)
                              }
                              disabled={isAtMaxStock}
                              className={`w-7 h-full rounded-r-lg flex items-center justify-center transition-colors ${
                                isAtMaxStock
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white"
                              }`}
                              title={
                                isAtMaxStock
                                  ? `Đã đạt tối đa (${maxStock})`
                                  : "Tăng số lượng"
                              }
                            >
                              <i className="fas fa-plus text-[9px]"></i>
                            </button>
                          </div>

                          <div className="ml-2 text-right">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md min-w-[80px] inline-block text-right whitespace-nowrap">
                              {formatCurrency(itemTotalPrice)}
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
            <div className="bg-gray-50 px-4 sm:px-6 py-2 border-t border-emerald-100">
              {savedAmount > 0 && (
                <div className="mb-3 flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium shadow-sm">
                  <i className="fas fa-gift text-orange-500"></i>
                  <span>
                    Đã tiết kiệm:{" "}
                    <span className="font-bold text-orange-800">
                      {formatCurrency(savedAmount)}
                    </span>
                  </span>
                </div>
              )}

              <div className="flex justify-between items-end mb-3 sm:mb-4">
                <span className="text-gray-600 text-xs sm:text-sm font-medium">
                  Tạm tính:
                </span>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-700 block leading-none">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <Link to="/gio-hang" onClick={handleNavigate}>
                <button className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <span>Thanh toán ngay</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-white">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-shopping-basket text-3xl text-emerald-300"></i>
            </div>
            <p className="text-gray-500 text-sm mb-6">Chưa có sản phẩm nào</p>
            <Link to="/san-pham" onClick={handleNavigate}>
              <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
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
