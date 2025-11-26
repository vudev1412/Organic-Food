// File path: /src/components/section/product/search.bar.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchProductsAPI } from "../../../service/api";

interface ProductSearchProps {
  onSearch: (searchTerm: string) => void;
}

const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IProductSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 0) handleSearch(value);
    else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleSearch = async (term: string) => {
    try {
      setIsLoading(true);
      setShowResults(true);
      const results = await searchProductsAPI(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    onSearch(searchTerm);
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleResultClick = (product: IProductSearchItem) => {
    navigate(`/san-pham/${product.slug}`, { state: { productId: product.id } });
    setSearchTerm("");
    setShowResults(false);
    setSearchResults([]);
  };

  const handleFocus = () => {
    if (searchTerm.trim().length > 0) setShowResults(true);
  };

  return (
    <div
      role="search"
      className="relative w-full max-w-lg mx-auto"
      ref={searchRef}
    >
      <label htmlFor="product-search" className="sr-only">
        Tìm kiếm sản phẩm
      </label>

      {/* Search Input Container */}
      <div
        className={`
        flex items-center w-full rounded-full 
        bg-white border transition-all duration-300 ease-in-out
        ${
          showResults && searchResults.length > 0
            ? "border-green-500 shadow-lg ring-2 ring-green-100"
            : "border-gray-200 shadow-sm hover:shadow-md hover:border-green-300"
        }
      `}
      >
        <div className="pl-4 text-gray-400 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          id="product-search"
          placeholder="Tìm sản phẩm..."
          className="flex-1 px-3 py-3 outline-none text-gray-700 bg-transparent text-sm font-medium placeholder:text-gray-400 min-w-0"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          autoComplete="off"
        />

        <div className="flex items-center pr-2 gap-1 flex-shrink-0">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 !rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              aria-label="Xóa tìm kiếm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-9 h-9 flex items-center justify-center bg-green-600 text-white !rounded-full hover:bg-green-700 active:scale-95 transition-all shadow-sm mx-1"
            aria-label="Tìm kiếm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Results */}
      {showResults && searchTerm.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-full">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center text-gray-500 gap-2">
              <div className="animate-spin !rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-xs">Đang tìm kiếm...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                Sản phẩm gợi ý
              </div>
              <div className="divide-y divide-gray-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-green-50/50 transition-colors text-left group box-border"
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-green-200 transition-colors">
                      <img
                        src={
                          product.image
                            ? `http://localhost:8080/storage/images/products/${product.image}`
                            : "https://placehold.co/50x50/e2e8f0/94a3b8?text=IMG"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info Container */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {/* Hàng 1: Tên sản phẩm */}
                      <p className="text-sm font-medium text-gray-700 group-hover:text-green-700 line-clamp-2 whitespace-normal leading-snug break-words">
                        {product.name}
                      </p>

                      {/* Hàng 2: Giá (Căn trái, xếp ngang hàng nhau cho gọn) */}
                      <div className="flex items-baseline gap-2">
                        {product.bestPromotion ? (
                          <>
                            {/* Giá giảm (Đỏ - Đậm) */}
                            <span className="text-sm font-bold text-red-600">
                              {product.bestPromotion.finalPrice.toLocaleString()}
                              ₫
                            </span>

                            {/* Giá gốc (Xám - Nhỏ hơn - Gạch ngang) */}
                            <span className="text-xs text-gray-400 line-through decoration-gray-300">
                              {product.bestPromotion.originalPrice.toLocaleString()}
                              ₫
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-green-600">
                            {product.price.toLocaleString()}₫
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center text-gray-500">
              <div className="w-12 h-12 bg-gray-100 !rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-sm">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
