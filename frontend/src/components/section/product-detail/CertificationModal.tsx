// File path: /src/components/section/product-detail/CertificationModal.tsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCertificate,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Giao diện đã được thêm vào đây để Modal hoạt động độc lập hơn
interface ICertification {
  id: number;
  name: string;
  logo: string;
  imageUrl: string; // Đường dẫn đến ảnh chi tiết chứng chỉ
  description: string;
}

interface CertificationModalProps {
  certification: ICertification | null;
  onClose: () => void;
}

const CertificationModal: React.FC<CertificationModalProps> = ({
  certification,
  onClose,
}) => {
  // KHẮC PHỤC LỖI: Gọi Hooks ở cấp cao nhất
  const navigate = useNavigate();

  if (!certification) return null;

  const handleNavigateToCertsPage = () => {
    onClose(); // Đóng modal trước khi điều hướng
    navigate("/chung-chi"); // Giả định đường dẫn trang chứng chỉ chung
  };

  return (
    <div
      // Backdrop
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        // Modal Content - Đã thay đổi max-w-2xl thành max-w-4xl và thêm flex-col/max-h
        className="bg-white rounded-2xl p-8 max-w-4xl w-full relative transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header/Title */}
        <h3 className="text-3xl font-bold mb-6 pr-10 flex items-center gap-3 text-green-700 border-b pb-4">
          <FontAwesomeIcon icon={faCertificate} className="text-4xl" />
          {certification.name}
        </h3>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Scrollable Body */}
        <div className="flex flex-col overflow-y-auto pr-2">
          <p className="text-gray-700 leading-relaxed mb-6 italic text-sm">
            {certification.description}
          </p>

          <h4 className="text-xl font-semibold mb-3 text-gray-800">
            Chi tiết văn bằng:
          </h4>

          {/* Image Container: Đảm bảo có scrollbar */}
          <div className="bg-gray-100 rounded-xl p-4 overflow-auto border border-dashed border-gray-300 mb-6">
            <img
              src={certification.imageUrl}
              alt={certification.name}
              // w-auto h-auto và min-w-full cho phép ảnh hiển thị kích thước tự nhiên và tạo scrollbar
              className="w-auto h-auto min-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x600/f87171/ffffff?text=Loi+Tai+Anh+Chi+Tiet";
                e.currentTarget.alt = `Lỗi tải ảnh chi tiết ${certification.name}`;
                e.currentTarget.className = "w-full h-auto object-contain"; // Trở về w-full nếu lỗi
              }}
            />
          </div>

          {/* NÚT: Tìm hiểu thêm (Sử dụng button với onClick) */}
          <button
            onClick={handleNavigateToCertsPage}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Tìm hiểu thêm về các Chứng chỉ của chúng tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificationModal;
