import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import {
  parseProductDescription,
  type DescriptionSection,
} from "../../../utils/productHelper"; // Nhớ trỏ đúng đường dẫn tới file helper

interface ProductDescriptionProps {
  content: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ content }) => {
  // Logic xử lý dữ liệu được chuyển vào đây
  const parsedDescription = useMemo(() => {
    return parseProductDescription(content);
  }, [content]);

  // Case 1: Render giao diện JSON đẹp mắt
  if (parsedDescription.type === "json") {
    const sections = parsedDescription.content as DescriptionSection[];

    return (
      <div className="space-y-10 animate-fade-in">
        {sections.map((section, index) => {
          // Logic: Nếu có nhiều hơn 1 item thì hiển thị Grid, ngược lại hiển thị Banner ngang
          const isGrid = section.items.length > 1;

          return (
            <div key={index} className="group">
              {/* Tiêu đề Section */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide group-hover:text-green-700 transition-colors">
                  {section.heading}
                </h3>
              </div>

              {/* Nội dung Items */}
              <div
                className={`grid gap-6 ${
                  isGrid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative overflow-hidden rounded-2xl transition-all duration-300
                      ${
                        isGrid
                          ? "bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 p-6" // Card style
                          : "bg-green-50/60 border border-green-100 p-6 flex flex-col md:flex-row gap-4 hover:bg-green-50" // Banner style
                      }
                    `}
                  >
                    {/* Background decoration */}
                    {isGrid && (
                      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-green-100 rounded-full opacity-50 blur-xl group-hover:bg-green-200 transition-all"></div>
                    )}

                    {/* Icon trang trí (Chỉ hiện nếu không phải grid hoặc màn hình lớn) */}
                    <div
                      className={`flex-shrink-0 ${
                        !isGrid && "hidden md:block"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <FontAwesomeIcon icon={faLeaf} />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 flex-1">
                      <h4
                        className={`font-bold text-lg mb-2 ${
                          isGrid ? "text-gray-800" : "text-green-800"
                        }`}
                      >
                        {item.subtitle}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-justify text-[15px]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer Quote */}
        <div className="mt-12 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white text-center relative overflow-hidden shadow-lg">
          <FontAwesomeIcon
            icon={faQuoteLeft}
            className="text-green-400 text-4xl opacity-30 absolute top-4 left-4"
          />
          <p className="text-lg font-medium relative z-10 italic">
            "Hương vị tự nhiên, an toàn cho sức khỏe - Sự lựa chọn hoàn hảo cho
            gia đình bạn."
          </p>
        </div>
      </div>
    );
  }

  // Case 2: Fallback Render HTML cũ
  return (
    <div
      className="prose prose-green max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: parsedDescription.content as string,
      }}
    />
  );
};

export default ProductDescription;
