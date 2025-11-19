import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
// Import ProductCard gốc
import ProductCard from "./product.card";
import { getBestPromotionByProductId } from "../../service/api";

interface ProductCardWithPromotionProps {
  product: IProductCard;
  onAddToCart: (product: IProductCard, discount?: IDiscount) => void;
}

const ProductCardWithPromotion = ({
  product,
  onAddToCart,
}: ProductCardWithPromotionProps) => {
  // 1. STATE để lưu trữ khuyến mãi và trạng thái tải
  const [bestPromotion, setBestPromotion] = useState<IBestPromotion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // 2. LOGIC GỌI API
  useEffect(() => {
    // Chỉ gọi API khi ID sản phẩm hợp lệ
    if (!product.id) return;

    const fetchPromotion = async () => {
      setIsLoading(true);
      try {
        const response = await getBestPromotionByProductId(product.id);

        // Kiểm tra data trả về (statusCode 200)
        if (response.data && response.data.data) {
          setBestPromotion(response.data.data);
        } else {
          setBestPromotion(null);
        }
      } catch (e) {
        const axiosError = e as AxiosError<IBackendRes<IBestPromotion>>;

        // Xử lý 404: Không có khuyến mãi là điều bình thường, không coi là lỗi nghiêm trọng
        if (axiosError.response?.status === 404) {
          setBestPromotion(null);
        } else {
          // Ghi nhận lỗi nghiêm trọng khác (ví dụ: 500)
          console.error(`Lỗi tải khuyến mãi cho SP ${product.id}:`, e);
          setBestPromotion(null); // Đảm bảo không hiển thị dữ liệu khuyến mãi cũ
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotion();
  }, [product.id]);

  // 3. CHUYỂN ĐỔI DỮ LIỆU TỪ IBestPromotion SANG IDiscount (Dạng ProductCard cần)
  const discountProps: IDiscount | undefined = bestPromotion
    ? {
        id: bestPromotion.id,
        // Đảm bảo type phù hợp với ProductCard (VD: chuyển "PERCENT" thành "percent")
        type: bestPromotion.type.toLowerCase(),
        value: bestPromotion.value,
      }
    : undefined;

  // 4. TRẠNG THÁI LOADING
  if (isLoading) {
    // Hiển thị skeleton loading để tránh nhảy layout
    return (
      <div className="p-4 h-64 bg-gray-100 rounded shadow animate-pulse">
        Đang tải khuyến mãi...
      </div>
    );
  }

  // 5. RENDER ProductCard GỐC VỚI PROPS ĐÃ CHUẨN BỊ
  return (
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
      // TRUYỀN DATA KHUYẾN MÃI
      discount={discountProps}
      // Hàm onAddToCart sử dụng product object từ props
      onAddToCart={() => onAddToCart(product, discountProps)}
    />
  );
};

export default ProductCardWithPromotion;
