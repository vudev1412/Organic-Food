export {};
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    statusCode: number | string;
    data?: T;
  }
  interface IModelPaginate<T> {
    data: {
      meta: {
        page: number;
        size: number;
        pages: number;
        total: number;
      };
      result: T[];
    };
  }

  interface ILogin {
    data: {
      access_token: string;
      userLogin: {
        id: number;
        email: string;
        name: string;
        role: string;
      };
    };
  }
  interface IUser {
    id: number;
    email: string;
    name: string;
    role: string;
  }
  interface IFetchAccount {
    data: {
      user: IUser;
    };
  }

  interface IDiscount {
    id?: number;
    type: "PERCENT" | "FIXED_AMOUNT";
    value: number;
  }
  interface IProductCard {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    discount?: IDiscount;
  }
  interface ICustomer {
    id: number;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
  }
  interface ICustomerTable {
    id: number;
    member: boolean;
    user: ICustomer;
  }
  interface IEmployee {
    id: number;
    employeeCode: string;
    address: string;
    hireDate: string;
    salary: number;
    user: ICustomer;
  }
  interface IRegister {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }
  interface IProduct {
    id: number;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    origin_address: string;
    description: string;
    rating_avg: number;
    slug: string | null;
    image?: string;
    active: boolean;
    mfgDate: Date;
    expDate: Date;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
    categoryId: number;
  }

  interface ICertificate {
    id: number;
    name: string;
    image: string;
  }
  interface IProductTable {
    imageUrl: string;
    certNo: string;
    date: string;
    product: IProduct;
    certificate: ICertificate;
  }
  export interface IOrder {
    id: number;
    orderAt: string;
    note?: string;
    statusOrder: string;
    shipAddress: string;
    estimatedDate?: string;
    actualDate?: string;
    userId?: number;
  }
  export interface IOrderDetailFull {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: IProduct;
    order: IOrder;
  }
  export interface ICreateOrderDetailDTO {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }
  interface ICertificate {
    id: number;
    name: string;
    image: string;
  }
  interface IProductTable {
    imageUrl: string;
    certNo: string;
    date: string;
    product: IProduct;
    certificate: ICertificate[];
  }

  interface ICreateCategoryDTO {
    name: string;
    slug: string;
    parentCategoryId?: number;
  }
  interface IUpdateCategoryDTO {
    name: string;
    slug: string;
    parentId?: number;
  }
  export interface ISupplier {
    id: number;
    name: string;
    code?: string;
    taxNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }
  export interface ICreateSupplierDTO {
    name: string;
    code?: string;
    taxNo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }

  interface ICustomerTable {
    id: number;
    email: string;
    name: string;
    phone: string;
  }
  interface ICategoryTable {
    id: number;
    name: string;
    slug: string;
    parentCategoryId?: number | null;
    parentName?: string | null;
  }

  interface ICategory {
    id: number;
    name: string;
    slug: string;
    parentCategory: ICategory | null;
  }
  interface IParentCategory {
    id: number;
    name: string;
    slug: string;
    parentCategory: ICategory | null;
  }

  interface ICartItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: IDiscount;
    quantity: number;
    maxQuantityAvailable: number; // Tối đa có thể mua (từ product.quantity)
  }
  /**
   * Interface cho chi tiết sản phẩm,
   * tương ứng với trường 'data' trong API response.
   */
  interface IProductDetail {
    id: number;
    name: string;
    unit: string;
    price: number;
    origin_address: string;
    description: string;
    rating_avg: number;
    quantity: number;
    slug: string;
    image: string; // Tên file ảnh
    active: boolean;
    mfgDate: string; // Ngày sản xuất (ISO date string, ví dụ: "2025-10-08T00:00:00Z")
    expDate: string; // Hạn sử dụng (ISO date string)
    createAt: string | null;
    updateAt: string | null;
    createBy: string | null;
    updateBy: string | null;
    categoryId: number;
  }
  // Định nghĩa cấu trúc chi tiết của mỗi chứng chỉ
  export interface ProductCertificateDetail {
    /** ID của chứng chỉ (lấy từ Certificate entity) */
    certificateId: number;

    /** Tên loại chứng chỉ (Ví dụ: EU Organic) */
    name: string;

    /** URL Logo/Hình ảnh chung của loại chứng chỉ */
    typeImageUrl: string;

    /** Số chứng nhận cụ thể được cấp cho sản phẩm */
    certNo: string;

    /** Ngày cấp/Ngày hết hạn chứng chỉ (chuỗi ISO 8601) */
    date: string;

    /** URL hình ảnh/file scan của chứng chỉ cụ thể */
    specificImageUrl: string;
  }
  interface IEmployeeProfile {
    data: {
      id: number;
      employeeCode: string;
      address: string;
      hireDate: string;
      salary: number;
      userId: id;
    };
  }
  interface ICustomerProfile {
    data: {
      id: number;
      member: boolean;
      userId: number;
    };
  }

  // Interface cho Chứng chỉ
  interface ICertification {
    id: number;
    name: string;
    logo: string;
    imageUrl: string;
    description: string;
  }

  // Interface cho Bình luận
  export interface IComment {
    user: string;
    rating: number;
    content: string;
    date?: string;
  }
  export interface IProductImage {
    id: number;
    img: string;
    product_id: number;
  }

  export interface IBestPromotion {
    id: number;
    promotionName: string;
    value: number;
    type: "PERCENT" | "FIXED_AMOUNT";
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    endDate: string;
  }

  // Cart API Types
  interface ICreateCartItemDTO {
    productId: number;
    quantity: number;
  }

  interface IUpdateCartItemDTO {
    quantity: number;
  }

  interface ICartItemResponse {
    id: number;
    quantity: number;
    product: IProductCard;
    originalPrice?: number;
    discount?: number;
  }

  interface ICartItemDTO {
    id: number;
    productName: string;
    slug: string;
    image: string;
    originalPrice: number;
    price: number;
    quantity: number;
    stock: number;
    promotionId?: number;
    promotionType?: "PERCENT" | "FIXED_AMOUNT";
    value?: number;
  }

  interface ICartResponse {
    id: number;
    userId: number;
    items: ICartItemResponse[];
    createdAt: string;
    updatedAt: string;
  }
  interface Certificate {
    data: {
      id: number;
      name: string;
    };
  }
  export interface IReturn {
    id: number;
    reason: string;
    status: string;
    returnType: string;
    createdAt: string;
    approvedAt: string;
    processedBy: string;
    processNote: string;
    orderId: number;
    customerName: string;
  }
  export interface ICreateReturnDTO {
    reason: string;
    status: string;
    returnType: string;
    processNote: string;
    orderId: number;
  }
  // Interface hiển thị (Mapping theo JSON response)
  export interface ICustomerAddress {
    id: number;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note?: string; // Có thể null hoặc không có
    defaultAddress: boolean;
    user?: IUser; // Có thể chứa thông tin user hoặc không
  }

  // Interface dùng cho Payload khi Tạo mới (POST)
  export interface ICreateCustomerAddressDTO {
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note?: string;
    defaultAddress?: boolean; // Mặc định có thể là false
    userId?: number; // Tùy logic backend có cần gửi userId hay lấy từ token
  }

  // Interface dùng cho Payload khi Cập nhật (PATCH/PUT)
  export interface IUpdateCustomerAddressDTO {
    receiverName?: string;
    phone?: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
    note?: string;
    defaultAddress?: boolean;
  }
  // src/types/address.ts

  // 1. Kiểu dữ liệu cho Địa chỉ (tương ứng với DB)
  export interface IAddress {
    id: number;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note: string; // hoặc string | null tùy backend
    defaultAddress: boolean;
    user?: {
      id: number;
    };
  }

  // 2. Kiểu dữ liệu cho API Hành chính (Tỉnh/Huyện/Xã)
  export interface IWard {
    Name: string;
    Code?: string;
  }

  export interface IDistrict {
    Name: string;
    Wards: IWard[];
  }

  export interface IProvince {
    Name: string;
    Districts: IDistrict[];
  }

  // 3. Kiểu dữ liệu Form Submit (không có ID và User vì user lấy từ context)
  export interface IAddressPayload {
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    note: string;
    defaultAddress: boolean;
    user?: { id: number };
  }
  export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string; // Optional, backend thường mặc định là USER nếu không truyền
  }

  export interface IVerifyOtpRequest {
    email: string;
    otp: string;
  }
  export interface IResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
  }
  interface IResVoucherDTO {
    id: number;
    code: string;
    description?: string;
    typeVoucher: "PERCENT" | "FIXED_AMOUNT" | "FREESHIP"; // Map từ TypeVoucher enum
    value: number;
    maxDiscountAmount: number;
    minOrderValue: number;
    startDate: string; // Sử dụng string cho ISO date/Instant
    endDate: string; // Sử dụng string cho ISO date/Instant
    quantity: number;
    usedCount: number;
    active: boolean;
  }
}
