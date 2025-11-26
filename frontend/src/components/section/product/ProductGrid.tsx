// File path: /src/components/section/product/ProductGrid.tsx

import ProductCardWithPromotion from "../../common/product.card.with.promotion";
// import { IProductCard } from "../../../types";

interface ProductGridProps {
  products: IProductCard[];
  onAddToCart: (product: IProductCard, discount?: IDiscount) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCardWithPromotion
          key={product.id}
          product={product} // Truyền toàn bộ object product
          onAddToCart={onAddToCart} // Truyền hàm xử lý sự kiện
        />
      ))}
    </div>
  );
};

export default ProductGrid;
