// File path: /src/components/section/product/SortDropdown.tsx

import React, { useState } from "react";
import ChevronDownIcon from "./ChevronDownIcon"; // Giả sử icon ở cùng thư mục

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
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" // Tăng z-index nếu cần
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

export default SortDropdown;
