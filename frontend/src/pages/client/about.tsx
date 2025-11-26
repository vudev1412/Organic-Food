// File path: /src/pages/client/about.tsx

import { Link } from "react-router-dom";
import {
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

// Import hình ảnh của bạn
import about from "../../assets/jpg/aboutus.jpg";
import about01 from "../../assets/jpg/aboutus01.jpg";
import about02 from "../../assets/jpg/aboutus02.jpg";

const AboutPage = () => {
  return (
    <div className="bg-white pb-20">
      {/* ================= 1. HERO BANNER SECTION ================= */}
      <div className="relative w-full h-[400px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed-bg"
          style={{ backgroundImage: `url(${about})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>{" "}
          {/* Lớp phủ đen mờ */}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h3 className="text-green-400 font-bold tracking-widest uppercase mb-2">
            Khám phá
          </h3>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Câu Chuyện Của Chúng Tôi
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-light text-gray-200">
            Hành trình mang thực phẩm sạch từ nông trại đến bàn ăn của gia đình
            Việt.
          </p>
        </div>
      </div>

      {/* ================= 2. WHO WE ARE ================= */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-16 md:mt-24">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side - Với hiệu ứng khung viền */}
          <div className="md:w-1/2 relative group">
            <div className="absolute -inset-4 border-2 border-green-200 rounded-2xl translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <img
              src={about01}
              alt="Who We Are"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl transform transition duration-500 hover:scale-[1.02]"
            />
            {/* Badge nổi */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg hidden md:block">
              <p className="text-green-800 font-bold text-2xl">100%</p>
              <p className="text-gray-600 text-sm">Organic Certified</p>
            </div>
          </div>

          {/* Text Side */}
          <div className="md:w-1/2">
            <span className="text-green-600 font-bold text-sm uppercase tracking-wider mb-2 block">
              Về Organic Food
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Chúng tôi là ai? <br />
              <span className="text-green-600">Sứ mệnh vì sức khỏe</span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
              Organic food được thành lập với sứ mệnh mang đến cho mọi gia đình
              Việt những thực phẩm
              <span className="font-semibold text-green-700">
                {" "}
                Sạch – An toàn – Bền vững
              </span>
              . Chúng tôi tin rằng sức khỏe bắt đầu từ những bữa ăn hằng ngày.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Canh tác theo tiêu chuẩn quốc tế (USDA, EU Organic).",
                "Không thuốc trừ sâu, không chất bảo quản.",
                "Quy trình kiểm soát nghiêm ngặt từ nông trại.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircleFilled className="text-green-500 mt-1 text-xl" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/chung-chi"
              className="inline-block px-8 py-3 !bg-green-600 text-white font-semibold rounded-full hover:!bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Xem chứng chỉ
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 3. CORE VALUES (NEW SECTION) ================= */}
      <div className="bg-green-50 py-16 my-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-gray-600">
              Chúng tôi cam kết mang lại những giá trị tốt nhất cho cộng đồng và
              môi trường.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <SafetyCertificateOutlined className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Chất Lượng Hàng Đầu
              </h3>
              <p className="text-gray-600 text-sm">
                Cam kết nguồn gốc xuất xứ rõ ràng, đạt chuẩn VietGAP và Organic
                quốc tế.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <EnvironmentOutlined className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Thân Thiện Môi Trường
              </h3>
              <p className="text-gray-600 text-sm">
                Quy trình canh tác bền vững, bảo vệ đất đai và hệ sinh thái tự
                nhiên.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <HeartOutlined className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Tận Tâm Phục Vụ
              </h3>
              <p className="text-gray-600 text-sm">
                Đội ngũ nhân viên nhiệt huyết, luôn sẵn sàng hỗ trợ khách hàng
                24/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. WHAT WE DO ================= */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <div className="md:w-1/2 relative">
            <div className="overflow-hidden rounded-tl-[50px] rounded-br-[50px] shadow-2xl">
              <img
                src={about02}
                alt="What We Do"
                className="w-full h-[400px] md:h-[500px] object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="md:w-1/2">
            <span className="text-green-600 font-bold text-sm uppercase tracking-wider mb-2 block">
              Hoạt động của chúng tôi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Chúng tôi làm gì?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
              Chúng tôi cung cấp đa dạng các sản phẩm hữu cơ được nuôi trồng tại
              trang trại riêng biệt. Tất cả đều được thu hoạch{" "}
              <span className="italic text-green-700">tươi mới mỗi ngày</span>,
              giàu vitamin và khoáng chất.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
              Không chỉ bán thực phẩm, Organic Food còn nỗ lực lan tỏa lối sống
              xanh, giúp bảo vệ hành tinh thông qua việc sử dụng bao bì phân hủy
              sinh học và hạn chế rác thải nhựa.
            </p>

            <Link
              to="/lien-he"
              className="inline-block border-b-2 border-green-600 text-green-600 font-bold hover:text-green-800 pb-1 transition-colors"
            >
              Liên hệ hợp tác &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
