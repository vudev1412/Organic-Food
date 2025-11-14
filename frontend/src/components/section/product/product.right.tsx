import React, { useState, useEffect } from "react";
import ProductCard from "../../common/product.card";
import { getProductCardListAPI } from "../../../service/api";
import { useCurrentApp } from "../../context/app.context";
import { useToast } from "../../context/toast.context";

// --- CÁC ICON SVG ---
const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- KẾT THÚC ICON ---

// --- COMPONENT DROPDOWN SẮP XẾP (TÙY CHỈNH BẰNG TAILWIND) ---
interface SortDropdownProps {
  onSortChange: (sortOption: string) => void;
}

const SortDropdown = ({ onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sắp xếp mặc định");
  const options = [
    { label: "Sắp xếp mặc định", value: "default" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao đến thấp", value: "price_desc" },
  ];

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSortChange(option.value);
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <div>
        <button
          type="button"
          className="flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
          <ChevronDownIcon
            className={`-mr-1 ml-2 h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10000"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const ProductRight = () => {
  const { addToCart } = useCurrentApp();
  const { showToast } = useToast();
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<IProductCard | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  // Lấy sản phẩm từ API khi component mount hoặc page/sort thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Xây dựng tham số sort cho API
        let sortParam = "";
        if (sortOption === "price_asc") {
          sortParam = "price,asc";
        } else if (sortOption === "price_desc") {
          sortParam = "price,desc";
        }

        // API dùng page 1-indexed, không phải 0-indexed
        const pageToSend = currentPage + 1;
        const response = await getProductCardListAPI(
          pageToSend,
          pageSize,
          sortParam
        );
        console.log("API Response (page:", pageToSend, "):", response);

        if (response?.data) {
          const backendRes = response.data;
          console.log("Backend Response:", backendRes);

          const paginatedData = backendRes.data;
          console.log("Paginated Data:", paginatedData);

          const productList = (paginatedData?.result || []).map(
            (p: IProductCard) => ({
              ...p,
            })
          );
          const pages = paginatedData?.meta?.pages || 0;

          console.log("Product List:", productList, "Total Pages:", pages);

          // Log chi tiết sản phẩm đầu tiên
          if (productList.length > 0) {
            console.log("First product:", productList[0]);
          }

          setProducts(productList);
          setTotalPages(pages);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize, sortOption]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product: IProductCard) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  // Xác nhận thêm vào giỏ hàng
  const handleConfirmAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      console.log(
        "Adding to cart:",
        selectedProduct.name,
        "Quantity:",
        quantity
      );

      // Giữ nguyên giá backend trả về (price = giá gốc)
      // Không tính giảm lại ở đây
      const productWithOriginalPrice = {
        ...selectedProduct,
        originalPrice: selectedProduct.price, // giá gốc
      };

      addToCart(productWithOriginalPrice, quantity);
      setSelectedProduct(null);
      setQuantity(1);
      showToast(
        `Đã thêm ${quantity} sản phẩm "${selectedProduct.name}" vào giỏ hàng!`,
        "success",
        3000
      );
    }
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0); // Reset về trang đầu khi đổi sắp xếp
  };

  // Xử lý nhập trang
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber - 1); // Chuyển từ 1-indexed sang 0-indexed
      setPageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  return (
    <div className="w-full">
      {/* Dialog chọn số lượng */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Chọn số lượng</h2>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Sản phẩm: <strong>{selectedProduct.name}</strong>
              </p>
              <p className="text-gray-700 mb-4">
                Giá:{" "}
                <strong className="text-red-500">
                  {selectedProduct.price.toLocaleString()}₫
                </strong>
              </p>
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Số lượng:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center py-2 border-l border-r border-gray-300 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header (Tiêu đề và Sắp xếp) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Tất cả sản phẩm</h2>
        <SortDropdown onSortChange={handleSortChange} />
      </div>

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
            discount={{ id: 1, type: "percent", value: 20 }}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-8 space-y-4">
          {/* Phần điều hướng trang */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap px-2">
            {/* Nút Previous */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <span className="hidden sm:inline">← Trước</span>
              <span className="sm:hidden">←</span>
            </button>

            {/* Trang đầu */}
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => setCurrentPage(0)}
                  className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  1
                </button>
                {currentPage > 3 && (
                  <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Các trang xung quanh trang hiện tại */}
            {Array.from({ length: totalPages }).map((_, index) => {
              // Mobile: chỉ hiển thị 1 trang trước, trang hiện tại, và 1 trang sau
              // Desktop: hiển thị 2 trang trước, trang hiện tại, và 2 trang sau
              const mobileRange =
                index >= currentPage - 1 && index <= currentPage + 1;
              const desktopRange =
                index >= currentPage - 2 && index <= currentPage + 2;

              if (mobileRange || desktopRange) {
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`px-2.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      currentPage === index
                        ? "bg-green-600 text-white shadow-sm"
                        : "border border-gray-300 hover:bg-gray-50"
                    } ${!mobileRange ? "hidden sm:inline-block" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              }
              return null;
            })}

            {/* Trang cuối */}
            {currentPage < totalPages - 3 && (
              <>
                {currentPage < totalPages - 4 && (
                  <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">
                    ...
                  </span>
                )}
                <button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Nút Next */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <span className="hidden sm:inline">Sau →</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>

          {/* Phần nhập trang */}
          <div className="flex justify-center items-center gap-2 px-2">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Đến trang:
            </span>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`1-${totalPages}`}
              className="w-16 sm:w-20 px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleGoToPage}
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Đi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRight;
