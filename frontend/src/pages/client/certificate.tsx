import "./index.scss";
import cer01 from "../../assets/png/vietgap.png";
import usda from "../../assets/png/usda.png";
import eu from "../../assets/png/eu.png";

const Certificate = () => {
  const certificates = [
    {
      id: 1,
      img: cer01,
      title: "VietGAP",
      subtitle: "Tiêu chuẩn Thực hành Nông nghiệp Tốt Việt Nam",
      desc: "VietGAP là một trong các chứng nhận hữu cơ phổ biến ở Việt Nam, do Bộ Nông nghiệp và PTNT ban hành. Tiêu chuẩn này tập trung vào quy trình sản xuất an toàn từ chọn giống, đất trồng đến thu hoạch, hạn chế tối đa thuốc trừ sâu và đảm bảo an toàn lao động.",
      reverse: false,
    },
    {
      id: 2,
      img: usda,
      title: "USDA Organic",
      subtitle: "Chứng nhận hữu cơ Bộ Nông nghiệp Hoa Kỳ",
      desc: "USDA Organic là tiêu chuẩn nghiêm ngặt bậc nhất thế giới. Sản phẩm phải được sản xuất mà không dùng phân bón hóa học, thuốc trừ sâu tổng hợp, hay GMO. Quy trình kiểm tra bao gồm từ nguồn nước, đất trồng cho đến khâu đóng gói cuối cùng.",
      reverse: true,
    },
    {
      id: 3,
      img: eu,
      title: "EU Organic",
      subtitle: "Tiêu chuẩn hữu cơ Liên minh Châu Âu",
      desc: "Tương tự USDA nhưng được thiết kế cho thị trường Châu Âu. Sản phẩm đạt EU Organic phải tuân thủ quy định canh tác bền vững, tôn trọng đa dạng sinh học, không sử dụng hóa chất độc hại và đảm bảo phúc lợi động vật.",
      reverse: false,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-green-50 py-16 md:py-24 overflow-hidden">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-16 text-center">
        <span className="text-green-600 font-bold tracking-wider uppercase text-sm bg-green-100 px-4 py-1 rounded-full">
          Cam kết chất lượng
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
          Chứng Chỉ & Tiêu Chuẩn
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Chúng tôi tự hào mang đến những sản phẩm đạt tiêu chuẩn quốc tế, đảm
          bảo an toàn tuyệt đối cho sức khỏe gia đình bạn.
        </p>
      </div>

      {/* Certificates List */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl flex flex-col gap-20">
        {certificates.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col ${
              item.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-8 md:gap-16 group`}
          >
            {/* Image Side - ĐÃ SỬA LẠI */}
            <div className="w-full md:w-1/2 relative">
              {/* Decorative blob background */}
              <div
                className={`absolute -inset-4 bg-green-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  item.reverse ? "right-0" : "left-0"
                }`}
              ></div>

              {/* Container chính của ảnh: Thêm bg-white, flex center và chiều cao cố định ở đây */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-white bg-white h-[350px] md:h-[450px] flex items-center justify-center p-4">
                <img
                  src={item.img}
                  alt={item.title}
                  // Thay object-cover bằng object-contain. Bỏ h cứng ở thẻ img
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Đã loại bỏ lớp Overlay gradient tối màu ở đây để tránh làm tối phần nền trắng */}
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-green-50 relative z-10 md:-my-10 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="text-xl font-bold">✓</span>
                  </div>
                  <span className="text-green-600 font-semibold uppercase tracking-wide text-xs">
                    Chứng nhận quốc tế
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-green-700 font-medium mb-6 italic">
                  {item.subtitle}
                </p>

                <p className="text-gray-600 leading-relaxed text-justify mb-6">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certificate;
