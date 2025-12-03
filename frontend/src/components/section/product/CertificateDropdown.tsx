import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getCertificatesAPI } from "../../../service/api"; // Import API mới

interface CertificateDropdownProps {
  onCertificateChange: (selectedIds: number[]) => void;
  selectedIds: number[];
}

const CertificateDropdown = ({
  onCertificateChange,
  selectedIds,
}: CertificateDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy URL gốc từ biến môi trường
  const BASE_IMAGE_URL = import.meta.env.VITE_BACKEND_CERS_IMAGE_URL;

  // Gọi API lấy danh sách chứng chỉ khi mount
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getCertificatesAPI();
        if (res && res.data) {
          // Tùy thuộc vào cấu trúc response thực tế của axios interceptor
          // Nếu response trả về trực tiếp data: res.data
          // Nếu response trả về full object: res.data.data
          // Dựa trên JSON bạn cung cấp:
          const data = res.data.data ? res.data.data : res.data;
          setCertificates(data);
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };
    fetchCertificates();
  }, []);

  const handleToggle = (id: number) => {
    let newSelected: number[];
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((item) => item !== id);
    } else {
      newSelected = [...selectedIds, id];
    }
    onCertificateChange(newSelected);
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

  const selectedCount = selectedIds.length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between min-w-[140px] px-3 py-2 border rounded-lg shadow-sm focus:outline-none transition-all text-sm font-medium ${
          selectedCount > 0
            ? "bg-[#3A5B22]/10 border-[#3A5B22] text-[#3A5B22]"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedCount > 0 ? `Chứng chỉ (${selectedCount})` : "Chứng chỉ"}
        </span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 w-64 mt-2 origin-top-left bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 animate-fade-in max-h-80 overflow-y-auto">
          <div className="p-2 space-y-1">
            {certificates.length > 0 ? (
              certificates.map((cert) => {
                const isSelected = selectedIds.includes(cert.id);
                // Xử lý URL ảnh: đảm bảo không bị double dấu gạch chéo nếu env có sẵn /
                const imgUrl = `${BASE_IMAGE_URL}${cert.image}`;

                return (
                  <div
                    key={cert.id}
                    className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleToggle(cert.id)}
                  >
                    {/* Checkbox Icon */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                        isSelected
                          ? "bg-[#3A5B22] border-[#3A5B22]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>

                    {/* Image */}
                    <img
                      src={imgUrl}
                      alt={cert.name}
                      className="w-8 h-8 object-contain mr-3"
                      onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />

                    {/* Name */}
                    <span
                      className={`text-sm truncate ${
                        isSelected
                          ? "text-[#3A5B22] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {cert.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                Đang tải...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDropdown;
