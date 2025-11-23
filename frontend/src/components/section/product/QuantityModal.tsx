import { useState, useEffect } from "react";

interface QuantityModalProps {
  product: IProductCard | null;
  discount?: IDiscount;
  onClose: () => void;
  onConfirm: (
    product: IProductCard,
    quantity: number,
    discount?: IDiscount
  ) => void;
}

const QuantityModal = ({
  product,
  discount,
  onClose,
  onConfirm,
}: QuantityModalProps) => {
  // Cho phép state là string để xử lý trường hợp người dùng xóa trắng ô input
  const [quantity, setQuantity] = useState<number | string>(1);
  const [error, setError] = useState("");

  // Reset số lượng về 1 mỗi khi mở modal cho sản phẩm mới
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setError("");
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const type = discount?.type?.toUpperCase();

  const discountedPrice =
    // Kiểm tra discount có tồn tại không trước
    discount && type === "PERCENT"
      ? product.price * (1 - discount.value / 100)
      : discount && type === "FIXED_AMOUNT"
      ? product.price - discount.value
      : product.price;
  // Kiểm tra số lượng tối đa có sẵn
  const maxAvailable = product.quantity ?? 0;
  const isOutOfStock = maxAvailable === 0;

  // Hàm xử lý khi người dùng nhập trực tiếp vào ô input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 1. Cho phép xóa trắng ô input (trải nghiệm người dùng tốt hơn)
    if (inputValue === "") {
      setQuantity("");
      setError("");
      return;
    }

    // 2. Chỉ cho phép nhập số
    const parsedValue = parseInt(inputValue);
    if (isNaN(parsedValue)) return;

    // 3. Kiểm tra giới hạn tồn kho ngay khi nhập
    if (parsedValue > maxAvailable) {
      setQuantity(maxAvailable);
      setError(`Chỉ còn ${maxAvailable} sản phẩm sẵn có`);
    } else {
      setQuantity(parsedValue);
      setError("");
    }
  };

  // Hàm xử lý khi người dùng click chuột ra ngoài ô input (Blur)
  const handleBlur = () => {
    const finalValue =
      typeof quantity === "string" ? parseInt(quantity) : quantity;

    // Nếu ô trống hoặc số <= 0 hoặc NaN, reset về 1
    if (!finalValue || finalValue < 1) {
      setQuantity(1);
      setError("");
    }
    // Logic check maxAvailable đã có ở onChange, nhưng check lại cho chắc
    else if (finalValue > maxAvailable) {
      setQuantity(maxAvailable);
      setError(`Chỉ còn ${maxAvailable} sản phẩm có sẵn`);
    }
  };

  // Hàm tăng giảm số lượng bằng nút bấm
  const handleButtonClick = (delta: number) => {
    const currentQty =
      typeof quantity === "string" ? parseInt(quantity) || 0 : quantity;
    const newQty = currentQty + delta;

    if (newQty < 1) return;

    if (newQty > maxAvailable) {
      setError(`Chỉ còn ${maxAvailable} sản phẩm có sẵn`);
      return;
    }

    setQuantity(newQty);
    setError("");
  };

  const handleConfirm = () => {
    if (isOutOfStock) {
      setError("Sản phẩm này đã hết hàng");
      return;
    }

    // Chuyển đổi chắc chắn về number trước khi confirm
    const finalQty =
      typeof quantity === "string" ? parseInt(quantity) || 1 : quantity;

    if (finalQty > maxAvailable) {
      setError(`Chỉ có thể mua tối đa ${maxAvailable} sản phẩm`);
      return;
    }

    if (finalQty < 1) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    onConfirm(product, finalQty, discount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Chọn số lượng</h2>

        {isOutOfStock && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ❌ Sản phẩm này đã hết hàng
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Sản phẩm: <strong>{product.name}</strong>
          </p>
          <div className="mb-2">
            Giá:{" "}
            {discount ? (
              <>
                <span className="text-gray-400 line-through mr-2 text-sm">
                  {product.price.toLocaleString()}₫
                </span>
                <strong className="text-red-500 text-xl">
                  {discountedPrice.toLocaleString()}₫
                </strong>
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  {type === "PERCENT"
                    ? `-${discount.value}%`
                    : `-${discount.value / 1000}k`}
                </span>
              </>
            ) : (
              <strong className="text-red-500">
                {product.price.toLocaleString()}₫
              </strong>
            )}
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Còn lại:{" "}
            <strong
              className={maxAvailable > 0 ? "text-green-600" : "text-red-600"}
            >
              {maxAvailable} sản phẩm
            </strong>
          </p>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Số lượng:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleButtonClick(-1)}
                disabled={
                  isOutOfStock ||
                  (typeof quantity === "number" && quantity <= 1)
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isOutOfStock}
                className="w-16 text-center py-2 border-l border-r border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleButtonClick(1)}
                disabled={
                  isOutOfStock ||
                  (typeof quantity === "number" && quantity >= maxAvailable)
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isOutOfStock}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
