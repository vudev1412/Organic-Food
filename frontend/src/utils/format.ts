// File path: /src/utils/format.ts

export const formatCurrency = (amount: number | undefined | null): string => {
  // Nếu giá trị không hợp lệ, trả về 0 đ
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0 VNĐ";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatCategoryName = (name: string) => {
  if (!name) return "";

  let str = String(name).trim();
  if (str.length === 0) return "";

  str = str.toLowerCase();

  str = str.charAt(0).toUpperCase() + str.slice(1);

  str = str.replace(/\bviệt\b/g, "Việt");
  str = str.replace(/\bnam\b/g, "Nam");

  return str;
};
/**
 * Format ID thành mã đơn hàng (VD: 13 -> DH000013)
 * @param id - Số ID của đơn hàng
 * @param prefix - Tiền tố (mặc định là DH)
 * @param length - Độ dài phần số (mặc định là 6)
 */
export const formatOrderCode = (
  id: number | string,
  prefix: string = "DH",
  length: number = 6
): string => {
  if (!id) return "";
  return `${prefix}${id.toString().padStart(length, "0")}`;
};
