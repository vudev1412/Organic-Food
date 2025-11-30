import { CheckCircleFilled } from "@ant-design/icons";

const PaymentSuccess = ({ isBankTransfer }: { isBankTransfer: boolean }) => {
  return (
    <div className="text-center py-8 animate-bounce-in">
      <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {isBankTransfer ? "Thanh toán thành công!" : "Đặt hàng thành công!"}
      </h3>
      <p className="text-gray-500 text-sm">
        Đơn hàng của bạn đã được xác nhận. <br /> Đang chuyển hướng...
      </p>
    </div>
  );
};

export default PaymentSuccess;
