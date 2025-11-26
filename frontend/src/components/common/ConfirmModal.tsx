// File path: /src/components/common/ConfirmModal.tsx

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Hành động này không thể hoàn tác.",
  confirmText = "Xóa ngay",
  cancelText = "Hủy bỏ",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-md p-0 rounded-2xl shadow-2xl transform transition-all animate-fade-in-up">
          {/* Close button absolute */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6 text-center">
            {/* Icon cảnh báo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6 animate-pulse-slow">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all w-1/2 shadow-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-all w-1/2 flex justify-center items-center gap-2 transform active:scale-95"
              >
                <Trash2 size={18} />
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
