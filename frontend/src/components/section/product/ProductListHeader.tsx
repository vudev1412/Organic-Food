import React, { useState } from "react";
import SortDropdown from "./SortDropdown";
// Import component mới
import CertificateDropdown from "./CertificateDropdown";
import { formatCategoryName } from "../../../utils/format";
import { Filter, RotateCcw } from "lucide-react";

interface ProductListHeaderProps {
  onSortChange: (sortOption: string) => void;
  onFilterPrice?: (min: number | undefined, max: number | undefined) => void;
  // Prop mới cho lọc chứng chỉ
  onFilterCertificate?: (ids: number[]) => void;
  tilte: string;
}

const ProductListHeader = ({
  onSortChange,
  onFilterPrice,
  onFilterCertificate,
  tilte,
}: ProductListHeaderProps) => {
  // State nội bộ cho input giá
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  // State nội bộ cho chứng chỉ
  const [selectedCertIds, setSelectedCertIds] = useState<number[]>([]);

  // State để reset component con (bằng cách thay đổi key)
  const [resetKey, setResetKey] = useState(0);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || Number(value) >= 0) {
        setter(value);
        setError("");
      }
    };

  const handleApplyFilter = () => {
    setError("");
    if (onFilterPrice) {
      const min = minPrice ? Number(minPrice) : undefined;
      const max = maxPrice ? Number(maxPrice) : undefined;

      if (min !== undefined && max !== undefined && min >= max) {
        setError("Giá tối đa phải lớn hơn tối thiểu");
        return;
      }
      onFilterPrice(min, max);
    }

    // Áp dụng lọc chứng chỉ
    if (onFilterCertificate) {
      onFilterCertificate(selectedCertIds);
    }
  };

  const handleCertificateChange = (ids: number[]) => {
    setSelectedCertIds(ids);
    // Tùy chọn: Có thể gọi lọc ngay lập tức hoặc đợi bấm nút "Áp dụng"
    // Ở đây tôi chọn đợi bấm "Áp dụng" để đồng bộ với Giá
  };

  const handleClearAll = () => {
    // Reset state nội bộ
    setMinPrice("");
    setMaxPrice("");
    setError("");
    setSelectedCertIds([]);

    // Gọi hàm reset lên cha
    if (onFilterPrice) onFilterPrice(undefined, undefined);
    if (onFilterCertificate) onFilterCertificate([]);
    onSortChange("default");

    // Force re-render các dropdown
    setResetKey((prev) => prev + 1);
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

      {/* Toolbar: Bộ lọc giá & Sắp xếp & Chứng chỉ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        {/* Khu vực Lọc */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mr-1">
              <Filter size={16} />
              <span className="hidden sm:inline">Bộ lọc:</span>
            </div>

            {/* Input Giá */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={handleInputChange(setMinPrice)}
                min="0"
                className={`w-20 sm:w-24 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
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
                className={`w-20 sm:w-24 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#3A5B22] focus:ring-[#3A5B22]"
                }`}
              />
            </div>

            {/* Dropdown Chứng chỉ */}
            <CertificateDropdown
              key={`cert-${resetKey}`}
              selectedIds={selectedCertIds}
              onCertificateChange={handleCertificateChange}
            />

            {/* Nút Action */}
            <div className="flex items-center gap-2 ml-1">
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-[#3A5B22] text-white text-sm font-medium rounded-lg hover:bg-[#2f4a1c] transition-colors shadow-sm active:scale-95 whitespace-nowrap"
              >
                Áp dụng
              </button>

              {(minPrice || maxPrice || selectedCertIds.length > 0) && (
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

          {error && (
            <span className="text-xs text-red-500 font-medium ml-[80px] animate-fade-in">
              {error}
            </span>
          )}
        </div>

        {/* Khu vực Sắp xếp */}
        <div className="flex items-center justify-end gap-3 mt-2 xl:mt-0">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Sắp xếp:
          </span>
          <SortDropdown key={`sort-${resetKey}`} onSortChange={onSortChange} />
        </div>
      </div>
    </div>
  );
};

export default ProductListHeader;
