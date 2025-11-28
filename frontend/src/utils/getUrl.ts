/**
 * Xây dựng URL hình ảnh sản phẩm.
 * @param fileName Tên file ảnh (ví dụ: "ruou-vang-chateau.png")
 * @returns URL hình ảnh hoàn chỉnh
 */
export const getImageURL = (fileName: string): string => {
    // Đảm bảo biến môi trường đã được định nghĩa trong file .env và import.meta.env
    const baseUrl = import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL || "http://localhost:8080/images/products/"; 
    
    // Xử lý dấu "/" để đảm bảo URL đúng định dạng
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    
    return `${normalizedBaseUrl}${fileName}`;
};