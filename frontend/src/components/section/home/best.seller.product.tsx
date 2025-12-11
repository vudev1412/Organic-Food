// File path: /src/components/section/home/best.seller.product.tsx

import "./home.scss";
import useProductSection from "../../../hooks/useProductSection";
import { getBestPromotedProductsAPI } from "../../../service/api";
import QuantityModal from "../product/QuantityModal"; // Import Modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ProductCardWithPromotion from "../../common/product.card.with.promotion"; // Component hiển thị
import { Link } from "react-router-dom";

const calculateOriginalPrice = (product: IProductCard): number => {
  if (product.discount && product.discount.value > 0) {
    const discountedPrice = product.price;

    switch (product.discount.type) {
      case "PERCENT": {
        // Thêm { ở đây
        const discountRate = product.discount.value / 100;

        // Tránh chia cho 0 hoặc giá trị không hợp lệ
        if (discountRate >= 1) return discountedPrice;

        // Công thức tính ngược giá gốc cho PERCENT
        const originalPricePercent = discountedPrice / (1 - discountRate);

        // Trả về giá trị làm tròn
        return Math.round(originalPricePercent);
      } // Thêm } ở đây

      case "FIXED_AMOUNT": {
        // Thêm { ở đây
        const discountAmount = product.discount.value;

        // Công thức tính ngược giá gốc cho FIXED_AMOUNT
        const originalPriceFixed = discountedPrice + discountAmount;

        // Trả về giá trị làm tròn
        return Math.round(originalPriceFixed);
      } // Thêm } ở đây

      default:
        // Nếu có loại giảm giá khác chưa được xử lý, trả về giá hiện tại
        return discountedPrice;
    }
  }
  // Trả về giá hiện tại nếu không có thông tin giảm giá
  return product.price;
};
const BestSellerProduct = () => {
  const {
    products,
    loading,
    error,
    selectedProduct,
    selectedDiscount,
    handleShowQuantityModal,
    handleCloseModal,
    handleConfirmAddToCart,
  } = useProductSection({
    fetchProductsAPI: getBestPromotedProductsAPI,
    pageSize: 4,
  });

  if (loading) {
    return (
      <section className="mt-[50px] text-center">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm khuyến mãi</h1>
        <p>Đang tải sản phẩm...</p>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="mt-[50px] text-center">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm khuyến mãi</h1>
        <p>{error || "Không tìm thấy Sản phẩm khuyến mãi nào."}</p>
      </section>
    );
  }
  const transformedProducts = products.map((p) => {
    // Nếu API trả về giá đã giảm trong p.price, ta thay thế nó bằng giá gốc đã tính toán
    // Nếu API trả về giá gốc, việc tính toán sẽ trả về giá gốc (không thay đổi)

    const originalPrice = calculateOriginalPrice(p);

    // Tạo một bản sao của sản phẩm với giá gốc đã được tính toán thay thế vào trường 'price'.
    // Giả định ProductCardWithPromotion sử dụng 'price' là giá gốc để hiển thị gạch ngang.
    return {
      ...p,
      price: originalPrice, // Gán giá gốc vào trường 'price'
      // Có thể thêm trường 'finalPrice' nếu component card cần giá đã giảm:
      // finalPrice: p.price,
    };
  });
  return (
    <section className="mt-[50px]">
      <QuantityModal
        product={selectedProduct}
        onClose={handleCloseModal}
        discount={selectedDiscount}
        onConfirm={handleConfirmAddToCart}
      />

      <div className="flex justify-center mb-3">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm khuyến mãi</h1>
      </div>
      <div className="flex flex-wrap gap-6 justify-center ">
        {transformedProducts.map((p) => {
          // ⭐ THÊM CONSOLE LOG NGAY ĐÂY ⭐
          console.log("Dữ liệu sản phẩm khuyến mãi (p):", p);

          return (
            <ProductCardWithPromotion
              key={p.id}
              product={p}
              onAddToCart={handleShowQuantityModal}
            />
          );
        })}
      </div>
      <div className=" flex justify-center mt-10">
        <Link
          to="/san-pham" // Đường dẫn đích
          className="view-more" // Giữ nguyên class CSS để style
        >
          Xem thêm sản phẩm <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </section>
  );
};

export default BestSellerProduct;
