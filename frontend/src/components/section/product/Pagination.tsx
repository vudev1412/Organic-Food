import React, { useState } from "react";

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
      onPageChange(pageNumber - 1); // Chuyển sang 0-indexed
      setPageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  // --- Logic render các nút trang ---
  const renderPageButtons = () => {
    const buttons = [];
    for (let index = 0; index < totalPages; index++) {
      const mobileRange = index >= currentPage - 1 && index <= currentPage + 1;
      const desktopRange = index >= currentPage - 2 && index <= currentPage + 2;

      if (mobileRange || desktopRange) {
        buttons.push(
          <button
            key={index}
            onClick={() => onPageChange(index)}
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
    }
    return buttons;
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Phần điều hướng trang */}
      <div className="flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap px-2">
        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
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
              onClick={() => onPageChange(0)}
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

        {/* Các trang xung quanh */}
        {renderPageButtons()}

        {/* Trang cuối */}
        {currentPage < totalPages - 3 && (
          <>
            {currentPage < totalPages - 4 && (
              <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="px-2.5 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
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
  );
};

export default Pagination;