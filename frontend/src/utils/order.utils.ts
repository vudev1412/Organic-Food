// === ENUM ===
export enum StatusOrder {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// === HELPER ===
export const isWithinReturnPeriod = (order: IOrder): boolean => {
  if (order.statusOrder !== StatusOrder.DELIVERED || !order.actualDate) {
    return false;
  }
  const actualDate = new Date(order.actualDate);
  const today = new Date();

  if (isNaN(actualDate.getTime())) return false;

  const timeDifference = today.getTime() - actualDate.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  return dayDifference >= 0 && dayDifference <= 7;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const calculateOrderTotal = (
  items: IOrderDetail[] | null | undefined
) => {
  // Kiểm tra kỹ: nếu items là null, undefined hoặc không phải mảng thì trả về 0 ngay
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  return items.reduce((sum, item) => sum + (item?.price || 0), 0);
};
export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Giao thành công",
    CANCELLED: "Đã hủy",
  };
  return map[status] || status;
};

export const getStatusStyles = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPING: "bg-indigo-100 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-300",
  };
  return map[status] || "bg-gray-100 text-gray-600 border-gray-200";
};
