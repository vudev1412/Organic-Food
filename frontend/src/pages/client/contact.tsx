import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
} from "@ant-design/icons";

const Contact = () => {
  return (
    <div className="min-h-screen bg-green-50/50">
      {/* HERO SECTION / HEADER */}
      <div className="text-center pt-16 pb-15 px-4">
        <span className="text-green-600 font-bold tracking-wider uppercase text-sm bg-green-100 px-4 py-1 rounded-full">
          Hỗ trợ 24/7
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Chúng tôi luôn lắng nghe bạn. Hãy để lại tin nhắn về sản phẩm, đơn
          hàng hoặc bất kỳ thắc mắc nào về thực phẩm hữu cơ.
        </p>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 md:px-8 mb-20">
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
          {/* LEFT SIDE - CONTACT INFO (Green Panel) */}
          <div className="lg:w-5/12 bg-green-800 text-white p-10 md:p-14 relative overflow-hidden flex flex-col justify-between">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-green-700 opacity-50 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-green-600 opacity-30 blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Thông tin liên hệ</h3>
              <p className="text-green-100 mb-10 text-sm">
                Hãy ghé thăm cửa hàng hoặc liên hệ trực tiếp qua các kênh dưới
                đây.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-700/50 flex items-center justify-center flex-shrink-0">
                    <EnvironmentOutlined className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-300 uppercase tracking-wider mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-base font-medium leading-relaxed">
                      123 Đinh Tiên Hoàng, Phường Đa Kao,
                      <br /> Quận 1, TP. Hồ Chí Minh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-700/50 flex items-center justify-center flex-shrink-0">
                    <MailOutlined className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-300 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-base font-medium">
                      organicfood@hotro.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-700/50 flex items-center justify-center flex-shrink-0">
                    <PhoneOutlined className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-300 uppercase tracking-wider mb-1">
                      Điện thoại
                    </p>
                    <p className="text-base font-medium">+84 800 456 478</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="relative z-10 mt-12">
              <p className="text-sm font-medium mb-4 text-green-200">
                Kết nối với chúng tôi:
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-green-600 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
                >
                  <FacebookFilled />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-green-600 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
                >
                  <InstagramFilled />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-green-600 flex items-center justify-center hover:bg-white hover:text-green-800 transition-all duration-300"
                >
                  <YoutubeFilled />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="lg:w-7/12 p-10 md:p-14 bg-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Gửi tin nhắn
              </h3>
              <p className="text-gray-500 text-sm">
                Bạn có câu hỏi về sản phẩm? Điền vào form bên dưới nhé.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề
                </label>
                <input
                  type="text"
                  placeholder="VD: Tư vấn sản phẩm..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tin nhắn
                </label>
                <textarea
                  placeholder="Nhập nội dung cần hỗ trợ..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-10 py-4 shadow-lg shadow-green-200 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <SendOutlined />
                Gửi ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="w-full h-[450px] relative  transition-all duration-500">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424226884765!2d106.69591631474893!3d10.779338992319445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x1787491df6ed8d9a!2zMTIzIMSQaW5oIFRpw6puIEhvw6BuZywgxJBhIEthbywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1646123456789!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
        {/* Overlay label map (Optional) */}
        <div className="absolute top-5 right-5 bg-white p-4 rounded-xl shadow-lg hidden md:block">
          <p className="font-bold text-gray-800">Organic Food Quận 1</p>
          <p className="text-xs text-gray-500">Mở cửa: 08:00 - 22:00</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
