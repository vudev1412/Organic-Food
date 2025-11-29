// File path: /src/pages/client/payment.tsx

import { useCurrentApp } from "../../components/context/app.context";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
import PaymentModal from "../../components/section/payment/PaymentModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getVoucherByCodeAPI } from "../../service/api";

// Import các Component con

import "./index.scss";
import CartEmpty from "../../components/section/payment/CartEmpty";
import CartCoupon from "../../components/section/payment/CartCoupon";
import CartSummary from "../../components/section/payment/CartSummary";
import CartItem from "../../components/section/payment/CartItem";
import { DeleteOutlined } from "@ant-design/icons";

interface IAppliedVoucher extends IResVoucherDTO {
  discountAmount: number;
}

const Payment = () => {
  const { cartItems, removeFromCart, clearCart, updateCartQuantity } =
    useCurrentApp();
  const navigate = useNavigate();

  // State Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<IAppliedVoucher | null>(
    null
  );
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // State Modal

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete-item" | "clear-cart";
    itemId?: number;
  }>({ isOpen: false, type: "delete-item" });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ===================== LOGIC TÍNH TOÁN =====================
  const { subtotal, totalSavings, shipping, total, discountAmount } =
    useMemo(() => {
      const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const totalSavings = cartItems.reduce((total, item) => {
        const originalPrice = item.originalPrice || item.price;
        const savedPerItem = Math.max(0, originalPrice - item.price);
        return total + savedPerItem * item.quantity;
      }, 0);

      const shippingFee = subtotal > 500000 ? 0 : 25000;
      let currentDiscountAmount = 0;
      let finalShipping = shippingFee;

      if (appliedVoucher) {
        if (appliedVoucher.typeVoucher === "FIXED_AMOUNT") {
          currentDiscountAmount = Math.min(appliedVoucher.value, subtotal);
        } else if (appliedVoucher.typeVoucher === "PERCENT") {
          const discountFromPercent = subtotal * (appliedVoucher.value / 100);
          currentDiscountAmount = Math.min(
            discountFromPercent,
            appliedVoucher.maxDiscountAmount
          );
        } else if (appliedVoucher.typeVoucher === "FREESHIP") {
          const freeshipDiscount = Math.min(
            shippingFee,
            appliedVoucher.maxDiscountAmount
          );
          finalShipping = shippingFee - freeshipDiscount;
        }
      }

      const finalSubtotalAfterVoucher = subtotal - currentDiscountAmount;
      const finalTotal = finalSubtotalAfterVoucher + finalShipping;

      return {
        subtotal,
        totalSavings,
        shipping: finalShipping,
        total: finalTotal,
        discountAmount: currentDiscountAmount,
      };
    }, [cartItems, appliedVoucher]);

  // ===================== LOGIC API VOUCHER =====================
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setVoucherError("Vui lòng nhập mã giảm giá.");
      setAppliedVoucher(null);
      return;
    }
    setVoucherError(null);
    setIsApplying(true);

    try {
      const res = await getVoucherByCodeAPI(voucherCode.toUpperCase());
      const voucherData = res.data.data;

      if (!voucherData) {
        setVoucherError("Mã giảm giá không tồn tại.");
        setAppliedVoucher(null);
        return;
      }

      // Kiểm tra Active
      if (!voucherData.active) {
        setVoucherError(
          "Mã giảm giá này chưa được kích hoạt hoặc đã bị vô hiệu hóa."
        );
        setAppliedVoucher(null);
        return;
      }

      const now = new Date();
      const startDate = new Date(voucherData.startDate);
      const endDate = new Date(voucherData.endDate);

      if (now < startDate || now > endDate) {
        setVoucherError("Mã giảm giá đã hết hạn hoặc chưa đến ngày sử dụng.");
        setAppliedVoucher(null);
        return;
      }

      if (voucherData.quantity <= voucherData.usedCount) {
        setVoucherError("Mã giảm giá đã hết lượt sử dụng.");
        setAppliedVoucher(null);
        return;
      }

      if (subtotal < voucherData.minOrderValue) {
        setVoucherError(
          `Đơn hàng tối thiểu để áp dụng là ${formatCurrency(
            voucherData.minOrderValue
          )}.`
        );
        setAppliedVoucher(null);
        return;
      }

      // Logic tính toán lại tiền giảm để lưu vào state (dùng để hiển thị)
      let calculatedDiscount = 0;
      if (voucherData.typeVoucher === "FIXED_AMOUNT") {
        calculatedDiscount = Math.min(voucherData.value, subtotal);
      } else if (voucherData.typeVoucher === "PERCENT") {
        const discountFromPercent = subtotal * (voucherData.value / 100);
        calculatedDiscount = Math.min(
          discountFromPercent,
          voucherData.maxDiscountAmount
        );
      } else if (voucherData.typeVoucher === "FREESHIP") {
        const currentShippingFee =
          cartItems.length > 0 && subtotal <= 500000 ? 25000 : 0;
        calculatedDiscount = Math.min(
          currentShippingFee,
          voucherData.maxDiscountAmount
        );
      }

      setAppliedVoucher({ ...voucherData, discountAmount: calculatedDiscount });
      setVoucherError(`Áp dụng mã ${voucherCode.toUpperCase()} thành công!`);
    } catch (error) {
      console.error(error);
      setVoucherError("Lỗi hệ thống khi kiểm tra mã giảm giá.");
      setAppliedVoucher(null);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError(null);
  };

  // ===================== HANDLERS MODAL =====================
  const openDeleteItemModal = (itemId: number) =>
    setConfirmModal({ isOpen: true, type: "delete-item", itemId });
  const openClearCartModal = () =>
    setConfirmModal({ isOpen: true, type: "clear-cart" });
  const closeModal = () =>
    setConfirmModal({ isOpen: false, type: "delete-item" });

  const handleConfirm = () => {
    if (confirmModal.type === "delete-item" && confirmModal.itemId) {
      removeFromCart(confirmModal.itemId);
    } else if (confirmModal.type === "clear-cart") {
      clearCart();
    }
    closeModal();
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPaymentModal(false);
    navigate("/success");
  };

  // ===================== RENDER =====================
  if (cartItems.length === 0) return <CartEmpty />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex justify-between items-center">
          {/* Thay đổi ở đây */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600">{cartItems.length} sản phẩm</p>
          </div>
          <button
            onClick={openClearCartModal}
            className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors py-2 px-3 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100"
          >
            <DeleteOutlined />
            <span className="hidden sm:inline">Xóa tất cả</span>
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Cột trái: Danh sách sản phẩm & Voucher */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100 !p-0 !m-0 list-none">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateCartQuantity={updateCartQuantity}
                    openDeleteItemModal={openDeleteItemModal}
                  />
                ))}
              </ul>
            </div>

            <CartCoupon
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              handleApplyVoucher={handleApplyVoucher}
              handleRemoveVoucher={handleRemoveVoucher}
              appliedVoucher={appliedVoucher}
              isApplying={isApplying}
              voucherError={voucherError}
              setVoucherError={setVoucherError}
            />
          </section>

          {/* Cột phải: Summary */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <CartSummary
              subtotal={subtotal}
              totalSavings={totalSavings}
              shipping={shipping}
              total={total}
              discountAmount={discountAmount}
              appliedVoucher={appliedVoucher}
              onCheckout={() => setShowPaymentModal(true)}
            />
          </section>
        </div>

        {/* Global Modals */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={
            confirmModal.type === "delete-item"
              ? "Xóa sản phẩm?"
              : "Xóa toàn bộ giỏ hàng?"
          }
          message={
            confirmModal.type === "delete-item"
              ? "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
              : `Bạn có chắc chắn muốn xóa tất cả ${cartItems.length} sản phẩm khỏi giỏ hàng?`
          }
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={total}
          onSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  );
};

export default Payment;
