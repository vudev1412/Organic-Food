// File path: /src/components/section/product/Pagination.tsx

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState("");

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber - 1);
      setPageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGoToPage();
  };

  // --- Render các nút trang (3 trang quanh currentPage) ---
  const renderPageButtons = () => {
    const buttons = [];
    const start = Math.max(0, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let index = start; index <= end; index++) {
      buttons.push(
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`px-2.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            currentPage === index
              ? "bg-green-600 text-white shadow-sm"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {index + 1}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Thanh điều hướng */}
      <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap px-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="h-9 px-3 flex items-center gap-1 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Trang đầu */}
        {currentPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {currentPage > 2 && (
              <span className="px-1 sm:px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Trang giữa */}
        {renderPageButtons()}

        {/* Trang cuối */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-1 sm:px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="h-9 px-3 flex items-center gap-1 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Input chuyển trang */}
      <div className="flex justify-center items-center gap-2 px-2">
        <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
          Trang
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
          Chuyển
        </button>
      </div>
    </div>
  );
};

export default Pagination;
