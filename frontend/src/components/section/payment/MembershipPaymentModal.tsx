import { useState, useEffect, useRef } from "react";
import { Modal, message } from "antd";
import { PaymentAPI } from "../../../service/api"; 
import PaymentQrScan from "./PaymentQrScan"; 
import PaymentSuccess from "./PaymentSuccess"; 

interface MembershipPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any; // Dữ liệu từ API createMembershipPayment trả về
}

const MembershipPaymentModal = ({
  isOpen,
  onClose,
  paymentData,
}: MembershipPaymentModalProps) => {
  const [isPaid, setIsPaid] = useState(false);
  const intervalRef = useRef<any>(null);

  // Reset state khi mở lại modal
  useEffect(() => {
    if (isOpen) {
      setIsPaid(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isOpen]);

  // --- LOGIC POLLING (Hỏi server liên tục) ---
  useEffect(() => {
    if (paymentData && !isPaid && isOpen) {
      const checkStatus = async () => {
        try {
          const code = paymentData.orderCode; // Lấy orderCode (chính là paymentId)
          if (!code) return;

          // Gọi API check status cũ của bạn
          const res = await PaymentAPI.checkStatus(code);

          if (res.data?.status === "SUCCESS" || res.data?.status === "PAID") {
            setIsPaid(true);
            clearInterval(intervalRef.current);
            message.success("Nâng cấp thành viên thành công!");

            // Chuyển hướng sau 2 giây
            setTimeout(() => {
              window.location.href = "/membership-success";
            }, 2000);
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      };

      // Hỏi mỗi 2 giây
      intervalRef.current = setInterval(checkStatus, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paymentData, isPaid, isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={500}
      title={
        <div className="text-center font-bold text-lg text-green-700">
          {isPaid ? "Nâng cấp thành công" : "Thanh toán Gói Hội Viên"}
        </div>
      }
    >
      <div className="pt-4">
        {isPaid ? (
          <PaymentSuccess isBankTransfer={true} />
        ) : (
          <PaymentQrScan
            paymentData={paymentData} // Truyền data QR vào đây
            onCancel={onClose}
          />
        )}
      </div>
    </Modal>
  );
};

export default MembershipPaymentModal;
