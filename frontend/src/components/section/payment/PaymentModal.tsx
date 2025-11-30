// File path: /src/components/section/payment/PaymentModal.tsx

import { useState, useEffect, useRef } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import { PaymentAPI, placeOrderAPI } from "../../../service/api";

// Import các component con
import PaymentForm from "./PaymentForm";
import PaymentQrScan from "./PaymentQrScan";
import PaymentSuccess from "./PaymentSuccess";
import { formatOrderCode } from "../../../utils/format";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // [CẬP NHẬT] onSuccess nhận vào orderId để điều hướng
  onSuccess: (orderId: number) => void;

  subtotal: number;
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  voucherId?: number | null;
  initialBuyerInfo?: {
    name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  cartItems: any[];
  note?: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  subtotal,
  totalAmount,
  shippingFee,
  taxAmount,
  discountAmount,
  voucherId,
  onSuccess,
  initialBuyerInfo,
  cartItems,
  note,
}: PaymentModalProps) => {
  // Logic State
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);

  // [MỚI] State để lưu Order ID phục vụ cho việc polling
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const intervalRef = useRef<any>(null);

  // Reset state khi đóng/mở
  useEffect(() => {
    if (isOpen) {
      setIsPaid(false);
      setPaymentData(null);
      setCreatedOrderId(null); // Reset ID
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isOpen]);

  // --- LOGIC GỌI API ĐẶT HÀNG ---
  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        subtotal,
        totalPrice: totalAmount,
        shippingFee,
        taxAmount,
        discountAmount,
        voucherId: voucherId || null,
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const resOrder = await placeOrderAPI(payload);

      if (resOrder.data && resOrder.data.data) {
        const orderData = resOrder.data.data;

        // [MỚI] Lưu Order ID lại ngay lập tức
        setCreatedOrderId(orderData.id);

        if (orderData.paymentMethod === "COD") {
          // COD -> Thành công ngay
          setIsPaid(true);
          // [CẬP NHẬT] Truyền ID vào hàm success
          setTimeout(() => onSuccess(orderData.id), 1500);
        } else {
          // BANK -> Lấy QR
          await handleGetQrCode(orderData.id, orderData.totalPrice, formData);
        }
      }
    } catch (error: any) {
      console.error("Lỗi đặt hàng:", error);
      const msg = error.response?.data?.message || "Đặt hàng thất bại.";
      message.error(msg);
    } finally {
      if (formData.paymentMethod === "COD") setLoading(false);
    }
  };

  // --- LOGIC LẤY QR ---
  const handleGetQrCode = async (
    orderId: number,
    amount: number,
    formData: any
  ) => {
    try {
      const resPayment = await PaymentAPI.createPayment({
        orderId,
        amount,
        description: `Thanh toan don${formatOrderCode(orderId)}`,
        buyerName: formData.receiverName,
        buyerPhone: formData.receiverPhone,
      });

      if (resPayment && resPayment.data) {
        setPaymentData(resPayment.data);
      }
    } catch (error) {
      message.error("Lỗi tạo mã QR.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC POLLING ---
  useEffect(() => {
    if (paymentData && !isPaid && isOpen) {
      const checkStatus = async () => {
        try {
          const code = paymentData.orderCode;
          if (!code) return;
          const res = await PaymentAPI.checkStatus(code);
          if (res.data?.status === "SUCCESS" || res.data?.status === "PAID") {
            setIsPaid(true);
            clearInterval(intervalRef.current);

            // [CẬP NHẬT] Truyền createdOrderId vào hàm success
            setTimeout(() => {
              if (createdOrderId) onSuccess(createdOrderId);
            }, 1500);
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      };
      intervalRef.current = setInterval(checkStatus, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paymentData, isPaid, isOpen, createdOrderId]); // Thêm createdOrderId vào dependency

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2"
        >
          <CloseOutlined className="text-xl" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            {isPaid
              ? "Hoàn tất đơn hàng"
              : paymentData
              ? "Thanh toán VietQR"
              : "Xác nhận thanh toán"}
          </h2>

          {/* ĐIỀU HƯỚNG MÀN HÌNH */}
          {isPaid ? (
            <PaymentSuccess isBankTransfer={!!paymentData} />
          ) : paymentData ? (
            <PaymentQrScan
              paymentData={paymentData}
              onCancel={() => setPaymentData(null)}
            />
          ) : (
            <PaymentForm
              initialBuyerInfo={initialBuyerInfo}
              note={note}
              totalAmount={totalAmount}
              loading={loading}
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
