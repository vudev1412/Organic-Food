import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface CertificationModalProps {
  certification: ICertification | null;
  onClose: () => void;
}

const CertificationModal: React.FC<CertificationModalProps> = ({
  certification,
  onClose,
}) => {
  if (!certification) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full relative transform transition-all"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h3 className="text-3xl font-bold mb-6 pr-10">
          {certification.name}
        </h3>
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <img
            src={certification.imageUrl}
            alt={certification.name}
            className="w-full h-64 object-contain"
          />
        </div>
        <p className="text-gray-700 leading-relaxed">
          {certification.description}
        </p>
      </div>
    </div>
  );
};

export default CertificationModal;