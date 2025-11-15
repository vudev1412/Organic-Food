import { useState, useEffect } from "react";
import { getProductCardListAPI } from "../../../service/api";
import { useCurrentApp } from "../../context/app.context";
import { useToast } from "../../context/toast.context";

// Import các component con

import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import QuantityModal from "./QuantityModal";
import ProductListHeader from "./ProductListHeader";

const ProductRight = () => {
  const { addToCart } = useCurrentApp();
  const { showToast } = useToast();

  // --- STATE QUẢN LÝ ---
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );

  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let sortParam = "";
        if (sortOption === "price_asc") {
          sortParam = "price,asc";
        } else if (sortOption === "price_desc") {
          sortParam = "price,desc";
        }

        const pageToSend = currentPage + 1; // API dùng 1-indexed
        const response = await getProductCardListAPI(
          pageToSend,
          pageSize,
          sortParam
        );

        if (response?.data?.data) {
          const paginatedData = response.data.data;
          const productList = (paginatedData?.result || []).map(
            (p: IProductCard) => ({ ...p })
          );
          const pages = paginatedData?.meta?.pages || 0;

          setProducts(productList);
          setTotalPages(pages);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize, sortOption]);

  // --- HANDLERS ---

  // Mở modal khi nhấn "Thêm vào giỏ"
  const handleShowQuantityModal = (product: IProductCard) => {
    setSelectedProduct(product);
  };

  // Xác nhận từ modal
  const handleConfirmAddToCart = (product: IProductCard, quantity: number) => {
    if (product && quantity > 0) {
      console.log("Adding to cart:", product.name, "Quantity:", quantity);

      const productWithOriginalPrice = {
        ...product,
        originalPrice: product.price, // giá gốc
      };

      addToCart(productWithOriginalPrice, quantity);
      setSelectedProduct(null); // Đóng modal
      showToast(
        `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`,
        "success",
        3000
      );
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Thay đổi sắp xếp
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0); // Reset về trang đầu
  };

  // Thay đổi trang (từ component Pagination)
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // page đã là 0-indexed
  };

  // --- RENDER ---
  return (
    <div className="w-full">
      {/* 1. Modal chọn số lượng */}
      <QuantityModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAddToCart}
      />

      {/* 2. Header (Tiêu đề + Sắp xếp) */}
      <ProductListHeader
        onSortChange={handleSortChange}
        tilte="Tất cả sản phẩm"
      />

      {/* 3. Lưới sản phẩm */}
      <ProductGrid products={products} onAddToCart={handleShowQuantityModal} />

      {/* 4. Phân trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductRight;
