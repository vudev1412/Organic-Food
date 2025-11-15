import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBolt,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import StarRating from "./StarRating";
// Giả sử IProductDetail và ICertification được import từ file types của bạn
// import { IProductDetail, ICertification } from "../../../interfaces/types";

interface ProductInfoProps {
  product: IProductDetail; // <-- Giả sử IProductDetail có thêm trường `stock: number`
  averageRating: number;
  commentCount: number;
  certifications: ICertification[];
  onCertClick: (cert: ICertification) => void;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onQuantityChange: (newQty: number) => void; // callback khi người dùng nhập
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  averageRating,
  commentCount,
  certifications,
  onCertClick,
  quantity,
  onDecrease,
  onIncrease,
  onQuantityChange,
}) => {
  const [inputQty, setInputQty] = useState<number>(quantity);
  useEffect(() => {
    setInputQty(quantity);
  }, [quantity]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    // Ràng buộc số lượng theo tồn kho
    if (val < 1) val = 1;
    if (val > product.quantity) val = product.quantity;
    setInputQty(val);
    onQuantityChange(val);
  };

  const handleIncrease = () => {
    if (quantity < product.quantity) {
      onIncrease();
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onDecrease();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={averageRating} size="lg" />
          <span className="text-gray-600">
            {averageRating.toFixed(1)} ({commentCount} đánh giá)
          </span>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-bold text-green-700">
            {product.price.toLocaleString()}₫ / {product.unit}
          </span>
        </div>

        {/* === PHẦN THÊM MỚI === */}
        <div className="text-sm text-gray-700 mt-2">
          <span>Số lượng còn lại: </span>
          <span className="font-semibold text-green-700">
            {product.quantity}
          </span>
        </div>
        {/* === KẾT THÚC PHẦN THÊM MỚI === */}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 ">
        <h4 className="font-semibold mb-2 flex items-center gap-2 ">
          <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
          Chứng nhận chất lượng
        </h4>
        <div className="flex gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-2 border border-transparent hover:!border-green-300p-2 rounded-full cursor-pointer transition-all duration-300 
        ring-1 ring-transparent hover:ring-green-300 
        hover:shadow-lg hover:scale-105"
              onClick={() => onCertClick(cert)}
            >
              <img
                src={cert.logo}
                alt={cert.name}
                className="w-20 h-20 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">
          Số lượng ({product.unit}):
        </h3>
        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden w-fit">
          <button
            onClick={handleDecrease}
            className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            type="number"
            value={inputQty}
            onChange={handleInputChange}
            className="w-16 text-center text-lg font-semibold bg-gray-100 outline-none"
            min={1}
            max={product.quantity}
          />

          <button
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faShoppingCart} />
          Thêm vào giỏ
        </button>
        <button className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faBolt} />
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
