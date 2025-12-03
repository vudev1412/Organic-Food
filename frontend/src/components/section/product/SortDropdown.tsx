import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SortDropdownProps {
  onSortChange: (sortOption: string) => void;
}

const SortDropdown = ({ onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mặc định");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Mặc định", value: "default" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao đến thấp", value: "price_desc" },
    { label: "Tên A-Z", value: "name_asc" },
  ];

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSortChange(option.value);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-[180px] px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3A5B22]/20 transition-all text-sm font-medium text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption}</span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-full mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`block w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  selectedOption === option.label
                    ? "bg-[#3A5B22]/10 text-[#3A5B22] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
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
