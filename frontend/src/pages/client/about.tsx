import about from "../assets/jpg/aboutus.jpg";
import about01 from "../../assets/jpg/aboutus01.jpg";
import about02 from "../../assets/jpg/aboutus02.jpg";
import "./index.scss";
const AboutPage = () => {
  return (
    <>
      <div className="mb-[40px]">
        <div className="about-section">
          <div className="">
            <h3>Về chúng tôi</h3>
          </div>
        </div>
        <div className="mt-16 mx-[200px]">
          {/* Who We Are */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="md:w-1/2">
              <img
                src={about01}
                alt="Who We Are"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 inline-block">
                Chúng tôi là ai
              </h2>
              <p className="leading-relaxed text-justify">
                Organic food được thành lập với sứ mệnh mang đến cho mọi gia
                đình Việt những thực phẩm sạch – an toàn – bền vững từ thiên
                nhiên. Chúng tôi tin rằng sức khỏe bắt đầu từ những bữa ăn hằng
                ngày. Vì vậy, toàn bộ sản phẩm của GreenLeaf đều được canh tác
                theo tiêu chuẩn hữu cơ quốc tế (USDA, EU Organic, VietGAP
                Organic) — không sử dụng thuốc trừ sâu, phân bón hóa học hay
                chất bảo quản nhân tạo. Với đội ngũ nông dân tâm huyết và quy
                trình kiểm soát nghiêm ngặt, chúng tôi đảm bảo mỗi sản phẩm khi
                đến tay bạn đều giữ trọn dinh dưỡng, hương vị tự nhiên và an
                toàn tuyệt đối cho sức khỏe.
              </p>
            </div>
          </div>
          {/* What We Do */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10">
            <div className="md:w-1/2">
              <img
                src={about02}
                alt="What We Do"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 inline-block">
                Chúng tôi làm gì
              </h2>
              <p className="leading-relaxed text-justify">
                Chúng tôi cung cấp đa dạng các sản phẩm hữu cơ được nuôi trồng
                tại trang trại của mình. Tất cả đều được thu hoạch tươi mới mỗi
                ngày, giàu vitamin và khoáng chất, mang đến những bữa ăn ngon
                lành và bổ dưỡng cho gia đình bạn. Với quy trình sản xuất thân
                thiện môi trường, Organic food không chỉ cung cấp thực phẩm sạch mà
                còn góp phần bảo vệ hành tinh xanh của chúng ta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
