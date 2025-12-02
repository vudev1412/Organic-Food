import React, { useState } from "react";
import SortDropdown from "./SortDropdown";
import { formatCategoryName } from "../../../utils/format";
import { Filter, RotateCcw } from "lucide-react";

interface ProductListHeaderProps {
  onSortChange: (sortOption: string) => void;
  onFilterPrice?: (min: number | undefined, max: number | undefined) => void;
  tilte: string;
}

const ProductListHeader = ({
  onSortChange,
  onFilterPrice,
  tilte,
}: ProductListHeaderProps) => {
  // State nội bộ cho input giá
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  // State để reset component con SortDropdown (bằng cách thay đổi key)
  const [sortResetKey, setSortResetKey] = useState(0);

  // Xử lý thay đổi input: Chặn số âm
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || Number(value) >= 0) {
        setter(value);
        setError(""); // Xóa lỗi khi người dùng sửa
      }
    };

  const handleApplyFilter = () => {
    setError("");
    if (onFilterPrice) {
      const min = minPrice ? Number(minPrice) : undefined;
      const max = maxPrice ? Number(maxPrice) : undefined;

      // Validate logic
      if (min !== undefined && max !== undefined && min >= max) {
        setError("Giá tối đa phải lớn hơn tối thiểu");
        return;
      }

      onFilterPrice(min, max);
    }
  };

  const handleClearAll = () => {
    // Reset state nội bộ
    setMinPrice("");
    setMaxPrice("");
    setError("");

    // Gọi hàm reset lên cha
    if (onFilterPrice) onFilterPrice(undefined, undefined);
    onSortChange("default");

    // Force re-render SortDropdown về mặc định
    setSortResetKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-5 mb-8">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {formatCategoryName(tilte)}
          <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Sản phẩm
          </span>
        </h2>
      </div>

      {/* Toolbar: Bộ lọc giá & Sắp xếp */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        {/* Khu vực Lọc giá */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mr-2">
              <Filter size={16} />
              <span className="hidden sm:inline">Lọc giá:</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={handleInputChange(setMinPrice)}
                min="0"
                className={`w-24 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#3A5B22] focus:ring-[#3A5B22]"
                }`}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={handleInputChange(setMaxPrice)}
                min="0"
                className={`w-24 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#3A5B22] focus:ring-[#3A5B22]"
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-[#3A5B22] text-white text-sm font-medium rounded-lg hover:bg-[#2f4a1c] transition-colors shadow-sm active:scale-95 whitespace-nowrap"
              >
                Áp dụng
              </button>

              {/* Nút Hủy Lọc */}
              {(minPrice || maxPrice) && (
                <button
                  onClick={handleClearAll}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger"
                  title="Hủy lọc & sắp xếp"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <span className="text-xs text-red-500 font-medium ml-[85px] animate-fade-in">
              {error}
            </span>
          )}
        </div>

        {/* Khu vực Sắp xếp */}
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Sắp xếp theo:
          </span>
          <SortDropdown key={sortResetKey} onSortChange={onSortChange} />
        </div>
      </div>
    </div>
  );
};

export default ProductListHeader;
