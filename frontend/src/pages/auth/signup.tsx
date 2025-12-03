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

  // 1. STATE DỮ LIỆU FORM
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ STATE LƯU LỖI (VALIDATION)
  const [errors, setErrors] = useState({
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
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setCurrentStep(1);
      setCountdown(60);
      showToast("Vui lòng nhập mã OTP để hoàn tất đăng ký", "info");
    }
  }, []);

  // --- VALIDATION HELPERS ---
  const validateField = (name: string, value: string) => {
    let errorMsg = "";

    switch (name) {
      case "email":
        // Regex email cơ bản
        if (!value) errorMsg = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errorMsg = "Email không đúng định dạng (VD: example@mail.com)";
        break;

      case "phone":
        if (!value) errorMsg = "Số điện thoại không được để trống";
        else {
          // Chuẩn hóa tạm thời để check regex (nếu có +84 thì đổi về 0 để check)
          let checkPhone = value.trim();
          if (checkPhone.startsWith("+84")) {
            checkPhone = "0" + checkPhone.slice(3);
          }
          // Regex VN: Bắt đầu 03, 05, 07, 08, 09 + 8 số
          const vnf_regex = /^(0)(3|5|7|8|9)([0-9]{8})$/;
          if (!vnf_regex.test(checkPhone)) {
            errorMsg = "SĐT không hợp lệ (VD: 0912345678 hoặc +849...)";
          }
        }
        break;

      case "password":
        if (!value) errorMsg = "Mật khẩu không được để trống";
        else if (value.length < 6)
          errorMsg = "Mật khẩu phải có ít nhất 6 ký tự";
        break;

      case "confirmPassword":
        if (!value) errorMsg = "Vui lòng xác nhận mật khẩu";
        else if (value !== formData.password)
          errorMsg = "Mật khẩu xác nhận không khớp";
        break;

      case "name":
        if (!value.trim()) errorMsg = "Họ tên không được để trống";
        break;

      default:
        break;
    }
    return errorMsg;
  };

  // --- HANDLERS ---

  // 2. HÀM XỬ LÝ KHI NHẬP INPUT
  // Logic: Cập nhật value ngay lập tức.
  // CHỈ Validate nếu trường đó ĐANG CÓ LỖI (để clear lỗi khi người dùng sửa đúng).
  // Nếu chưa có lỗi, không validate ngay (để tránh báo đỏ khi đang gõ dở).
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Nếu trường này đang bị báo lỗi -> check ngay để xóa lỗi nếu đã nhập đúng
    if (errors[name as keyof typeof errors]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }

    // Xử lý riêng cho confirmPassword khi password thay đổi
    if (name === "password" && formData.confirmPassword) {
      // Chỉ cập nhật lỗi confirmPassword nếu nó đang hiển thị lỗi
      if (errors.confirmPassword) {
        const confirmError =
          value !== formData.confirmPassword
            ? "Mật khẩu xác nhận không khớp"
            : "";
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      }
    }
  };

  // ✅ MỚI: HÀM XỬ LÝ KHI BLUR (RỜI KHỎI Ô INPUT)
  // Khi người dùng nhập xong và click ra ngoài -> Lúc này mới kiểm tra lỗi và báo đỏ
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // 3. XỬ LÝ SUBMIT ĐĂNG KÝ
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate toàn bộ form trước khi submit
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);

    // Nếu có bất kỳ lỗi nào (string khác rỗng) -> Chặn submit
    if (Object.values(newErrors).some((err) => err !== "")) {
      showToast("Vui lòng kiểm tra lại thông tin nhập liệu!", "error");
      return;
    }

    setLoading(true);

    // Chuẩn bị payload
    const { confirmPassword, phone, ...rest } = formData;

    // ✅ XỬ LÝ SỐ ĐIỆN THOẠI TRƯỚC KHI GỬI
    // Nếu bắt đầu bằng +84 -> đổi thành 0
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("+84")) {
      formattedPhone = "0" + formattedPhone.slice(3);
    }

    const payload = {
      ...rest,
      phone: formattedPhone,
    };

    try {
      const res: any = await registerUserAPI(payload);

      if (res && (res.statusCode === 201 || res.status === 201)) {
        showToast("Vui lòng kiểm tra email để lấy mã OTP.", "success");

        setCurrentStep(1);
        setCountdown(60);

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

  const handleEditInfo = () => {
    setCurrentStep(0);
    sessionStorage.removeItem("pendingStep");
  };

  // Xử lý Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      showToast("Vui lòng nhập đủ 6 số OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const res: any = await verifyOtpAPI({
        email: formData.email,
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
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await resendOtpAPI(formData.email);
      showToast("Đã gửi lại mã OTP.", "info");
      setCountdown(60);
    } catch (error) {
      showToast("Không thể gửi lại OTP.", "error");
    } finally {
      setIsResending(false);
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
        {/* LEFT SIDE: SLIDER */}
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
          <div className="md:hidden flex items-center justify-between mb-6">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2 text-[#3A5B22] font-bold text-lg">
              <Leaf size={20} /> OrganicFood
            </div>
            <div className="w-5"></div>
          </div>

          {/* STEPPER */}
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
            {/* STEP 1: FORM */}
            {currentStep === 0 && (
              <form
                onSubmit={handleRegisterSubmit}
                className="space-y-3 animate-fade-in"
                noValidate // Tắt validate mặc định của trình duyệt để dùng custom UI
              >
                <div className="grid grid-cols-1 gap-3">
                  <InputGroup
                    icon={<User />}
                    name="name"
                    placeholder="Họ và tên đầy đủ"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // ✅ Thêm onBlur
                    error={errors.name}
                  />
                  <InputGroup
                    icon={<Mail />}
                    name="email"
                    placeholder="Địa chỉ Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // ✅ Thêm onBlur
                    error={errors.email}
                  />
                  <InputGroup
                    icon={<Phone />}
                    name="phone"
                    placeholder="Số điện thoại"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // ✅ Thêm onBlur
                    error={errors.phone}
                  />
                  <InputGroup
                    icon={<Lock />}
                    name="password"
                    placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // ✅ Thêm onBlur
                    error={errors.password}
                    isPassword={true}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                  />
                  <InputGroup
                    icon={<ShieldCheck />}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // ✅ Thêm onBlur
                    error={errors.confirmPassword}
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
                      disabled={countdown > 0 || isResending}
                      className={`font-bold ${
                        countdown > 0 || isResending
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#3A5B22] hover:underline cursor-pointer"
                      }`}
                    >
                      {isResending
                        ? "Đang gửi..."
                        : countdown > 0
                        ? `Gửi lại sau ${countdown}s`
                        : "Gửi lại"}
                    </button>
                  </p>

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

// ✅ UPDATE: InputGroup nhận thêm prop `error`
const InputGroup = ({
  icon,
  error,
  isPassword,
  showPassword,
  togglePassword,
  ...props
}: any) => {
  return (
    <div className="mb-1">
      <div className="group relative">
        <div
          className={`absolute top-1/2 -translate-y-1/2 left-3.5 transition-colors duration-200 ${
            error
              ? "text-red-500"
              : "text-gray-400 group-focus-within:text-[#3A5B22]"
          }`}
        >
          {React.cloneElement(icon, { size: 18 })}
        </div>

        <input
          {...props}
          className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm ${
            error
              ? "border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 focus:bg-white focus:border-[#3A5B22] focus:ring-4 focus:ring-[#3A5B22]/10"
          }`}
        />

        {/* Nút Toggle Password */}
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ✅ Hiển thị lỗi gợi ý bên dưới */}
      {error && (
        <p className="text-red-500 text-[11px] font-medium mt-1 ml-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default SignUp;
