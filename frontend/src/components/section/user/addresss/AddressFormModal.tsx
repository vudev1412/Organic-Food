// File path: /src/components/section/user/addresss/AddressFormModal.tsx

import React, { useEffect, useState } from "react";
import { X, CheckCircle, Edit3, Plus } from "lucide-react";
import { isValidVietnamPhone } from "../../../../utils/phone.helper";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IAddressPayload) => void;
  initialData?: IAddress | null; // Dữ liệu để edit (nếu có)
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // FORM STATES
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [note, setNote] = useState("");
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [error, setError] = useState("");

  // LOCATION DATA STATES
  const [locations, setLocations] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  // 1. Load Locations Data (Chỉ load 1 lần)
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((res) => res.json())
      .then((json) => setLocations(json));
  }, []);

  // 2. Fill Form Data khi mở modal (Create hoặc Edit)
  useEffect(() => {
    if (isOpen) {
      setError("");
      if (initialData) {
        // Mode: EDIT
        setReceiverName(initialData.receiverName);
        setPhone(initialData.phone);
        setStreet(initialData.street);
        setNote(initialData.note);
        setDefaultAddress(initialData.defaultAddress || false);

        // Logic điền địa chỉ hành chính phức tạp
        if (locations.length > 0) {
          setProvince(initialData.province);
          const foundCity = locations.find(
            (c) => c.Name === initialData.province
          );
          const listDistricts = foundCity?.Districts || [];
          setDistricts(listDistricts);

          setDistrict(initialData.district);
          const foundDist = listDistricts.find(
            (d) => d.Name === initialData.district
          );
          const listWards = foundDist?.Wards || [];
          setWards(listWards);

          setWard(initialData.ward);
        }
      } else {
        // Mode: CREATE -> Reset form
        setReceiverName("");
        setPhone("");
        setProvince("");
        setDistrict("");
        setWard("");
        setStreet("");
        setNote("");
        setDefaultAddress(false);
        setDistricts([]);
        setWards([]);
      }
    }
  }, [isOpen, initialData, locations]);

  // 3. Handle Select Changes
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

  // 4. Handle Submit
  const handleConfirm = () => {
    if (!receiverName || !phone || !province || !district || !ward || !street) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    if (!isValidVietnamPhone(phone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    const formData = {
      receiverName,
      phone,
      province,
      district,
      ward,
      street,
      note,
      defaultAddress,
    };
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-2xl p-0 rounded-xl shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              {initialData ? <Edit3 size={18} /> : <Plus size={18} />}
              {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-2">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Họ và tên
                </label>
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: Nguyễn Văn A"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Số điện thoại
                </label>
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Tỉnh/Thành
                </label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white"
                  value={province}
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {locations.map((item) => (
                    <option key={item.Name} value={item.Name}>
                      {item.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Quận/Huyện
                </label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white disabled:bg-gray-50"
                  value={district}
                  disabled={districts.length === 0}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {districts.map((item) => (
                    <option key={item.Name} value={item.Name}>
                      {item.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Phường/Xã
                </label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white disabled:bg-gray-50"
                  value={ward}
                  disabled={wards.length === 0}
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {wards.map((item) => (
                    <option key={item.Name} value={item.Name}>
                      {item.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">
                Địa chỉ cụ thể
              </label>
              <textarea
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                rows={2}
                placeholder="Số nhà, tên đường, toà nhà..."
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">
                Ghi chú (Tuỳ chọn)
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                placeholder="VD: Giao giờ hành chính..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="defaultAddressModal"
                type="checkbox"
                checked={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer accent-green-600"
              />
              <label
                htmlFor="defaultAddressModal"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-md shadow-green-200 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              {initialData ? "Lưu thay đổi" : "Hoàn tất"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
