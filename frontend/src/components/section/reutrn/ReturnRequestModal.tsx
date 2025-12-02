import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import {
  createReturnRequestAPI,
  uploadReturnFileAPI,
} from "../../../service/api";
import { CurrentAppContext } from "../../context/app.context"; // ⚠️ Hãy kiểm tra lại đường dẫn import này cho đúng project của bạn
import { formatOrderCode } from "../../../utils/format";

// --- INTERFACES ---
interface IReturnModalProps {
  order: IOrder | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IOrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  image?: string; // (Optional) Nếu API có trả về ảnh sản phẩm thì UI sẽ đẹp hơn
}

interface IOrder {
  id: number;
  orderDetails?: IOrderDetail[];
}

interface ISelectedItemState {
  productId: number;
  productName: string;
  quantity: number;
  maxQuantity: number;
  isSelected: boolean;
}

const ReturnRequestModal = ({
  order,
  visible,
  onClose,
  onSuccess,
}: IReturnModalProps) => {
  // ✅ 1. LẤY showToast TỪ CONTEXT
  const { showToast } = useContext(CurrentAppContext);
  const BASE_URL = import.meta.env.VITE_BACKEND_RETURNS_IMAGE_URL;

  const [returnItems, setReturnItems] = useState<ISelectedItemState[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [returnType, setReturnType] = useState<"REFUND" | "EXCHANGE">("REFUND");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- INIT DATA ---
  useEffect(() => {
    if (order && order.orderDetails) {
      const initialItems: ISelectedItemState[] = order.orderDetails.map(
        (item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          maxQuantity: item.quantity,
          isSelected: false,
        })
      );
      setReturnItems(initialItems);
      // Reset form
      setReason("");
      setImageUrls([]);
      setReturnType("REFUND");
    }
  }, [order, visible]);

  if (!order || !visible) return null;

  // --- HANDLERS ---

  const handleToggleSelect = (productId: number) => {
    setReturnItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const handleChangeQuantity = (
    productId: number,
    delta: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Ngăn click lan ra cha (checkbox)
    setReturnItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + delta;
          // Validate range
          if (newQuantity < 1 || newQuantity > item.maxQuantity) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const selectedCount = useMemo(() => {
    return returnItems.filter((item) => item.isSelected).length;
  }, [returnItems]);

  // --- FILE UPLOAD ---
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 🔥 Giới hạn 10 ảnh
    if (imageUrls.length >= 10) {
      showToast("Bạn chỉ được tải lên tối đa 10 ảnh!", "warning");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Chỉ được phép tải lên hình ảnh.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Kích thước file quá lớn. Tối đa 5MB.", "error");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadReturnFileAPI(file, "images/returns");

      const fileName =
        typeof res.data === "string" ? res.data : res.data?.url || res.data;

      if (fileName) {
        setImageUrls((prev) => [...prev, fileName]);
        showToast(`Đã tải ảnh lên thành công.`, "success");
      } else {
        showToast("Không lấy được đường dẫn ảnh.", "error");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Tải ảnh thất bại.";
      showToast(errorMessage, "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (selectedCount === 0) {
      showToast("Vui lòng chọn ít nhất 1 sản phẩm", "warning");
      return;
    }
    if (!reason.trim()) {
      showToast("Vui lòng nhập lý do đổi trả", "warning");
      return;
    }

    const items = returnItems
      .filter((item) => item.isSelected)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        note: "",
      }));

    try {
      setLoading(true);
      const res = await createReturnRequestAPI({
        orderId: order.id,
        reason,
        returnType,
        items,
        imageUrls,
      });

      if (res && (res.status >= 400 || res.error)) {
        const msg = res.message || res.data?.message || "Có lỗi xảy ra";
        showToast(msg, "error");
        return;
      }

      showToast("Gửi yêu cầu thành công!", "success");
      onClose();
      onSuccess();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || error.message || "Lỗi server";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER UI ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Yêu cầu Đổi / Trả
            </h2>
            <p className="text-sm text-gray-500">
              Đơn hàng{" "}
              <span className="text-green-600 font-bold">
                {formatOrderCode(order.id)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* BODY - SCROLLABLE */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* SECTION 1: PRODUCT LIST */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                1
              </span>
              Chọn sản phẩm
            </h3>
            <div className="space-y-3">
              {returnItems.map((item) => (
                <div
                  key={item.productId}
                  onClick={() => handleToggleSelect(item.productId)}
                  className={`
                    relative flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer select-none
                    ${
                      item.isSelected
                        ? "border-green-500 bg-green-50/50 shadow-sm"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`
                    w-5 h-5 rounded flex items-center justify-center mr-4 transition-colors border
                    ${
                      item.isSelected
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-300"
                    }
                  `}
                  >
                    {item.isSelected && (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        item.isSelected ? "text-green-900" : "text-gray-700"
                      }`}
                    >
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Đã mua: {item.maxQuantity}
                    </p>
                  </div>

                  {/* Quantity Control (Chỉ hiện khi chọn) */}
                  {item.isSelected && (
                    <div
                      className="flex items-center gap-1 bg-white border border-green-200 rounded-lg shadow-sm px-1 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) =>
                          handleChangeQuantity(item.productId, -1, e)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) =>
                          handleChangeQuantity(item.productId, 1, e)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: RETURN TYPE */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                2
              </span>
              Phương thức
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Radio Option 1 */}
              <div
                onClick={() => setReturnType("REFUND")}
                className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3
                  ${
                    returnType === "REFUND"
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-100 hover:border-gray-200"
                  }
                `}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    returnType === "REFUND"
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {returnType === "REFUND" && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Hoàn tiền (Refund)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Nhận lại tiền về tài khoản ngân hàng hoặc ví.
                  </p>
                </div>
              </div>

              {/* Radio Option 2 */}
              <div
                onClick={() => setReturnType("EXCHANGE")}
                className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3
                  ${
                    returnType === "EXCHANGE"
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-100 hover:border-gray-200"
                  }
                `}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    returnType === "EXCHANGE"
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {returnType === "EXCHANGE" && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Đổi sản phẩm
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đổi sang sản phẩm mới tương tự nếu có lỗi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: REASON & IMAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reason Input */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                  3
                </span>
                Lý do
              </h3>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Vui lòng mô tả chi tiết vấn đề (ví dụ: sản phẩm bị rách, sai màu, hư hỏng do vận chuyển...)"
                className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none bg-gray-50"
              />
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                  4
                </span>
                Hình ảnh ({imageUrls.length})
              </h3>

              <div className="flex flex-wrap gap-3">
                {/* Upload Button */}
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 flex flex-col items-center justify-center cursor-pointer transition-all group
                  ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                >
                  {isUploading ? (
                    <svg
                      className="animate-spin h-6 w-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 text-gray-400 group-hover:text-green-600 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span className="text-[10px] text-gray-500 font-medium group-hover:text-green-600">
                        Thêm ảnh
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Preview Images */}
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={`${BASE_URL}${url}`}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveImage(url)}
                        className="p-1 rounded-full bg-white/20 hover:bg-red-500 text-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || isUploading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi...
              </>
            ) : (
              "Gửi yêu cầu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
