import React, { useState } from "react";

// --- Props Interface ---
interface ProductSearchProps {
  onSearch: (searchTerm: string) => void;
}

/**
 * Component thanh tìm kiếm sản phẩm.
 * Quản lý state của ô input và gọi hàm onSearch khi submit.
 */
const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div role="search">
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
    </div>
  );
};

export default ProductSearch;