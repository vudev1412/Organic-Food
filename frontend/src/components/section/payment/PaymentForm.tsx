import React, { useEffect, useState } from "react";
import {
  BankOutlined,
  WalletOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../../../utils/format";
import { message } from "antd";

type PaymentMethodType = "COD" | "BANK_TRANSFER";

interface PaymentFormProps {
  initialBuyerInfo?: {
    name: string;
    phone: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  note?: string;
  totalAmount: number;
  loading: boolean;
  onSubmit: (data: any) => void;
}

const PaymentForm = ({
  initialBuyerInfo,
  note,
  totalAmount,
  loading,
  onSubmit,
}: PaymentFormProps) => {
  // --- STATE ---
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("BANK_TRANSFER");

  // Address State
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  // Location Data
  const [locations, setLocations] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  // 1. Fetch Location Data
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Lỗi tải địa chỉ:", err));
  }, []);

  // 2. Fill Data từ Props
  useEffect(() => {
    if (initialBuyerInfo) {
      setBuyerName(initialBuyerInfo.name || "");
      setBuyerPhone(initialBuyerInfo.phone || "");
      setProvince(initialBuyerInfo.province || "");
      setDistrict(initialBuyerInfo.district || "");
      setWard(initialBuyerInfo.ward || "");
      setStreet(initialBuyerInfo.street || "");
    }
    setOrderNote(note || "");
  }, [initialBuyerInfo, note]);

  // 3. Sync Districts/Wards khi có dữ liệu locations và initial value
  useEffect(() => {
    if (locations.length > 0 && province) {
      const foundCity = locations.find((c) => c.Name === province);
      const listDistricts = foundCity?.Districts || [];
      setDistricts(listDistricts);

      if (district) {
        const foundDist = listDistricts.find((d) => d.Name === district);
        const listWards = foundDist?.Wards || [];
        setWards(listWards);
      }
    }
  }, [locations, province, district]);

  // Handlers
  const handleCityChange = (value: string) => {
    setProvince(value);
    const foundCity = locations.find((item) => item.Name === value);
    setDistricts(foundCity?.Districts || []);
    setDistrict("");
    setWard("");
    setWards([]);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    const foundDist = districts.find((d) => d.Name === value);
    setWards(foundDist?.Wards || []);
    setWard("");
  };

  const handleSubmit = () => {
    if (
      !buyerName ||
      !buyerPhone ||
      !province ||
      !district ||
      !ward ||
      !street
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin và địa chỉ.");
      return;
    }

    const fullAddress = `${street}, ${ward}, ${district}, ${province}`;

    onSubmit({
      receiverName: buyerName,
      receiverPhone: buyerPhone,
      shipAddress: fullAddress, // Gửi chuỗi địa chỉ đã ghép
      note: orderNote,
      paymentMethod,
    });
  };

  return (
    <div className="space-y-5">
      {/* Thông tin cá nhân */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Địa chỉ hành chính */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
          <EnvironmentOutlined /> Địa chỉ nhận hàng
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white"
            value={province}
            onChange={(e) => handleCityChange(e.target.value)}
          >
            <option value="">Tỉnh/Thành</option>
            {locations.map((i) => (
              <option key={i.Id} value={i.Name}>
                {i.Name}
              </option>
            ))}
          </select>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white disabled:bg-gray-100"
            value={district}
            disabled={!province}
            onChange={(e) => handleDistrictChange(e.target.value)}
          >
            <option value="">Quận/Huyện</option>
            {districts.map((i) => (
              <option key={i.Id} value={i.Name}>
                {i.Name}
              </option>
            ))}
          </select>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white disabled:bg-gray-100"
            value={ward}
            disabled={!district}
            onChange={(e) => setWard(e.target.value)}
          >
            <option value="">Phường/Xã</option>
            {wards.map((i) => (
              <option key={i.Id} value={i.Name}>
                {i.Name}
              </option>
            ))}
          </select>
        </div>
        <input
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"
          placeholder="Số nhà, tên đường cụ thể..."
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <FileTextOutlined /> Ghi chú
        </label>
        <textarea
          rows={2}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none resize-none"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
      </div>

      {/* Phương thức thanh toán */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phương thức thanh toán
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setPaymentMethod("BANK_TRANSFER")}
            className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
              paymentMethod === "BANK_TRANSFER"
                ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                : "border-gray-200"
            }`}
          >
            <BankOutlined className="text-2xl" />
            <span className="text-sm font-semibold">Chuyển khoản</span>
          </div>
          <div
            onClick={() => setPaymentMethod("COD")}
            className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
              paymentMethod === "COD"
                ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                : "border-gray-200"
            }`}
          >
            <WalletOutlined className="text-2xl" />
            <span className="text-sm font-semibold">COD</span>
          </div>
        </div>
      </div>

      {/* Tổng tiền & Submit */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
        <span className="text-gray-600">Tổng thanh toán:</span>
        <span className="text-xl font-bold text-green-600">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 shadow-md"
      >
        {loading
          ? "Đang xử lý..."
          : paymentMethod === "BANK_TRANSFER"
          ? "Xác nhận & Lấy mã QR"
          : "Xác nhận đặt hàng"}
      </button>
    </div>
  );
};

export default PaymentForm;
    