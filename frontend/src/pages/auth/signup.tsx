// File path: /src/pages/auth/signup.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Leaf,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

import { registerUserAPI, verifyOtpAPI, resendOtpAPI } from "../../service/api";
import { useCurrentApp } from "../../components/context/app.context";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
];

const SignUp = () => {
  const navigate = useNavigate();
  const { showToast } = useCurrentApp();

  // --- STATE LOGIC ---
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  // ✅ 1. THÊM STATE ĐỂ LƯU DỮ LIỆU FORM (Controlled Component)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Slider Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Countdown OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Khôi phục trạng thái khi F5
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingEmail");
    const savedStep = sessionStorage.getItem("pendingStep");

    if (savedEmail && savedStep === "1") {
      // Nếu F5, ta chỉ khôi phục Email để verify, data form có thể bị mất (chấp nhận được)
      // Hoặc bạn cần update formData.email = savedEmail
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setCurrentStep(1);
      setCountdown(60);
      showToast("Vui lòng nhập mã OTP để hoàn tất đăng ký", "info");
    }
  }, []);

  // --- HANDLERS ---

  // ✅ 2. HÀM XỬ LÝ KHI NHẬP INPUT
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 3. XỬ LÝ SUBMIT ĐĂNG KÝ (Tạo mới hoặc Cập nhật)
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // KIỂM TRA MẬT KHẨU XÁC NHẬN
    if (formData.password !== formData.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "error");
      setLoading(false);
      return;
    }

    // Loại bỏ confirmPassword trước khi gửi API (nếu API không cần)
    const { confirmPassword, ...payload } = formData;
    // Backend mới của bạn đã tự xử lý logic:
    // - Nếu email mới -> Tạo mới
    // - Nếu email cũ chưa verify -> Cập nhật thông tin đè lên
    // - Nếu email cũ đã verify -> Trả lỗi 400

    try {
      const res: any = await registerUserAPI(payload);

      if (res && (res.statusCode === 201 || res.status === 201)) {
        showToast("Vui lòng kiểm tra email để lấy mã OTP.", "success");

        setCurrentStep(1);
        setCountdown(60);

        // Lưu Session chống F5
        sessionStorage.setItem("pendingEmail", formData.email);
        sessionStorage.setItem("pendingStep", "1");
      } else {
        showToast(res.error || "Đăng ký thất bại.", "error");
      }
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error.message || "Lỗi kết nối server",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. NÚT "QUAY LẠI CHỈNH SỬA"
  const handleEditInfo = () => {
    // Chỉ lùi bước, GIỮ NGUYÊN data trong formData
    setCurrentStep(0);

    // Xóa session pendingStep để nếu F5 lúc này thì nó ở lại trang form (Step 0)
    sessionStorage.removeItem("pendingStep");
    // (Optional) Có thể xóa pendingEmail hoặc giữ lại tùy ý
  };

  // Xử lý Verify OTP (Giữ nguyên logic cũ, chỉ sửa biến email tham chiếu)
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      showToast("Vui lòng nhập đủ 6 số OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const res: any = await verifyOtpAPI({
        email: formData.email, // Dùng email từ state formData
        otp: otpValue,
      });

      if (res && (res.statusCode === 200 || res.status === 200)) {
        showToast("Xác thực tài khoản thành công!", "success");
        sessionStorage.removeItem("pendingEmail");
        sessionStorage.removeItem("pendingStep");
        navigate("/dang-nhap");
      } else {
        showToast(res.error || "Mã OTP không đúng hoặc đã hết hạn.", "error");
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Lỗi xác thực", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Nếu đang đếm ngược HOẶC đang trong quá trình gửi thì chặn luôn
    if (countdown > 0 || isResending) return;

    setIsResending(true); // 🔒 Bắt đầu gửi -> Khóa nút, hiện loading

    try {
      await resendOtpAPI(formData.email);
      showToast("Đã gửi lại mã OTP.", "info");
      setCountdown(60);
    } catch (error) {
      showToast("Không thể gửi lại OTP.", "error");
    } finally {
      setIsResending(false); // 🔓 Kết thúc gửi -> Mở khóa (nhưng lúc này countdown đã chạy nên vẫn khóa theo countdown)
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) setOtpValue(val);
  };

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans relative">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] transition-all duration-300">
        {/* LEFT SIDE: SLIDER (Giữ nguyên) */}
        <div className="hidden md:block md:w-[45%] relative overflow-hidden bg-gray-900">
          {SLIDER_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === sliderIndex ? "opacity-90" : "opacity-0"
              }`}
            >
              <img
                src={img}
                alt="OrganicFood"
                className="w-full h-full object-cover scale-105"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white z-10">
            <div className="mb-4 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#5fab3e] p-2 rounded-xl">
                  <Leaf className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold tracking-wide">
                  OrganicFood
                </span>
              </div>
              <h2 className="text-3xl font-extrabold mb-2 leading-tight">
                Tươi Ngon <br /> Từ Nông Trại
              </h2>
              <p className="text-gray-300 text-xs leading-relaxed max-w-xs">
                Trải nghiệm mua sắm thực phẩm sạch, an toàn và tiện lợi.
              </p>
            </div>
            <div className="flex gap-2">
              {SLIDER_IMAGES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === sliderIndex ? "w-8 bg-[#5fab3e]" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="w-full md:w-[55%] p-6 md:p-8 relative flex flex-col justify-center">
          {/* Mobile Back & Brand */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2 text-[#3A5B22] font-bold text-lg">
              <Leaf size={20} /> OrganicFood
            </div>
            <div className="w-5"></div>
          </div>

          {/* STEPPER (Giữ nguyên UI) */}
          <div className="mb-6">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
              {/* Step 1 Icon */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep >= 0
                      ? "border-[#3A5B22] bg-[#3A5B22] text-white"
                      : "border-gray-300"
                  }`}
                >
                  <User size={14} />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    currentStep >= 0 ? "text-[#3A5B22]" : "text-gray-400"
                  }`}
                >
                  Tài khoản
                </span>
              </div>
              {/* Step 2 Icon */}
              <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep >= 1
                      ? "border-[#3A5B22] bg-[#3A5B22] text-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <ShieldCheck size={14} />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    currentStep >= 1 ? "text-[#3A5B22]" : "text-gray-400"
                  }`}
                >
                  Xác thực
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {currentStep === 0 ? "Bắt đầu hành trình" : "Nhập mã xác thực"}
            </h1>
            <p className="text-gray-500 text-sm">
              {currentStep === 0 ? (
                "Tạo tài khoản để nhận ưu đãi thành viên mới."
              ) : (
                <span>
                  Mã xác thực đã gửi đến{" "}
                  <b className="text-gray-900">{formData.email}</b>
                </span>
              )}
            </p>
          </div>

          <div className="flex-1">
            {/* STEP 1: FORM (ĐÃ CẬP NHẬT CONTROLLED INPUT) */}
            {currentStep === 0 && (
              <form
                onSubmit={handleRegisterSubmit}
                className="space-y-3 animate-fade-in"
              >
                <div className="grid grid-cols-1 gap-3">
                  <InputGroup
                    icon={<User />}
                    name="name"
                    placeholder="Họ và tên đầy đủ"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange} // ✅ Binding State
                  />
                  <InputGroup
                    icon={<Mail />}
                    name="email"
                    placeholder="Địa chỉ Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange} // ✅ Binding State
                  />
                  <InputGroup
                    icon={<Phone />}
                    name="phone"
                    placeholder="Số điện thoại"
                    type="tel"
                    pattern="[0-9]{10,11}"
                    value={formData.phone}
                    onChange={handleInputChange} // ✅ Binding State
                  />
                  <InputGroup
                    icon={<Lock />}
                    name="password"
                    placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange} // ✅ Binding State
                    isPassword={true}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                  />
                  {/* ✅ INPUT XÁC NHẬN MẬT KHẨU (Thêm mới) */}
                  <InputGroup
                    icon={<ShieldCheck />}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    type={showConfirmPassword ? "text" : "password"} // Toggle type
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    // Props cho nút mắt
                    isPassword={true}
                    showPassword={showConfirmPassword}
                    togglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Vui lòng chờ chút...</span>
                    </>
                  ) : (
                    <>
                      Tiếp tục <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {currentStep === 1 && (
              <div className="animate-fade-in-up">
                <form
                  onSubmit={handleOtpSubmit}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-full mb-6 group">
                    <input
                      type="text"
                      name="otp"
                      value={otpValue}
                      onChange={handleOtpChange}
                      maxLength={6}
                      autoFocus
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
                      autoComplete="one-time-code"
                    />
                    <div className="flex justify-between items-center gap-2 md:gap-3 w-full">
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const isActive = idx === otpValue.length;
                        const hasValue = idx < otpValue.length;
                        return (
                          <div
                            key={idx}
                            className={`h-12 w-10 md:h-14 md:w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                              isActive
                                ? "border-[#3A5B22] bg-green-50 shadow-md scale-110"
                                : ""
                            } ${
                              hasValue
                                ? "border-[#3A5B22] bg-white text-[#3A5B22]"
                                : "border-gray-200 bg-gray-50 text-gray-400"
                            }`}
                          >
                            {otpValue[idx] || ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Xác nhận <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center space-y-4">
                  <p className="text-gray-600 text-sm">
                    Bạn không nhận được mã?{" "}
                    <button
                      onClick={handleResendOtp}
                      // ✅ Disable khi đang đếm ngược HOẶC đang gửi
                      disabled={countdown > 0 || isResending}
                      className={`font-bold ${
                        countdown > 0 || isResending
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#3A5B22] hover:underline cursor-pointer"
                      }`}
                    >
                      {/* ✅ Logic hiển thị chữ */}
                      {isResending
                        ? "Đang gửi..."
                        : countdown > 0
                        ? `Gửi lại sau ${countdown}s`
                        : "Gửi lại"}
                    </button>
                  </p>

                  {/* ✅ NÚT QUAY LẠI ĐÃ ĐƯỢC CHỈNH SỬA */}
                  <button
                    onClick={handleEditInfo}
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 w-full transition-colors group"
                  >
                    <ArrowLeft
                      size={14}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Quay lại chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentStep === 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                Đã có tài khoản?{" "}
                <Link
                  to="/dang-nhap"
                  className="text-[#3A5B22] font-bold hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// InputGroup Component (Updated to accept value & onChange)
const InputGroup = ({ icon, ...props }: any) => {
  return (
    <div className="group relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400 group-focus-within:text-[#3A5B22] transition-colors duration-200">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input
        {...props}
        required
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3A5B22] focus:ring-4 focus:ring-[#3A5B22]/10 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm"
      />
    </div>
  );
};

export default SignUp;
