// File path: /src/components/common/RelatedProducts.tsx

import React from "react";
import { Link } from "react-router-dom";

// Import ảnh mock (Bạn cần đảm bảo đường dẫn này đúng)
import cachua from "../../assets/jpg/ca-chua-beef-huu-co.jpg";
import StarRating from "../section/product-detail/StarRating";

const RelatedProducts: React.FC = () => {
  // TODO: Thay thế mock data này bằng props (danh sách sản phẩm liên quan)
  const relatedProducts = [
    {
      id: 1,
      name: "Cà chua beef hữu cơ",
      price: 40000,
      rating: 4,
      img: cachua,
    },
    {
      id: 2,
      name: "Cà chua beef hữu cơ",
      price: 40000,
      rating: 4,
      img: cachua,
    },
    {
      id: 3,
      name: "Cà chua beef hữu cơ",
      price: 40000,
      rating: 4,
      img: cachua,
    },
    {
      id: 4,
      name: "Cà chua beef hữu cơ",
      price: 40000,
      rating: 4,
      img: cachua,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10 mt-8">
      <h2 className="text-3xl font-bold mb-8">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {relatedProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:border-green-300"
          >
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-90 flex items-center justify-center transition-all duration-300">
                <Link
                  to={`/san-pham/slug-san-pham-lien-quan`} // TODO: Cập nhật link động
                  className="opacity-0 group-hover:opacity-100 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            <div className="p-4">
              <Link
                to={`/san-pham/slug-san-pham-lien-quan`} // TODO: Cập nhật link động
                className="hover:text-green-700 transition-colors"
              >
                <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-lg">
                  {item.price.toLocaleString()}₫
                </span>
                <StarRating rating={item.rating} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
