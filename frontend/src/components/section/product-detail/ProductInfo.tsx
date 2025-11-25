import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faShieldAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import StarRating from "./StarRating";
import { useCurrentApp } from "../../context/app.context";

interface ProductInfoProps {
  product: IProductDetail;
  averageRating: number;
  commentCount: number;
  certifications: ICertification[];
  onCertClick: (cert: ICertification) => void;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onQuantityChange: (newQty: number) => void;
  bestPromotion?: IBestPromotion | null;
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
  bestPromotion,
}) => {
  // 1. LẤY showToast TỪ CONTEXT
  const { addToCart, showToast } = useCurrentApp();
  const navigate = useNavigate();

  const [inputQty, setInputQty] = useState<number>(quantity);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputQty(quantity);
    setErrorMessage(null);
  }, [quantity]);

  // 2. CẬP NHẬT LOGIC NHẬP TAY (Input)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;

    // Nếu nhập quá tồn kho -> Chặn lại & Toast
    if (val > product.quantity) {
      val = product.quantity;
      showToast(`Kho chỉ còn ${product.quantity} sản phẩm!`, "warning");
    }

    setInputQty(val);
    onQuantityChange(val);
  };

  // 3. CẬP NHẬT LOGIC TĂNG (Button +)
  const handleIncrease = () => {
    if (quantity < product.quantity) {
      onIncrease();
    }
    // Không toast nữa, chỉ disable button
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onDecrease();
    }
  };

  const originalPrice = product.price;
  const finalPrice = bestPromotion?.finalPrice ?? originalPrice;
  const hasPromotion = !!bestPromotion;

  const handleAddToCart = async () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      quantity: product.quantity, // LƯU Ý: Đây là STOCK, không phải QUANTITY người dùng chọn
      originalPrice: product.price,
      discount: bestPromotion
        ? {
            id: bestPromotion.id,
            type: bestPromotion.type,
            value:
              bestPromotion.type === "PERCENT"
                ? bestPromotion.value
                : bestPromotion.discountAmount || 0,
          }
        : undefined,
    };

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const success = await addToCart(productToAdd, quantity);

      if (success) {
        // Reset số lượng về 1 chỉ khi thêm thành công
        setInputQty(1);
        onQuantityChange(1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorText = error?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng";
      setErrorMessage(errorText);
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate(-1);
  };

  // Đã xóa hàm handleViewAllCerts vì nút "Tìm hiểu thêm" đã bị loại bỏ

  const isDecreaseDisabled = quantity <= 1;
  const isIncreaseDisabled = quantity >= product.quantity;

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
        {/* HIỂN THỊ GIÁ */}
        <div className="flex items-baseline gap-3 mb-1">
          {hasPromotion && (
            <span className="text-xl font-semibold text-gray-500 line-through">
              {originalPrice.toLocaleString()}₫
            </span>
          )}

          {/* Giá & Đơn vị */}
          <div className="text-3xl font-bold">
            <span className={hasPromotion ? "text-red-600" : "text-green-600"}>
              {finalPrice.toLocaleString()}₫
            </span>
            <span className="text-green-600"> / {product.unit}</span>
          </div>

          {hasPromotion && (
            <span className="text-sm font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
              {bestPromotion.type === "PERCENT"
                ? `GIẢM ${bestPromotion.value}%`
                : `GIẢM ${bestPromotion.discountAmount?.toLocaleString()}₫`}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-700 mt-2">
          <span>Số lượng còn lại: </span>
          <span className="font-semibold text-green-700">
            {product.quantity}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 ">
        <h4 className="font-semibold mb-2 flex items-center gap-2 ">
          <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
          Chứng nhận chất lượng
        </h4>
        {/* Đã xóa mb-4 vì không còn nút ở dưới */}
        <div className="flex gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              // Giữ lại logic mở modal khi click vào logo
              className="p-2 border border-transparent hover:!border-green-300 rounded-full cursor-pointer transition-all duration-300 
        ring-1 ring-transparent hover:ring-green-300 
        hover:shadow-lg hover:scale-105"
              onClick={() => onCertClick(cert)}
            >
              {/* Thêm xử lý lỗi nếu ảnh không load được */}
              <img
                src={cert.logo}
                alt={cert.name}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/80x80/cccccc/000000?text=Loi";
                  e.currentTarget.alt = `${cert.name} (Loi tai anh)`;
                }}
              />
            </div>
          ))}
        </div>

        {/* ĐÃ XÓA NÚT "Tìm hiểu thêm" */}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">
          Số lượng ({product.unit}):
        </h3>
        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden w-fit">
          <button
            onClick={handleDecrease}
            disabled={isDecreaseDisabled}
            className={`w-12 h-12 flex items-center justify-center text-xl transition-colors ${
              isDecreaseDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200 text-gray-700"
            }`}
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
            className="w-16 text-center text-lg font-semibold bg-gray-100 outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={1}
            max={product.quantity}
          />

          <button
            onClick={handleIncrease}
            disabled={isIncreaseDisabled}
            className={`w-12 h-12 flex items-center justify-center text-xl transition-colors ${
              isIncreaseDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200 text-gray-700"
            }`}
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

      {errorMessage && (
        <div className="text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse bg-red-50 p-2 rounded-lg border border-red-200">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-gray-100"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
        >
          {isLoading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          ) : (
            <FontAwesomeIcon icon={faShoppingCart} />
          )}
          {isLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
        </button>

        <button
          onClick={handleContinueShopping}
          className="flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2 bg-yellow-100 text-gray-700 hover:bg-yellow-200 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;