import { useState, useEffect } from "react";
// Import API mới từ service đã chỉnh sửa

import { useCurrentApp } from "../../context/app.context";

// Import các component con
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import QuantityModal from "./QuantityModal";
import ProductListHeader from "./ProductListHeader";
import {
  fetchActiveProductsByCategory,
  fetchAllActiveProducts,
} from "../../../service/api";

interface ProductRightProps {
  selectedCategoryId: number | null;
  selectedCategoryName: string;
}

const ProductRight = ({
  selectedCategoryId,
  selectedCategoryName,
}: ProductRightProps) => {
  const { addToCart } = useCurrentApp();

  // --- STATE QUẢN LÝ ---
  const [products, setProducts] = useState<IProductCard[]>([]);
  // Backend trang 1 -> UI trang 1 (để đồng bộ dễ hơn, ta khởi tạo là 1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");

  // State lọc giá [MỚI]
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<
    IDiscount | undefined
  >(undefined);

  // Khi danh mục thay đổi, reset về trang 1 và xóa bộ lọc giá (nếu muốn)
  useEffect(() => {
    setCurrentPage(1);
    // setMinPrice(undefined); // Uncomment nếu muốn reset giá khi đổi danh mục
    // setMaxPrice(undefined);
  }, [selectedCategoryId]);

  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Xử lý sort param chuẩn format Spring: field,direction
        let sortParam = "";
        if (sortOption === "price_asc") {
          sortParam = "price,asc";
        } else if (sortOption === "price_desc") {
          sortParam = "price,desc";
        } else if (sortOption === "name_asc") {
          sortParam = "name,asc"; // Ví dụ thêm sort theo tên
        }

        const commonParams = {
          page: currentPage,
          size: pageSize,
          sort: sortParam,
          minPrice: minPrice,
          maxPrice: maxPrice,
        };

        let response;

        // Kiểm tra xem có đang chọn danh mục không
        if (selectedCategoryId) {
          // Gọi API active theo danh mục
          response = await fetchActiveProductsByCategory(
            selectedCategoryId,
            commonParams
          );
        } else {
          // Gọi API tất cả active
          response = await fetchAllActiveProducts(commonParams);
        }

        if (response?.data?.data) {
          const paginatedData = response.data.data;
          const productList = (paginatedData?.result || []).map(
            (p: IProductCard) => ({ ...p })
          );
          const pages = paginatedData?.meta?.pages || 0;

          setProducts(productList);
          setTotalPages(pages);
        } else {
          setProducts([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [
    currentPage,
    pageSize,
    sortOption,
    selectedCategoryId,
    minPrice,
    maxPrice,
  ]); // Thêm minPrice, maxPrice vào dependency

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
        originalPrice: product.price,
        discount: discount,
      };

      addToCart(productWithOriginalPrice, quantity);
      setSelectedProduct(null);
      setSelectedDiscount(undefined);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedDiscount(undefined);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // Reset về trang 1 khi sort
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // [MỚI] Hàm xử lý khi người dùng lọc giá (truyền xuống Header hoặc Sidebar)
  const handlePriceFilterChange = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  // --- RENDER ---
  return (
    <div className="w-full">
      <QuantityModal
        product={selectedProduct}
        onClose={handleCloseModal}
        discount={selectedDiscount}
        onConfirm={handleConfirmAddToCart}
      />

      <ProductListHeader
        onSortChange={handleSortChange}
        // Thêm prop để lọc giá
        onFilterPrice={handlePriceFilterChange}
        tilte={selectedCategoryId ? selectedCategoryName : "Tất cả sản phẩm"}
      />

      <ProductGrid products={products} onAddToCart={handleShowQuantityModal} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage - 1} // Pagination component thường chạy từ 0 index UI, nhưng hiển thị +1. Tùy Pagination component của bạn.
          // Nếu Pagination của bạn nhận prop currentPage là số hiển thị (1,2,3) thì để currentPage.
          // Nếu nó nhận index (0,1,2) thì để currentPage - 1.
          // Giả sử Pagination component của bạn dùng 0-indexed logic nội bộ:
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page + 1)} // Convert từ 0-index UI về 1-index logic
        />
      )}
    </div>
  );
};

export default ProductRight;
