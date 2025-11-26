// File path: /src/components/section/dashboard/filter.bar.tsx

import React from "react";
import { Search, Plus } from "lucide-react";

interface FilterBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  buttonText?: string;
  onButtonClick?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  placeholder = "Tìm kiếm...",
  onChange,
  buttonText = "Thêm",
  onButtonClick,
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Ô tìm kiếm */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ">
          <Search size={20} />
        </div>
      </div>

      {/* Nút thêm */}
      <div className="bg-green-500 hover:bg-green-900 rounded-xl">
        <button
          onClick={onButtonClick}
          className="flex items-center justify-center gap-2 px-2 py-2  text-white    transition-colors duration-150"
        >
          <Plus size={18} />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
