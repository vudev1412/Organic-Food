import "./index.scss";
import cer01 from "../../assets/jpg/1707_chung-nhan-vietgap-la-gi.jpg";
import usda from "../../assets/png/usda.png";
import eu from "../../assets/png/eu.png";
const Certificate = () => {
  return (
    <>
      <div className="mb-[40px]">
        <div className="about-section">
          <div className="">
            <h3>Chứng chỉ</h3>
          </div>
        </div>
        <div className="mt-16 mx-[200px]">
          {/* Who We Are */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="md:w-1/2">
              <img
                src={cer01}
                alt="Who We Are"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 inline-block">
                VietGAP
              </h2>
              <p className="leading-relaxed text-justify">
                VietGAP (Vietnamese Good Agricultural Practices) là một trong
                các chứng nhận hữu cơ phổ biến ở Việt Nam, được Bộ Nông nghiệp
                và Phát triển nông thôn ban hành. VietGAP tập trung vào việc đảm
                bảo quy trình sản xuất nông nghiệp an toàn, từ khâu chọn giống,
                canh tác, thu hoạch đến bảo quản. Tiêu chuẩn này yêu cầu nông
                dân hạn chế sử dụng thuốc trừ sâu và phân bón hóa học, đồng thời
                đảm bảo vệ sinh môi trường và an toàn lao động.
              </p>
            </div>
          </div>
          {/* What We Do */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10">
            <div className="md:w-1/2">
              <img
                src={usda}
                alt="What We Do"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 inline-block">
                USDA
              </h2>
              <p className="leading-relaxed text-justify">
                USDA Organic là chứng nhận hữu cơ của Bộ Nông nghiệp Hoa Kỳ,
                thuộc nhóm các chứng nhận hữu cơ phổ biến ở Việt Nam, đặc biệt
                với các sản phẩm xuất khẩu sang thị trường Mỹ. Chứng nhận này
                yêu cầu sản phẩm phải được sản xuất mà không sử dụng phân bón
                hóa học, thuốc trừ sâu tổng hợp, hoặc giống biến đổi gen (GMO).
                Quy trình kiểm tra nghiêm ngặt, từ đất trồng, nguồn nước đến
                khâu đóng gói.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="md:w-1/2">
              <img
                src={eu}
                alt="Who We Are"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 inline-block">
                EU Organic
              </h2>
              <p className="leading-relaxed text-justify">
                EU Organic là chứng nhận hữu cơ của Liên minh châu Âu, cũng nằm
                trong các chứng nhận hữu cơ phổ biến ở Việt Nam. Tiêu chuẩn này
                tương tự USDA Organic, nhưng tập trung vào quy định của thị
                trường EU. Sản phẩm đạt EU Organic phải tuân thủ nghiêm ngặt các
                quy định về canh tác hữu cơ, không sử dụng hóa chất và đảm bảo
                tính bền vững.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
