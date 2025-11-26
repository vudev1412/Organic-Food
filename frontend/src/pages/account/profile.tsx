// File path: /src/pages/account/profile.tsx

import { useEffect, useState } from "react";
import { useCurrentApp } from "../../components/context/app.context";

// --- 1. COMPONENT PASSWORD INPUT (Custom) ---
const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className={`absolute inset-y-0 right-3 flex items-center ${
            disabled ? "text-gray-300" : "text-gray-400 hover:text-green-600"
          }`}
        >
          {show ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

// --- 2. MODAL XÁC THỰC MẬT KHẨU ---
const VerifyPasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    // Reset và gửi password ra ngoài để xử lý
    onConfirm(password);
    setPassword("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Xác thực bảo mật
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Vui lòng nhập mật khẩu hiện tại để mở khóa tính năng chỉnh sửa thông
            tin.
          </p>

          <PasswordInput
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(val) => {
              setPassword(val);
              setError("");
            }}
            disabled={false}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const Profile = () => {
  const { user, showToast } = useCurrentApp();

  // --- States Dữ liệu ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState(""); // Chỉ dùng khi Edit

  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // --- States UI Control ---
  const [isEditing, setIsEditing] = useState(false); // Trạng thái: false = Locked, true = Unlocked
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false); // Modal xác thực

  // Sync Data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatar(user.image || null);
      setCreatedAt(user.createdAt || new Date().toISOString());
      setUpdatedAt(user.updatedAt || new Date().toISOString());
    }
  }, [user]);

  // --- Actions ---

  // 1. Mở Modal xác thực
  const handleRequestEdit = () => {
    setIsVerifyModalOpen(true);
  };

  // 2. Xử lý xác thực (Gọi API kiểm tra pass)
  const handleVerifySuccess = async (passwordInput: string) => {
    try {
      // GIẢ LẬP GỌI API VERIFY PASSWORD
      // const res = await verifyPasswordAPI(passwordInput);
      const isPasswordCorrect = passwordInput === "123456"; // Demo: pass là 123456

      if (isPasswordCorrect) {
        setIsVerifyModalOpen(false);
        setIsEditing(true); // Mở khóa form
        showToast("Xác thực thành công! Bạn có thể chỉnh sửa.", "success");
      } else {
        showToast("Mật khẩu không chính xác!", "error");
      }
    } catch (error) {
      showToast("Lỗi xác thực, vui lòng thử lại", "error");
    }
  };

  // 3. Hủy chỉnh sửa (Revert)
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPassword(""); // Reset mật khẩu mới
    // Reset lại data từ user gốc nếu muốn (optional)
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  };

  // 4. Lưu thay đổi
  const handleSaveChanges = () => {
    // Validate
    if (!name.trim()) return showToast("Tên không được để trống", "error");

    // Payload
    const payload = {
      name,
      phone,
      // Chỉ gửi password nếu người dùng có nhập mới
      ...(newPassword ? { password: newPassword } : {}),
    };

    console.log("Saving payload:", payload);
    // await updateUserAPI(payload);

    showToast("Cập nhật hồ sơ thành công!", "success");
    setIsEditing(false); // Khóa lại form
    setNewPassword("");
    setUpdatedAt(new Date().toISOString());
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast("Dung lượng file tối đa là 1MB!", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Banner trạng thái Locked/Unlocked */}
        {isEditing && (
          <div className="bg-green-100 text-green-800 text-xs font-bold text-center py-1 absolute top-0 w-full z-10">
            CHẾ ĐỘ CHỈNH SỬA ĐANG BẬT
          </div>
        )}

        {/* Header */}
        <div
          className={`px-6 py-5 border-b border-gray-100 flex justify-between items-center ${
            isEditing ? "bg-green-50 mt-4" : "bg-gray-50"
          }`}
        >
          <div>
            <h5 className="text-xl font-bold text-gray-800">Hồ sơ của tôi</h5>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin hồ sơ & bảo mật
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleRequestEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition-all shadow-sm font-medium text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Mở khóa chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200 text-sm font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
            {/* --- CỘT TRÁI: FORM --- */}
            <div className="flex-1 space-y-6">
              {/* Tên hiển thị */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Tên hiển thị
                </label>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full max-w-md px-4 py-2 border rounded-lg transition-all ${
                      !isEditing
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 focus:ring-2 focus:ring-green-500"
                    }`}
                  />
                </div>
              </div>

              {/* Email (Luôn Readonly - thường email là định danh không cho sửa dễ dàng) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Email
                </label>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={email}
                    disabled={true} // Email thường không cho sửa hoặc cần quy trình riêng
                    className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-400 mt-1">
                      Email không thể thay đổi.
                    </p>
                  )}
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Số điện thoại
                </label>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={phone}
                    disabled={!isEditing}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full max-w-md px-4 py-2 border rounded-lg transition-all ${
                      !isEditing
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 focus:ring-2 focus:ring-green-500"
                    }`}
                  />
                </div>
              </div>

              {/* MẬT KHẨU */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start pt-2">
                <label className="text-sm font-medium text-gray-600 md:text-right mt-2">
                  Mật khẩu
                </label>
                <div className="md:col-span-3 max-w-md">
                  {!isEditing ? (
                    <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 flex justify-between items-center cursor-not-allowed">
                      <span className="text-lg tracking-widest pt-1">
                        ••••••••
                      </span>
                      <span className="text-xs text-gray-400 italic">
                        Đã khóa
                      </span>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <PasswordInput
                        label=""
                        placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
                        value={newPassword}
                        onChange={setNewPassword}
                        disabled={false}
                      />
                      <p className="text-xs text-gray-500 mt-[-10px]">
                        Để trống nếu bạn không muốn đổi mật khẩu.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Meta Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Ngày tham gia</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatDate(createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cập nhật lần cuối</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatDate(updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: AVATAR --- */}
            <div
              className={`flex flex-col items-center justify-start md:w-72 md:border-l md:border-gray-100 md:pl-12 transition-opacity duration-300 ${
                !isEditing
                  ? "opacity-70 grayscale-[0.5] pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 shadow-sm bg-gray-100">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-white shadow-sm text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 10.05a4 4 0 00-.885 1.343z" />
                    </svg>
                  </div>
                )}
              </div>

              <label
                className={`mt-5 cursor-pointer ${
                  !isEditing ? "cursor-not-allowed" : ""
                }`}
              >
                <span
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    !isEditing
                      ? "bg-gray-100 text-gray-400 border-gray-200"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isEditing ? "Chọn Ảnh Mới" : "Ảnh đại diện"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL XÁC THỰC */}
      <VerifyPasswordModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onConfirm={handleVerifySuccess}
      />
    </>
  );
};

export default Profile;
