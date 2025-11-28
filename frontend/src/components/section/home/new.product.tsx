// File path: /src/components/section/home/new.product.tsx

import "./home.scss";
import useProductSection from "../../../hooks/useProductSection";
import { getNewArrivalsProductsAPI } from "../../../service/api";
import QuantityModal from "../product/QuantityModal";
import ProductCardWithPromotion from "../../common/product.card.with.promotion"; // Component hiển thị

const NewProduct = () => {
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
    fetchProductsAPI: getNewArrivalsProductsAPI,
    pageSize: 4,
  });

  if (loading) {
    return (
      <section className="mt-[50px] text-center">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm mới về</h1>
        <p>Đang tải sản phẩm...</p>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="mt-[50px] text-center">
        <h1 style={{ color: "#0a472e" }}>Sản phẩm mới về</h1>
        <p>{error || "Không tìm thấy sản phẩm mới nào."}</p>
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
        <h1 style={{ color: "#0a472e" }}>Sản phẩm mới về</h1>
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
    </section>
  );
};

export default NewProduct;
