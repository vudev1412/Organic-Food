// File path: /src/components/section/home/best.seller.product.tsx

import useProductSection from "../../hooks/useProductSection";
import { getBestPromotedProductsAPI } from "../../service/api";
import "../section/home/home.scss";
import QuantityModal from "../section/product/QuantityModal";
import ProductCardWithPromotion from "./product.card.with.promotion";

const calculateOriginalPrice = (product: IProductCard): number => {
  if (product.discount && product.discount.value > 0) {
    const discountedPrice = product.price;

    switch (product.discount.type) {
      case "PERCENT": {
        const discountRate = product.discount.value / 100;

        if (discountRate >= 1) return discountedPrice;

        const originalPricePercent = discountedPrice / (1 - discountRate);

        return Math.round(originalPricePercent);
      }

      case "FIXED_AMOUNT": {
        const discountAmount = product.discount.value;

        const originalPriceFixed = discountedPrice + discountAmount;

        return Math.round(originalPriceFixed);
      }

      default:
        return discountedPrice;
    }
  }
  return product.price;
};
const RelatedProducts = () => {
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
    const originalPrice = calculateOriginalPrice(p);

    return {
      ...p,
      price: originalPrice, // Gán giá gốc vào trường 'price'
      // p.price ban đầu (giá đã giảm) vẫn có thể được truy cập thông qua p.discount
      // hoặc bạn có thể thêm finalPrice: p.price nếu ProductCardWithPromotion cần
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
        <h1 style={{ color: "#0a472e" }}>Sản phẩm tương tự</h1>
      </div>
      <div className="flex flex-wrap gap-15 justify-center ">
        {transformedProducts.map((p) => (
          <ProductCardWithPromotion
            key={p.id}
            product={p}
            onAddToCart={handleShowQuantityModal}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
