import React from "react";
import { Link } from "react-router-dom";
import "./common.scss"; // SCSS đã khai báo .product, .discounted, .original...

interface ProductCardProps {
  id: number;
  imageUrl: string;
  altText: string;
  name: string;
  price: number;
  quantity: number; // Đã thêm
  slug: string;
  discount?: IDiscount;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  altText,
  name,
  price,
  quantity,
  slug,
  discount,
  onAddToCart,
}) => {
  // 2. TẠO BIẾN KIỂM TRA HẾT HÀNG
  const isSoldOut = quantity === 0;
  const type = discount?.type?.toUpperCase();

  const discountedPrice =
    // Kiểm tra discount có tồn tại không trước
    discount && type === "PERCENT"
      ? price * (1 - discount.value / 100)
      : discount && type === "FIXED_AMOUNT"
      ? price - discount.value
      : price;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 3. THÊM KIỂM TRA TRONG HANDLER
    if (isSoldOut) return; // Không làm gì nếu đã hết hàng

    onAddToCart();
  };

  return (
    <Link
      to={`/san-pham/${slug}`}
      className="product"
      state={{ productId: id }}
    >
      <div className="image-box">
        <div className="image-wrapper">
          <img src={imageUrl} alt={altText} />
        </div>
        {/* Badge giảm giá */}
        {discount && (
          <span className="discount-badge">
            {type === "PERCENT"
              ? `-${discount.value}%`
              : `-${(discount.value / 1000).toLocaleString()}K`}
          </span>
        )}

        <button
          className={`add-to-cart ${isSoldOut ? "sold-out" : ""}`}
          onClick={handleAddToCartClick}
          disabled={isSoldOut}
        >
          {isSoldOut ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </button>
      </div>
      <div className="info">
        <h3 className="product-name">{name}</h3>
        <div className="price">
          {discount ? (
            <>
              <span className="discounted">
                {discountedPrice.toLocaleString()}₫
              </span>
              <span className="original">{price.toLocaleString()}₫</span>
            </>
          ) : (
            <span className="no-discounted">{price.toLocaleString()}₫</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
