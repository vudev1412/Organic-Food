// File path: /src/hooks/useProductSection.ts

import { useState, useEffect } from "react";

import { useCurrentApp } from "../components/context/app.context"; // Giả định context này chứa addToCart

// Định nghĩa props cho hook
interface HookProps {
  fetchProductsAPI: (
    page: number,
    size: number
  ) => Promise<IBackendRes<ISpringRawResponse<IProductCard>>>;
  pageSize?: number;
}

interface HookResult {
  products: IProductCard[];
  loading: boolean;
  error: string | null;
  selectedProduct: IProductCard | null;
  selectedDiscount: IDiscount | undefined;
  handleShowQuantityModal: (
    product: IProductCard,
    discount?: IDiscount
  ) => void;
  handleCloseModal: () => void;
  handleConfirmAddToCart: (
    product: IProductCard,
    quantity: number,
    discount?: IDiscount
  ) => void;
}

const useProductSection = ({
  fetchProductsAPI,
  pageSize = 4,
}: HookProps): HookResult => {
  const { addToCart } = useCurrentApp();

  const [products, setProducts] = useState<IProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<
    IDiscount | undefined
  >(undefined);

  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Luôn lấy trang 1
        const response = await fetchProductsAPI(1, pageSize);

        if (
          response.data &&
          response.statusCode === 200 &&
          response.data.result
        ) {
          const paginatedData = response.data.meta;
          const productList = response.data.result || [];
          setProducts(productList);
        } else {
          setProducts([]);
          setError(response.message || "Không có sản phẩm nào.");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Không thể kết nối đến máy chủ.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [fetchProductsAPI, pageSize]); // Dependency vào fetchProductsAPI function

  // --- HANDLERS ---
  const handleShowQuantityModal = (
    product: IProductCard,
    discount?: IDiscount
  ) => {
    setSelectedProduct(product);
    setSelectedDiscount(discount);
  };

  const handleConfirmAddToCart = (
    product: IProductCard,
    quantity: number,
    discount?: IDiscount
  ) => {
    if (product && quantity > 0) {
      const productWithOriginalPrice = {
        ...product,
        // price trong IProductCard hiện tại là finalPrice (giá đã giảm).
        // Chúng ta cần tính giá gốc dựa trên discount để truyền vào giỏ hàng
        // Tuy nhiên, để đơn giản, ta sẽ dựa vào logic tính trong ProductRight
        // Giả định backend/context xử lý giá gốc/finalPrice qua discount object
        originalPrice: product.discount
          ? product.price / (1 - product.discount.value / 100)
          : product.price, // Giả định tính ngược
        discount: discount || product.discount,
      };

      addToCart(productWithOriginalPrice, quantity);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedDiscount(undefined);
  };

  return {
    products,
    loading,
    error,
    selectedProduct,
    selectedDiscount,
    handleShowQuantityModal,
    handleCloseModal,
    handleConfirmAddToCart,
  };
};

export default useProductSection;
