import { useState, useEffect } from "react";
// Import API mới từ service đã chỉnh sửa
import {
  fetchActiveProductsByCategory,
  fetchAllActiveProducts,
} from "../../../service/api";
import { useCurrentApp } from "../../context/app.context";

// Import các component con
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import QuantityModal from "./QuantityModal";
import ProductListHeader from "./ProductListHeader";

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
  // Backend trang 1 -> UI trang 1
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");

  // State lọc giá
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // [MỚI] State lọc theo chứng chỉ
  const [selectedCertIds, setSelectedCertIds] = useState<number[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<
    IDiscount | undefined
  >(undefined);

  // Khi danh mục thay đổi, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
    // Tùy chọn: Reset bộ lọc khi đổi danh mục
    // setMinPrice(undefined);
    // setMaxPrice(undefined);
    // setSelectedCertIds([]);
  }, [selectedCategoryId]);

  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Xử lý sort param
        let sortParam = "";
        if (sortOption === "price_asc") {
          sortParam = "price,asc";
        } else if (sortOption === "price_desc") {
          sortParam = "price,desc";
        } else if (sortOption === "name_asc") {
          sortParam = "name,asc";
        }

        // Tạo object params chung
        const commonParams = {
          page: currentPage,
          size: pageSize,
          sort: sortParam,
          minPrice: minPrice,
          maxPrice: maxPrice,
          certificateIds: selectedCertIds, // [MỚI] Truyền danh sách ID chứng chỉ
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
    selectedCertIds, // [MỚI] Thêm dependency
  ]);

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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm xử lý khi lọc giá
  const handlePriceFilterChange = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  // [MỚI] Hàm xử lý khi lọc chứng chỉ
  const handleCertificateFilterChange = (ids: number[]) => {
    setSelectedCertIds(ids);
    setCurrentPage(1);
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
        onFilterPrice={handlePriceFilterChange}
        // [MỚI] Truyền handler lọc chứng chỉ xuống Header
        onFilterCertificate={handleCertificateFilterChange}
        tilte={selectedCategoryId ? selectedCategoryName : "Tất cả sản phẩm"}
      />

      <ProductGrid products={products} onAddToCart={handleShowQuantityModal} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage - 1} // Convert sang 0-index cho UI nếu cần
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page + 1)} // Convert về 1-index cho Logic
        />
      )}
    </div>
  );
};

export default ProductRight;
