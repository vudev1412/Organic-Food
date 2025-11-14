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

  const discountedPrice =
    discount?.type === "percent"
      ? price * (1 - discount.value / 100)
      : discount?.type === "fixed_amount"
      ? price - discount.value * 1000
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
        <img src={imageUrl} alt={altText} />
        {/* Badge giảm giá */}
        {discount && (
          <span className="discount-badge">
            {discount.type === "percent"
              ? `-${discount.value}%`
              : `-${discount.value.toLocaleString()}K`}
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
            <span className="discounted">{price.toLocaleString()}₫</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
