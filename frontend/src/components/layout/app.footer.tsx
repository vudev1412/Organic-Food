import "./index.scss";
import logo from "../../assets/png/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
const AppFooter = () => {
  return (
    <footer className="bg-green-900 text-white py-10">
      <div className="container-footer grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Organic Store</h2>
          <p className="text-sm text-gray-200">
            Cửa hàng cung cấp rau củ quả và sản phẩm hữu cơ sạch, tốt cho sức
            khỏe, bảo vệ môi trường và cộng đồng.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 p-0">
            <li>
              <a href="#" className="hover:text-yellow-400">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Cửa hàng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 p-0">
            <li>
              <a href="#" className="hover:text-yellow-400">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Chính sách vận chuyển
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Điều khoản & Dịch vụ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm">Hóc Môn, Hồ Chí Minh</p>
          <p className="text-sm">0123 456 789</p>
          <p className="text-sm">organicstore@hotro.com</p>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-yellow-400">
              <FontAwesomeIcon icon={faFacebook} style={{ fontSize: 30 }} />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FontAwesomeIcon icon={faInstagram} style={{ fontSize: 30 }} />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FontAwesomeIcon icon={faXTwitter} style={{ fontSize: 30 }} />
            </a>
          </div>
        </div>
      </div>

      <div className=" pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Organic Store. All rights reserved.
      </div>
    </footer>
  );
};

export default AppFooter;
