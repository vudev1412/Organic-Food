import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Leaf,
  ChevronRight,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

// Import API đã định nghĩa trong api.ts
import { 
  sendForgotPasswordOtpAPI, 
  resetPasswordAPI 
} from "../../service/api"; // Hãy sửa đường dẫn đúng với project của bạn

// Import Context Toast (giả định bạn đang dùng)
import { useCurrentApp } from "../../components/context/app.context";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useCurrentApp();

  // --- STATE QUẢN LÝ ---
  const [currentStep, setCurrentStep] = useState(0); // 0: Email, 1: OTP, 2: New Password
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  
  // Dữ liệu Form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Ẩn/Hiện mật khẩu
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Hiệu ứng Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Đếm ngược OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // --- HANDLERS ---

  // BƯỚC 1: GỬI EMAIL YÊU CẦU OTP
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Vui lòng nhập email.", "error");
      return;
    }

    setLoading(true);
    try {
      // Gọi API gửi OTP
      const res = await sendForgotPasswordOtpAPI(email);
      
      // Backend trả về text 200 OK -> Axios return data
      if (res) {
        showToast("Mã OTP đã được gửi đến email.", "success");
        setCurrentStep(1); // Chuyển sang bước nhập OTP
        setCountdown(60);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng kiểm tra lại email.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: XÁC THỰC OTP (Ở Client chỉ check độ dài, Server check sau)
  const handleVerifyOtpStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast("Vui lòng nhập đủ 6 số OTP.", "error");
      return;
    }
    // Chuyển sang bước đặt mật khẩu
    setCurrentStep(2); 
  };

  // BƯỚC 3: ĐẶT LẠI MẬT KHẨU (Gửi Email + OTP + Pass lên Server)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setLoading(true);
    try {
      // Gọi API Reset Password
      const res = await resetPasswordAPI({
        email,
        otp,
        newPassword
      });

      if (res) {
        showToast("Đổi mật khẩu thành công! Vui lòng đăng nhập.", "success");
        navigate("/dang-nhap"); // Điều hướng về trang login
      }
    } catch (error: any) {
      // Lỗi từ GlobalException (InvalidOtpException, v.v.)
      const msg = error.response?.data?.message || "Đặt lại mật khẩu thất bại.";
      showToast(msg, "error");
      
      // Nếu lỗi OTP sai, có thể cho user quay lại bước nhập OTP
      if (msg.includes("OTP")) {
          // Tùy chọn: setCurrentStep(1); 
      }
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await sendForgotPasswordOtpAPI(email);
      showToast("Đã gửi lại mã OTP.", "info");
      setCountdown(60);
    } catch (error) {
      showToast("Không thể gửi lại mã.", "error");
    }
  };

  // --- RENDER ---
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
              <img src={img} alt="OrganicFood" className="w-full h-full object-cover scale-105" />
            </div>
          ))}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white z-10">
             <div className="mb-4 animate-fade-in-up">
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-[#5fab3e] p-2 rounded-xl"><Leaf className="text-white" size={20} /></div>
                 <span className="text-xl font-bold tracking-wide">OrganicFood</span>
               </div>
               <h2 className="text-3xl font-extrabold mb-2 leading-tight">Khôi Phục <br /> Tài Khoản</h2>
               <p className="text-gray-300 text-xs leading-relaxed max-w-xs">Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu ngay thôi.</p>
             </div>
             
             {/* Slider dots */}
             <div className="flex gap-2">
              {SLIDER_IMAGES.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === sliderIndex ? "w-8 bg-[#5fab3e]" : "w-2 bg-white/30"}`} />
              ))}
            </div>
           </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="w-full md:w-[55%] p-6 md:p-8 relative flex flex-col justify-center">
          
          {/* HEADER */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
            <p className="text-gray-500 text-sm">
              {currentStep === 0 && "Nhập email của bạn để nhận mã xác thực."}
              {currentStep === 1 && `Nhập mã 6 số đã gửi tới ${email}`}
              {currentStep === 2 && "Tạo mật khẩu mới cho tài khoản của bạn."}
            </p>
          </div>

          {/* === STEP 1: NHẬP EMAIL === */}
          {currentStep === 0 && (
            <form onSubmit={handleSendEmail} className="space-y-4 animate-fade-in">
              <InputGroup
                icon={<Mail />}
                type="email"
                placeholder="Địa chỉ Email đã đăng ký"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} /> Vui lòng chờ...
                    </>
                ) : (
                    <>Tiếp tục <ChevronRight size={20} /></>
                )}
              </button>
            </form>
          )}

          {/* === STEP 2: NHẬP OTP === */}
          {currentStep === 1 && (
            <div className="animate-fade-in-up">
              <form onSubmit={handleVerifyOtpStep} className="flex flex-col items-center">
                 <div className="relative w-full mb-6 group">
                    {/* Input ẩn để hứng sự kiện gõ phím */}
                    <input
                      type="text" 
                      value={otp} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val) && val.length <= 6) setOtp(val);
                      }}
                      maxLength={6} 
                      autoFocus
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10" 
                      autoComplete="one-time-code"
                    />
                    {/* Giao diện 6 ô số */}
                    <div className="flex justify-between items-center gap-2 md:gap-3 w-full">
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const isActive = idx === otp.length;
                        return (
                          <div key={idx} className={`h-12 w-10 md:h-14 md:w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${isActive ? "border-[#3A5B22] bg-green-50 shadow-md scale-110" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                            {otp[idx] || ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                
                <button type="submit" className="w-full bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]">
                  Xác nhận mã <CheckCircle size={20} />
                </button>
              </form>

              <div className="mt-6 text-center">
                 <button 
                    onClick={handleResendOtp} 
                    disabled={countdown > 0} 
                    className={`text-sm font-bold ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#3A5B22] hover:underline"}`}
                 >
                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
                 </button>
              </div>
              
              <div className="mt-4 text-center">
                 <button onClick={() => setCurrentStep(0)} className="text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 w-full">
                    <ArrowLeft size={14} /> Nhập lại email
                 </button>
              </div>
            </div>
          )}

          {/* === STEP 3: MẬT KHẨU MỚI === */}
          {currentStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              <InputGroup
                icon={<Lock />}
                type={showPass ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                isPassword={true}
                showPassword={showPass}
                togglePassword={() => setShowPass(!showPass)}
              />
              <InputGroup
                icon={<ShieldCheck />}
                type={showConfirmPass ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                isPassword={true}
                showPassword={showConfirmPass}
                togglePassword={() => setShowConfirmPass(!showConfirmPass)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                   <>
                     <Loader2 className="animate-spin" size={20} />
                     <span>Đang cập nhật...</span>
                   </>
                ) : (
                   <>Đổi mật khẩu <KeyRound size={20} /></>
                )}
              </button>
            </form>
          )}

          {/* FOOTER LINK */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link to="/dang-nhap" className="text-sm text-gray-500 hover:text-[#3A5B22] font-semibold flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft size={16} /> Quay lại đăng nhập
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

// Component InputGroup tái sử dụng (Hỗ trợ icon mắt)
const InputGroup = ({ icon, isPassword, showPassword, togglePassword, ...props }: any) => {
  return (
    <div className="group relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400 group-focus-within:text-[#3A5B22] transition-colors">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input
        {...props}
        required
        className={`w-full pl-10 ${isPassword ? "pr-12" : "pr-4"} py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3A5B22] focus:ring-4 focus:ring-[#3A5B22]/10 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium text-sm`}
      />
      {isPassword && (
        <button type="button" onClick={togglePassword} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-[#3A5B22] p-1 cursor-pointer">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default ForgotPassword;