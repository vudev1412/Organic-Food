import React, { useState, useEffect } from "react";
// import { IProductCard } from "../../../types";

interface QuantityModalProps {
  product: IProductCard | null;
  onClose: () => void;
  onConfirm: (product: IProductCard, quantity: number) => void;
}

const QuantityModal = ({
  product,
  onClose,
  onConfirm,
}: QuantityModalProps) => {
  const [quantity, setQuantity] = useState(1);

  // Reset số lượng về 1 mỗi khi mở modal cho sản phẩm mới
  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(product, quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Chọn số lượng</h2>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Sản phẩm: <strong>{product.name}</strong>
          </p>
          <p className="text-gray-700 mb-4">
            Giá:{" "}
            <strong className="text-red-500">
              {product.price.toLocaleString()}₫
            </strong>
          </p>
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Số lượng:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center py-2 border-l border-r border-gray-300 focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;