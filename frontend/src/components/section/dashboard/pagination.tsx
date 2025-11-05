import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-end items-center mt-6">
      <span className="text-sm text-gray-600 mr-4">
        Hiển thị {startItem}-{endItem} trên {totalItems}
      </span>

      <div className="flex space-x-1">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Trang kế"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
