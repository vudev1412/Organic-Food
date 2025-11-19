import { CloseOutlined } from "@ant-design/icons";
import { useCurrentApp } from "../../components/context/app.context";
import { useState } from "react";
import "./index.scss";
const Cart = () => {
  // --- PHẦN LOGIC: Giữ nguyên 100% ---
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } =
    useCurrentApp();

  // State cho modal xác nhận
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const getDiscountedPrice = (
    price: number,
    discount?: { id: number; type: string; value: number } | null
  ) => {
    if (!discount) return price;
    // Chuyển type về lowercase để so sánh an toàn
    const type = discount.type ? discount.type.toLowerCase() : "";

    if (type === "percent") return price * (1 - discount.value / 100);
    if (type === "fixed_amount") return Math.max(0, price - discount.value);
    return price;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const discounted = getDiscountedPrice(item.price, item.discount);
    return total + discounted * item.quantity;
  }, 0);

  const totalSavings = cartItems.reduce((total, item) => {
    // Sử dụng originalPrice nếu có (được lưu lúc add to cart), nếu không thì dùng price
    const originalPrice = item.originalPrice || item.price;
    const discounted = getDiscountedPrice(item.price, item.discount);
    const savedPerItem = originalPrice - discounted;

    // Chỉ cộng nếu có tiết kiệm thực sự
    return total + (savedPerItem > 0 ? savedPerItem : 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  // Hàm xử lý xóa sản phẩm
  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      removeFromCart(itemToDelete);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Hàm xử lý xóa giỏ hàng
  const handleClearCartClick = () => {
    setShowClearCartModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearCartModal(false);
  };

  const cancelClearCart = () => {
    setShowClearCartModal(false);
  };

  // --- HẾT PHẦN LOGIC ---

  // 👉 Giao diện giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 mb-8">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
          <a
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Khám phá sản phẩm
          </a>
        </div>
      </div>
    );
  }

  // 👉 Giao diện chính giỏ hàng
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">{cartItems.length} sản phẩm</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* CỘT BÊN TRÁI: Danh sách sản phẩm */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <ul role="list" className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const discountedPrice = getDiscountedPrice(
                    item.price,
                    item.discount
                  );
                  const itemTotal = discountedPrice * item.quantity;
                  const hasDiscount = !!item.discount;

                  return (
                    <li
                      key={item.id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Hình ảnh sản phẩm */}
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <img
                              src={
                                item.image
                                  ? `http://localhost:8080/storage/images/products/${item.image}`
                                  : "https://placehold.co/100x100/a0e0a0/333"
                              }
                              alt={item.name}
                              className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl object-cover object-center ring-1 ring-gray-200"
                            />
                            {hasDiscount && item.discount && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                {item.discount.type === "percent"
                                  ? `-${item.discount.value}%`
                                  : `-${(
                                      item.discount.value / 1000
                                    ).toLocaleString()}K`}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
                            {/* Tên & Giá */}
                            <div className="flex-1">
                              <h3 className="cart-product-name">
                                <a
                                  href={`/san-pham/${item.slug}`}
                                  className="hover:text-green-600 transition-colors"
                                >
                                  {item.name}
                                </a>
                              </h3>

                              <div className="flex items-center gap-2 flex-wrap">
                                {hasDiscount ? (
                                  <>
                                    <span className="text-lg sm:text-xl font-bold text-red-600">
                                      {discountedPrice.toLocaleString()}₫
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                      {item.price.toLocaleString()}₫
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                                    {item.price.toLocaleString()}₫
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Tổng giá (desktop) */}
                            <div className="hidden sm:block text-right">
                              <p className="text-xs text-gray-500 mb-1">
                                Thành tiền
                              </p>
                              <p className="text-xl font-bold text-gray-900">
                                {itemTotal.toLocaleString()}₫
                              </p>
                            </div>
                          </div>

                          {/* Số lượng & Xóa */}
                          <div className="mt-4 flex items-center justify-between">
                            {/* Điều chỉnh số lượng */}
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity - 1)
                                }
                                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                                aria-label="Giảm số lượng"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQty = Math.max(
                                    1,
                                    parseInt(e.target.value) || 1
                                  );
                                  const maxAvailable =
                                    item.maxQuantityAvailable || 100;
                                  updateCartQuantity(
                                    item.id,
                                    Math.min(newQty, maxAvailable)
                                  );
                                }}
                                className="w-12 sm:w-14 text-center py-2 bg-transparent font-semibold text-gray-900 focus:outline-none"
                                min="1"
                                max={item.maxQuantityAvailable || 100}
                              />
                              <button
                                onClick={() => {
                                  const maxAvailable =
                                    item.maxQuantityAvailable || 100;
                                  if (item.quantity < maxAvailable) {
                                    updateCartQuantity(
                                      item.id,
                                      item.quantity + 1
                                    );
                                  }
                                }}
                                disabled={
                                  item.quantity >=
                                  (item.maxQuantityAvailable || 100)
                                }
                                className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Tăng số lượng"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Stock availability indicator */}
                            <div className="mt-2 text-sm">
                              {item.quantity >=
                              (item.maxQuantityAvailable || 100) ? (
                                <span className="text-orange-600 font-medium">
                                  ⚠️ Đã đạt số lượng tối đa
                                </span>
                              ) : (
                                <span className="text-gray-600">
                                  Còn lại:{" "}
                                  <span className="font-semibold text-green-600">
                                    {(item.maxQuantityAvailable || 100) -
                                      item.quantity}
                                  </span>{" "}
                                  sản phẩm
                                </span>
                              )}
                            </div>

                            {/* Nút xóa */}
                            <button
                              type="button"
                              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <CloseOutlined className="text-base" />
                              <span className="hidden sm:inline">Xóa</span>
                            </button>
                          </div>

                          {/* Tổng giá (mobile) */}
                          <div className="mt-3 sm:hidden">
                            <p className="text-lg font-bold text-gray-900 text-right">
                              {itemTotal.toLocaleString()}₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mã giảm giá & Xóa giỏ hàng */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Mã giảm giá */}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap">
                    Áp dụng
                  </button>
                </div>

                {/* Xóa giỏ hàng */}
                <button
                  onClick={handleClearCartClick}
                  className="flex items-center justify-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors sm:ml-4"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa tất cả
                </button>
              </div>
            </div>
          </section>

          {/* CỘT BÊN PHẢI: Tóm tắt đơn hàng */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <dl className="space-y-4">
                {/* Tạm tính */}
                <div className="flex items-center justify-between py-2">
                  <dt className="text-gray-600">Tạm tính</dt>
                  <dd className="font-semibold text-gray-900">
                    {subtotal.toLocaleString()}₫
                  </dd>
                </div>

                {/* Tiết kiệm */}
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                    <dt className="flex items-center gap-2 text-green-700 font-medium">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Tiết kiệm
                    </dt>
                    <dd className="font-bold text-green-700">
                      -{totalSavings.toLocaleString()}₫
                    </dd>
                  </div>
                )}

                {/* Vận chuyển */}
                <div className="flex items-center justify-between py-2 border-t border-gray-200 pt-4">
                  <dt className="text-gray-600">Phí vận chuyển</dt>
                  <dd className="font-semibold text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">Miễn phí</span>
                    ) : (
                      `${shipping.toLocaleString()}₫`
                    )}
                  </dd>
                </div>

                {subtotal < 500000 && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-700">
                      💡 Mua thêm {(500000 - subtotal).toLocaleString()}₫ để
                      được miễn phí vận chuyển
                    </p>
                  </div>
                )}

                {/* Tổng cộng */}
                <div className="flex items-center justify-between border-t-2 border-gray-300 pt-4 mt-4">
                  <dt className="text-lg font-bold text-gray-900">Tổng cộng</dt>
                  <dd className="text-2xl font-bold text-red-600">
                    {total.toLocaleString()}₫
                  </dd>
                </div>
              </dl>

              {/* Nút thanh toán */}
              <div className="mt-8 space-y-3">
                <button className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Thanh toán ngay
                </button>
                <a
                  href="/san-pham"
                  className="block w-full text-center text-green-600 font-semibold py-3 hover:text-green-700 transition-colors"
                >
                  ← Tiếp tục mua sắm
                </a>
              </div>

              {/* Thông tin bổ sung */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Giao hàng nhanh 2-3 ngày</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal xác nhận xóa sản phẩm */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xóa sản phẩm?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa giỏ hàng */}
        {showClearCartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xóa toàn bộ giỏ hàng?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa tất cả {cartItems.length} sản phẩm
                khỏi giỏ hàng? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelClearCart}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmClearCart}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
