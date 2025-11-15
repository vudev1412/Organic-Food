import React from "react";
import ProductCard from "../../common/product.card";
// import { IProductCard } from "../../../types";

interface ProductGridProps {
  products: IProductCard[];
  onAddToCart: (product: IProductCard) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          imageUrl={
            product.image
              ? `http://localhost:8080/storage/images/products/${product.image}`
              : "https://placehold.co/600x600/a0e0a0/333"
          }
          altText={product.name}
          name={product.name}
          price={product.price}
          slug={product.slug}
          quantity={product.quantity}
          discount={{ id: 1, type: "percent", value: 20 }} // Ghi chú: discount đang hardcode
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;