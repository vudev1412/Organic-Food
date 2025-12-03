// File path: /src/pages/auth/signin.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  ArrowLeft,
  Loader2,
  Leaf,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import { loginAPI } from "../../service/api";
import { useCurrentApp } from "../../components/context/app.context";

import fb from "../../assets/png/facebook.png";
import gg from "../../assets/png/google.png";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
];

const SignIn = () => {
  const navigate = useNavigate();
  const { showToast, setIsAuthenticated, setUser } = useCurrentApp();

  // --- STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // State lỗi hiển thị tại Input
  const [usernameError, setUsernameError] = useState("");

  // --- EMAIL VALIDATE FUNCTION ---
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  // Slider Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- VALIDATION HELPER ---
  const validateInput = (input: string) => {
    if (!input) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  // --- HANDLERS ---

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanVal = val.replace(/\s/g, ""); // Xóa khoảng trắng

    setUsername(cleanVal);
    if (usernameError) setUsernameError("");
  };

  const handleUsernameBlur = () => {
    if (username && !validateInput(username)) {
      setUsernameError("Email hoặc SĐT không đúng định dạng");
    }
  };

  // --- SUBMIT HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate
    if (!username.trim() || !password) {
      showToast("Vui lòng nhập tài khoản và mật khẩu", "error");
      return;
    }


    if (!validateInput(username)) {
      setUsernameError("Email hoặc SĐT không đúng định dạng");
      return;
    }

    // 2. Chuẩn hóa dữ liệu trước khi gửi API
    // Nếu là SĐT bắt đầu bằng +84 -> đổi thành 0
    let submitUsername = username;
    if (submitUsername.startsWith("+84")) {
      submitUsername = "0" + submitUsername.slice(3);
    }

    setLoading(true);
    try {
      // Truyền submitUsername (đã chuẩn hóa) vào API
      const res = await loginAPI(submitUsername, password);

    // Nếu nhập dạng email → phải đúng định dạng
    if (username.includes("@") && !isValidEmail(username)) {
      showToast("Email không hợp lệ", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI(username, password);


      if (res?.data) {
        setIsAuthenticated(true);
        setUser(res.data.data.userLogin);
        localStorage.setItem("access_token", res.data.data.access_token);
        showToast("Đăng nhập tài khoản thành công", "success");
        navigate("/");
      } else {
        const errorMsg =
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message;
        showToast(errorMsg || "Xảy ra lỗi", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };

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
                Chào Mừng <br /> Quay Lại!
              </h2>
              <p className="text-gray-300 text-xs leading-relaxed max-w-xs">
                Đăng nhập để tiếp tục mua sắm những sản phẩm tươi ngon nhất.
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

        {/* RIGHT SIDE: FORM */}
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

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h1>
            <p className="text-gray-500 text-sm">
              Nhập thông tin tài khoản của bạn.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <InputGroup
              icon={<User />}
              type="text"
              placeholder="Email hoặc số điện thoại (+84...)"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              error={usernameError}
            />

            <div>
              <InputGroup
                icon={<Lock />}
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                isPassword={true}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />

              <div className="flex justify-end mt-2">
                <Link
                  to="/quen-mat-khau"
                  className="text-xs font-medium text-[#3A5B22] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3A5B22] hover:bg-[#2f4a1c] text-white py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  Đăng nhập <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">
                Hoặc đăng nhập với
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                <img src={gg} alt="Google" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                <img src={fb} alt="Facebook" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>
          </div>


          <div className="mt-8 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/dang-ky"
              className="font-bold text-[#3A5B22] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


const InputGroup = ({
  icon,
  isPassword,
  showPassword,
  togglePassword,
  error,
  ...props
}: any) => {
  return (
    <div className="group relative">
      <div
        className={`absolute top-2.5 left-3.5 transition-colors duration-200 ${
          error
            ? "text-red-500"
            : "text-gray-400 group-focus-within:text-[#3A5B22]"
        }`}
      >
        {React.cloneElement(icon, { size: 18 })}
      </div>

      <input
        {...props}
        className={`w-full pl-10 ${
          isPassword ? "pr-12" : "pr-4"
        } py-2.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium text-sm
          ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
              : "border-gray-200 focus:bg-white focus:border-[#3A5B22] focus:ring-4 focus:ring-[#3A5B22]/10"
          }
        `}
      />

      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-2.5 right-3 text-gray-400 hover:text-[#3A5B22] p-1 cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {error && (
        <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-[11px] text-red-500 font-medium animate-fade-in">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SignIn;
 