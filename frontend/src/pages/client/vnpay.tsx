import React, { useState } from "react";
import axios from "axios";

const VnpayPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/payment/vn-pay",
        { withCredentials: true }
      );

      const paymentUrl = response.data?.data?.data.paymentUrl;
      console.log(paymentUrl)
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không lấy được link thanh toán!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi gọi API VNPay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center gap-5">
        <h1 className="text-2xl font-bold text-blue-600">Thanh toán VNPay</h1>
        <p className="text-gray-700">Nhấn nút để tiến hành thanh toán</p>

        <button
          onClick={handlePay}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-gray-400"
        >
          {loading ? "Đang xử lý..." : "Thanh toán ngay"}
        </button>
      </div>
    </div>
  );
};

export default VnpayPage;
