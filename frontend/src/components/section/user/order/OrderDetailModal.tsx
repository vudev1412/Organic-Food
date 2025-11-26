// File path: /src/components/section/user/order/OrderDetailModal.tsx
// File: OrderDetailModal.tsx

export default function OrderDetailModal({ order, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 animate-fadeIn border border-green-100">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Chi tiết đơn hàng
        </h2>

        <div className="space-y-3">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span className="text-gray-700">
                {item.name} × {item.qty}
              </span>
              <span className="font-semibold text-green-700">
                {item.price.toLocaleString()}đ
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-5 text-lg font-bold text-green-800">
          <span>Tổng tiền:</span>
          <span>{order.total.toLocaleString()}đ</span>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
