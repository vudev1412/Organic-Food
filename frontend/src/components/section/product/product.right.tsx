import { useState, useEffect } from "react";
import {
  getProductCardListAPI,
  getProductsByCategoryAPI,
} from "../../../service/api";
import { useCurrentApp } from "../../context/app.context";

// Import các component con
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import QuantityModal from "./QuantityModal";
import ProductListHeader from "./ProductListHeader";

interface ProductRightProps {
  selectedCategoryId: number | null;
  selectedCategoryName: string; // [MỚI] Thêm prop này để nhận tên
}

const ProductRight = ({ selectedCategoryId, selectedCategoryName }: ProductRightProps) => {
  const { addToCart } = useCurrentApp();

  // --- STATE QUẢN LÝ ---
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<
    IDiscount | undefined
  >(undefined);

  // Khi danh mục thay đổi, reset về trang 0
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategoryId]);

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
        let response;

        // Kiểm tra xem có đang chọn danh mục không
        if (selectedCategoryId) {
          // Nếu có ID danh mục -> Gọi API lấy sản phẩm theo danh mục
          response = await getProductsByCategoryAPI(
            selectedCategoryId,
            pageToSend,
            pageSize,
            sortParam
          );
        } else {
          // Nếu null -> Gọi API lấy tất cả sản phẩm
          response = await getProductCardListAPI(
            pageToSend,
            pageSize,
            sortParam
          );
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
  }, [currentPage, pageSize, sortOption, selectedCategoryId]);

  // --- HANDLERS (Giữ nguyên) ---
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
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        // [SỬA ĐỔI] Sử dụng prop name truyền từ cha xuống
        tilte={
          selectedCategoryId 
            ? selectedCategoryName // Hiển thị tên cụ thể (VD: Rau củ)
            : "Tất cả sản phẩm"
        }
      />

      <ProductGrid products={products} onAddToCart={handleShowQuantityModal} />

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