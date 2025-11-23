import React from "react";
import { Link } from "react-router-dom";
// import logo from "../../assets/png/logo.png"; // Đảm bảo đường dẫn logo đúng
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
// import "./index.scss";

const AppFooter = () => {
  return (
    <footer className="bg-green-950 text-white mt-20 rounded-t-[3rem] relative pt-7 pb-1 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-4">
          {/* COT 1: THÔNG TIN CHUNG */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {/* Nếu có logo thì dùng, không thì dùng text */}
              {/* <img src={logo} alt="Organic Store" className="h-12 w-auto brightness-0 invert" /> */}
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Organic Food
              </h2>
            </div>
            <p className="text-green-100/80 text-sm leading-relaxed text-justify">
              Chúng tôi cam kết mang đến nguồn thực phẩm hữu cơ sạch, đạt chuẩn
              quốc tế. Sức khỏe của bạn và sự bền vững của môi trường là ưu tiên
              hàng đầu của chúng tôi.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="!text-green-200 hover:!text-white hover:scale-110 transition-all duration-300"
              >
                <FacebookFilled className="text-3xl" />
              </a>
              <a
                href="#"
                className="!text-green-200 hover:!text-white hover:scale-110 transition-all duration-300"
              >
                <InstagramFilled className="text-3xl" />
              </a>
              <a
                href="#"
                className="!text-green-200 hover:!text-white hover:scale-110 transition-all duration-300"
              >
                <TwitterSquareFilled className="text-3xl" />
              </a>
            </div>
          </div>

          {/* COT 2: LIÊN KẾT NHANH */}
          <div>
            {/* Đã xóa 'inline-block' và 'pr-12' để border dài hết chiều rộng cột */}
            <h3 className="text-lg font-bold mb-6 text-white border-b border-green-800 pb-2">
              Khám phá
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/gioi-thieu"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/chung-chi"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Chứng chỉ chất lượng
                </Link>
              </li>
            </ul>
          </div>

          {/* COT 3: HỖ TRỢ KHÁCH HÀNG */}
          <div>
            {/* Đã xóa 'inline-block' và 'pr-12' để border dài hết chiều rộng cột */}
            <h3 className="text-lg font-bold mb-6 text-white border-b border-green-800 pb-2">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="!text-green-100/70 hover:!text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* COT 4: LIÊN HỆ */}
          <div>
            {/* Đã xóa 'inline-block' và 'pr-12' để border dài hết chiều rộng cột */}
            <h3 className="text-lg font-bold mb-6 text-white border-b border-green-800 pb-2">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <EnvironmentOutlined className="text-xl text-green-400 mt-1" />
                <span className="text-green-100/80 text-sm">
                  123 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneOutlined className="text-xl text-green-400" />
                <span className="text-green-100/80 text-sm font-semibold">
                  +84 800 456 478
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MailOutlined className="text-xl text-green-400" />
                <span className="!text-green-100/80 text-sm hover:!text-white transition-colors cursor-pointer">
                  organicfood@hotro.com
                </span>
              </li>
            </ul>

            {/* Newsletter Mini Form */}
            <div className="mt-6">
              <p className="text-xs text-green-200 mb-2">
                Đăng ký nhận tin khuyến mãi:
              </p>
              <div className="flex bg-green-900/50 rounded-lg p-1 border border-green-800 focus-within:border-green-500 transition-colors">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="bg-transparent w-full px-3 py-1 text-sm text-white placeholder-green-700 focus:outline-none"
                />
                <button className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-md transition-colors">
                  <SendOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-green-900 pt-2 text-center">
          <p className="text-green-100/40 text-sm">
            © {new Date().getFullYear()} Organic Food. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
