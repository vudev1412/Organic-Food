// File path: /src/components/section/home/best.seller.product.tsx

import "./home.scss";
import useProductSection from "../../../hooks/useProductSection";
import { getBestPromotedProductsAPI } from "../../../service/api";
import QuantityModal from "../product/QuantityModal"; // Import Modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ProductCardWithPromotion from "../../common/product.card.with.promotion"; // Component hiển thị
import { Link } from "react-router-dom";

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
        {products.map((p) => (
          <ProductCardWithPromotion
            key={p.id}
            product={p}
            onAddToCart={handleShowQuantityModal}
          />
        ))}
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
