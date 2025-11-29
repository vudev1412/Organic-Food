// File: /src/components/section/payment/AddressSection.tsx

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  CheckCircleFilled,
  PlusOutlined,
  CloseOutlined, // Thêm CloseOutlined để đóng Modal
} from "@ant-design/icons";
import { getAddressesByUserIdAPI } from "../../../service/api"; // Đảm bảo đường dẫn import đúng

interface IAddressSectionProps {
  user: IUser;
  onSelectAddress: (address: ICustomerAddress | null) => void;
}

// ----------------------------------------------------
// Cấu hình Màu Sắc Chủ Đạo
// ----------------------------------------------------
const PRIMARY_COLOR = "green-600"; // Màu xanh lá chủ đạo
const LIGHT_BG_COLOR = "green-50"; // Màu nền nhẹ
const BORDER_COLOR = "green-200"; // Màu viền nhẹ

const AddressSection = ({ user, onSelectAddress }: IAddressSectionProps) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<ICustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<ICustomerAddress | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // 1. Fetch API
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user && user.id) {
        try {
          const res = await getAddressesByUserIdAPI(user.id);
          if (res.data && res.data.data) {
            const listAddress: ICustomerAddress[] = res.data.data;
            setAddresses(listAddress);

            // Logic tự động chọn Default
            const defaultAddr = listAddress.find((addr) => addr.defaultAddress);
            const initialAddr = defaultAddr || listAddress[0] || null;

            setSelectedAddress(initialAddr);
            onSelectAddress(initialAddr); // Báo ngược lại cho Payment cha biết
          }
        } catch (error) {
          console.error("Lỗi lấy danh sách địa chỉ:", error);
        }
      }
    };
    fetchAddresses();
    // Bỏ onSelectAddress ra khỏi dependencies nếu nó không thay đổi
  }, [user]);

  // 2. Helper hiển thị text
  const fullAddressStr = useMemo(() => {
    if (!selectedAddress) return "";
    return `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`;
  }, [selectedAddress]);

  // 3. Xử lý khi chọn trong Modal
  const handleSelectInModal = (addr: ICustomerAddress) => {
    setSelectedAddress(addr);
    onSelectAddress(addr);
    setShowAddressModal(false);
  };

  return (
    <>
      {/* ===== UI HIỂN THỊ TRÊN TRANG THANH TOÁN ===== */}
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <EnvironmentOutlined className={`text-${PRIMARY_COLOR}`} />
            Địa chỉ nhận hàng
          </h3>
          {addresses.length > 0 && (
            <button
              onClick={() => setShowAddressModal(true)}
              className={`text-sm font-semibold text-${PRIMARY_COLOR} hover:text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all`}
            >
              Thay đổi
            </button>
          )}
        </div>

        {selectedAddress ? (
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:items-center bg-${LIGHT_BG_COLOR} p-4 rounded-xl border-2 border-${BORDER_COLOR}`}
          >
            <div className="flex-grow min-w-0">
              <div className="font-bold text-gray-900 flex items-center gap-3">
                <span>{selectedAddress.receiverName}</span>
                <span className="text-gray-400 font-normal">|</span>
                <span className="text-sm font-normal text-gray-700">
                  {selectedAddress.phone}
                </span>
                {selectedAddress.defaultAddress && (
                  <span
                    className={`shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300`}
                  >
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1 truncate">
                {fullAddressStr}
              </p>
              {selectedAddress.note && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Ghi chú: "{selectedAddress.note}"
                </p>
              )}
            </div>
            {/* Checkmark nhỏ ở góc nếu cần */}
            {/* <CheckCircleFilled className={`text-${PRIMARY_COLOR} text-xl shrink-0`} /> */}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
            <button
              onClick={() => navigate("/tai-khoan/dia-chi")}
              className={`inline-flex items-center gap-2 px-6 py-2 bg-${PRIMARY_COLOR} rounded-lg text-sm font-medium text-white shadow-md hover:bg-green-700 transition-all`}
            >
              <PlusOutlined /> Thêm địa chỉ mới
            </button>
          </div>
        )}
      </div>

      {/* --- */}

      {/* ===== MODAL CHỌN ĐỊA CHỈ ===== */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
              onClick={() => setShowAddressModal(false)}
            ></div>

            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {/* Header Modal */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  Chọn địa chỉ giao hàng
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAddressModal(false)}
                >
                  <CloseOutlined className="text-xl" />
                </button>
              </div>

              {/* Body Modal - Danh sách địa chỉ */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectInModal(addr)}
                      className={`cursor-pointer group relative rounded-xl p-4 border-2 transition-all duration-200 ${
                        selectedAddress?.id === addr.id
                          ? `border-${PRIMARY_COLOR} bg-${LIGHT_BG_COLOR} ring-2 ring-${BORDER_COLOR}`
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="pr-8 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 truncate">
                              {addr.receiverName}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600 font-medium shrink-0">
                              {addr.phone}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-snug">
                            {addr.street}, {addr.ward}, {addr.district},{" "}
                            {addr.province}
                          </p>
                          {addr.defaultAddress && (
                            <span className="mt-2 inline-block text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 pt-1">
                          {selectedAddress?.id === addr.id ? (
                            <CheckCircleFilled
                              className={`text-${PRIMARY_COLOR} text-xl`}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-400"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Nút Thêm địa chỉ mới trong Modal */}
                  <button
                    onClick={() => navigate("/tai-khoan/dia-chi")}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-${PRIMARY_COLOR} transition-all`}
                  >
                    <PlusOutlined /> Thêm địa chỉ mới
                  </button>
                </div>
              </div>

              {/* Footer Modal - Hành động */}
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => navigate("/tai-khoan/dia-chi")}
                  className={`inline-flex w-full justify-center rounded-lg bg-${PRIMARY_COLOR} px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-all sm:w-auto`}
                >
                  Quản lý địa chỉ
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                  onClick={() => setShowAddressModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSection;
