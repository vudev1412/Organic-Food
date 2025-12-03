import { useEffect, useState } from "react";
import { useCurrentApp } from "../../components/context/app.context";
import { useNavigate } from "react-router-dom";
import { CrownOutlined } from "@ant-design/icons";
import {
  getUserByIdAPI,
  updateUserDTOAPI,
  uploadFileAvatarAPI,
} from "../../service/api";

// --- 1. COMPONENT PASSWORD INPUT ---
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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="new-password"
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
      </div>{" "}
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

          <input
            type="text"
            name="username"
            autoComplete="username"
            style={{ display: "none" }}
          />

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
          {error && <p className="text-red-500 text-sm mb-2 mt-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
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
      </div>{" "}
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const Profile = () => {
  const { user, showToast } = useCurrentApp();
  const navigate = useNavigate();

  const [id, setId] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userById, setUserById] = useState<IResUserById | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState<IResUserById | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // --- MỚI: State lỗi số điện thoại ---
  const [phoneError, setPhoneError] = useState("");

  const isMember = user?.customerProfile?.member === true;

  useEffect(() => {
    if (user) {
      setId(user.id || 0);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatar(user.image || null);
      setCreatedAt(user.createAt || null);
      setUpdatedAt(user.updateAt || null);
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      showToast("Dung lượng ảnh tối đa 1MB!", "warning");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Chỉ hỗ trợ định dạng: JPG, PNG, WebP!", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);

    try {
      showToast("Đang tải ảnh lên...", "info");
      const uploadedUrl = await uploadFileAvatarAPI(file, "images/avatar");
      setAvatar(uploadedUrl.data);
      showToast("Cập nhật ảnh đại diện thành công!", "success");
    } catch (error: any) {
      showToast(error.message || "Tải ảnh thất bại!", "error");
      if (user?.image) setAvatar(user.image);
    }
  };

  const handleRequestEdit = () => setIsVerifyModalOpen(true);

  const handleVerifySuccess = async (passwordInput: string) => {
    // TODO: Thay bằng API thật kiểm tra mật khẩu
    const isCorrect = passwordInput === "123456"; // Demo

    if (isCorrect) {
      setIsVerifyModalOpen(false);
      setIsEditing(true);
      showToast("Xác thực thành công! Bạn có thể chỉnh sửa.", "success");
    } else {
      showToast("Mật khẩu không chính xác!", "error");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPassword("");
    setPhoneError(""); // Reset lỗi khi hủy
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatar(user.image || null);
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      showToast("Tên không được để trống", "error");
      return;
    }

    if (!user?.id) {
      showToast("Không tìm thấy thông tin người dùng", "error");
      return;
    }

    // --- MỚI: Logic xử lý số điện thoại ---
    let formattedPhone = phone.trim();

    // 1. Chuyển đổi +84 thành 0
    if (formattedPhone.startsWith("+84")) {
      formattedPhone = "0" + formattedPhone.slice(3);
    }

    // 2. Validate Regex (Đầu số VN: 03, 05, 07, 08, 09 + 8 số đằng sau)
    // Regex này bắt buộc bắt đầu bằng 0, theo sau là 3|5|7|8|9, và chính xác 8 chữ số nữa (tổng 10 số)
    const vnf_regex = /^(0)(3|5|7|8|9)([0-9]{8})$/;

    if (formattedPhone && !vnf_regex.test(formattedPhone)) {
      setPhoneError("Số điện thoại không hợp lệ (VD: 0912345678)");
      showToast("Số điện thoại không đúng định dạng!", "error");
      return; // Dừng lại không lưu
    }
    // -------------------------------------

    setIsSaving(true);

    const payload: Partial<IReqUpdateUserDTO> = {
      name: name.trim(),
    };

    // Sử dụng số điện thoại đã được chuẩn hóa (formattedPhone)
    if (formattedPhone !== user.phone) payload.phone = formattedPhone;

    if (newPassword) payload.password = newPassword;

    if (avatar && typeof avatar === "string" && avatar !== user.image) {
      payload.image = avatar;
    }
    console.log(payload);

    try {
      await updateUserDTOAPI(user.id, payload as IReqUpdateUserDTO);

      showToast("Cập nhật hồ sơ thành công!", "success");
      setIsEditing(false);
      setNewPassword("");
      setPhoneError(""); // Xóa lỗi sau khi lưu thành công
      setUpdatedAt(new Date().toISOString());

      // Cập nhật lại state phone hiển thị bằng số đã chuẩn hóa
      setPhone(formattedPhone);
    } catch (error: any) {
      console.error("Update profile failed:", error);
      showToast(error.response?.data?.message || "Cập nhật thất bại!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const userID = user?.id;
  const handleNavigateToVip = () => {
    navigate("/dang-ky-thanh-vien");
  };

  useEffect(() => {
    if (!userID) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserByIdAPI(userID);

        if (res?.data?.statusCode === 200) {
          setUserData(res.data.data.data);
        } else {
          console.warn("Fetch thất bại:", res?.data?.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userID]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {isEditing && (
          <div className="bg-green-100 text-green-800 text-xs font-bold text-center py-1 absolute top-0 w-full z-10">
            CHẾ ĐỘ CHỈNH SỬA ĐANG BẬT
          </div>
        )}

        <div
          className={`px-6 py-5 border-b border-gray-100 flex justify-between items-center ${
            isEditing ? "bg-green-50 mt-4" : "bg-gray-50"
          }`}
        >
          <div>
            <h5 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              Hồ sơ của tôi
              {isMember && (
                <span className="inline-flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  <CrownOutlined /> VIP MEMBER
                </span>
              )}
            </h5>

            <p className="text-sm text-gray-500 mt-1">
              {isMember
                ? "Bạn đang sở hữu đặc quyền Hội viên VIP!"
                : "Quản lý thông tin hồ sơ & bảo mật"}
            </p>
          </div>
          {/* NÚT HÀNH ĐỘNG */}
          {!isEditing ? (
            <div className="flex gap-3">
              {!isMember && (
                <button
                  onClick={handleNavigateToVip}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all shadow-md font-medium text-sm"
                >
                  <CrownOutlined /> Nâng cấp VIP{" "}
                </button>
              )}
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
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium"
                disabled={isSaving}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 ${
                  isSaving
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 shadow-md"
                }`}
              >
                {isSaving && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
            {/* Form */}
            <div className="flex-1 space-y-6">
              {/* --- TÊN HIỂN THỊ --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Tên hiển thị
                </label>

                <div className="md:col-span-3">
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
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

              {/* --- EMAIL --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Email
                </label>

                <div className="md:col-span-3">
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    value={email}
                    disabled={true}
                    className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-400 mt-1">
                      Email không thể thay đổi.
                    </p>
                  )}
                </div>
              </div>

              {/* --- SĐT (Đã thêm xử lý lỗi) --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start md:items-center">
                <label className="text-sm font-medium text-gray-600 md:text-right mt-2 md:mt-0">
                  Số điện thoại
                </label>

                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={phone}
                    disabled={!isEditing}
                    placeholder="VD: 0912345678 hoặc +84912345678"
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(""); // Xóa lỗi khi người dùng nhập lại
                    }}
                    className={`w-full max-w-md px-4 py-2 border rounded-lg transition-all ${
                      !isEditing
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : `bg-white ${
                            phoneError
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-green-500"
                          } focus:ring-2`
                    }`}
                  />
                  {/* Hiển thị lỗi ngay dưới input */}
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* --- MẬT KHẨU --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pt-2">
                <label className="text-sm font-medium text-gray-600 md:text-right">
                  Mật khẩu
                </label>

                <div className="md:col-span-3 max-w-md">
                  {!isEditing ? (
                    <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 flex justify-between items-center cursor-not-allowed h-[42px]">
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
                        placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                        value={newPassword}
                        onChange={setNewPassword}
                        disabled={false}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Để trống nếu bạn không muốn đổi mật khẩu.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>
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

            {/* Avatar */}
            <div
              className={`flex flex-col items-center justify-start md:w-72 md:border-l md:border-gray-100 md:pl-12 transition-opacity duration-300 ${
                !isEditing
                  ? "opacity-70 grayscale-[0.5] pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="relative group">
                <div
                  className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                    isMember ? "border-yellow-400" : "border-green-50"
                  } shadow-sm bg-gray-100`}
                >
                  {user?.image ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_AVATAR_IMAGE_URL}${
                        user?.image
                      }`}
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
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <VerifyPasswordModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onConfirm={handleVerifySuccess}
      />{" "}
    </>
  );
};

export default Profile;
