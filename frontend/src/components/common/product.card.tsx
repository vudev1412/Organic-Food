import React from "react";
import { Link } from "react-router-dom";
import "./common.scss"; // SCSS đã khai báo .product, .discounted, .original...

export interface Discount {
  type: "percent" | "fixed_amount";
  value: number;
}

interface ProductCardProps {
  imageUrl: string;
  altText: string;
  name: string;
  price: number;
  slug: string;
  discount?: Discount;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  altText,
  name,
  price,
  slug,
  discount,
  onAddToCart,
}) => {
  const discountedPrice =
    discount?.type === "percent"
      ? price * (1 - discount.value / 100)
      : discount?.type === "fixed_amount"
      ? price - discount.value * 1000
      : price;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <Link to={`/san-pham/${slug}`} className="product">
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
        <button className="add-to-cart" onClick={handleAddToCartClick}>
          Thêm vào giỏ hàng
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
