import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProductsAPI } from "../../../service/api";

// --- Props Interface ---
interface ProductSearchProps {
  onSearch: (searchTerm: string) => void;
}

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
}

/**
 * Component thanh tìm kiếm sản phẩm.
 * Quản lý state của ô input và gọi hàm onSearch khi submit.
 */
const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Gọi API tìm kiếm khi nhập
    if (value.trim().length > 0) {
      handleSearch(value);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearch = async (term: string) => {
    try {
      setIsLoading(true);
      const filterValue = `name~'${term}'`;
      const encodedFilter = encodeURIComponent(filterValue);
      const query = `filter=${encodedFilter}&size=10`;
      const response = await searchProductsAPI(query);

      if (response?.data?.data?.result) {
        setSearchResults(response.data.data.result);
        setShowResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleResultClick = (product: SearchResult) => {
    navigate(`/san-pham/${product.slug}`, { state: { productId: product.id } });
    setSearchTerm("");
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div role="search" className="relative w-auto">
      <label htmlFor="product-search" className="sr-only">
        Tìm kiếm sản phẩm
      </label>
      <div className="flex items-center w-full rounded-full border border-gray-300 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-green-500 transition-all">
        <input
          type="text"
          id="product-search"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 px-5 py-2.5 outline-none text-gray-700 bg-transparent text-sm"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="text-gray-400 hover:text-green-600 transition-colors w-12 h-10 flex items-center justify-center"
          aria-label="Tìm kiếm"
        >
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
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown kết quả tìm kiếm */}
      {showResults && searchTerm.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Đang tìm kiếm...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={
                      product.image
                        ? `http://localhost:8080/storage/images/products/${product.image}`
                        : "https://placehold.co/50x50/a0e0a0/333"
                    }
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-red-500 font-semibold">
                      {product.price.toLocaleString()}₫
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
