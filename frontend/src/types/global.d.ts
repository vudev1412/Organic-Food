// File path: /src/types/global.d.ts
// Global type definitions for the entire application

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
    image: string;
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
  export interface IProductWithPromotion extends IProduct {
    promotionId: number | null;
    promotionName: string | null;
    promotionType: "PERCENT" | "FIXED_AMOUNT" | null;
    promotionValue: number;
    promotionStartDate: string | null;
    promotionEndDate: string | null;
    originalPrice: number;
    finalPrice: number;
  }
  export interface IPromotionProductItem {
    productId: number;
    productName: string;
    quantity: number;
    slug: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    promotionStartDate: string;
    promotionEndDate: string;
    promotionType: "PERCENT" | "FIXED_AMOUNT";
    promotionValue: number;
  }
  export interface IPromotion {
    id: number;
    name: string;
    type: "PERCENT" | "FIXED_AMOUNT";
    value: number;
    active: boolean;
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

    certificates?: ICertificate[];
    images?: IProductImage[];
  }
  interface IProductImage {
    id: number;
    imgUrl: string;
  }

  interface ICertificate {
    id: number;
    name: string;
    image?: string;
    certNo?: string;
    imageUrl?: string;
    date?: string | Date;
  }
  interface IProductTable {
    imageUrl: string;
    certNo: string;
    date: string;
    product: IProduct;
    certificate: ICertificate;
  }
  export interface IOrderDetail {
    id: number;
    quantity: number;
    price: number;
    productId: number;
    productName: string;
    productImage: string;
    productPrice: number;
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
    userName?: string;
    orderDetails?: IOrderDetail[];
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

  export interface IComment {
    id: number;
    userId: number;
    user: string;
    content: string;
    rating: number;
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

  interface IUnit {
    id: number;
    name: string;
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
  export interface IResVoucherDTO {
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
  interface ISpringRawResponse<T> {
    meta: {
      page: number;
      size: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  export interface IReview {
    id: number;
    comment: string;
    rating: number;
    createdAt: string;
    productId: number;
    userId: number;
  }
  export interface IResReviewDTO {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    userId: number;
    productId: number;
    userName: string;
    userAvatar?: string;
  }

  /**
   * DTO để tạo mới Review
   */
  export interface ICreateReviewDTO {
    productId: number;
    rating: number;
    comment: string;
    userId: number;
  }

  /**
   * DTO để cập nhật Review
   */
  export interface IUpdateReviewDTO {
    rating: number;
    comment: string;
    // Không cần product hay user ở đây vì không ai đổi review từ sản phẩm A sang B
  }
  export interface IProductSearchItem {
    id: number;
    name: string;
    price: number;
    slug: string;
    image: string;
    bestPromotion: IBestPromotion | null;
  }
  export interface IReqUpdateUserDTO {
    name: string;
    email: string;
    password: string;
    image: string;
  }
  interface IResUserById {
    name: string;
    email: string;
    phone: string;
    password: string;
    image: string;
  }
  export interface IReqCustomer {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }

  export interface IReqOrderDetailItem {
    productId: number;
    quantity: number;
  }

  export interface IReqCreateOrder {
    customerDTO?: IReqCustomer;
    userId?: number;
    shipAddress: string;
    note?: string;
    estimatedDate?: string | null;
    orderDetails: IReqOrderDetailItem[];
  }
  interface IUpdateOrderDTO {
    shipAddress?: string;
    note?: string;
    statusOrder?:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPING"
      | "DELIVERED"
      | "CANCELLED";
    estimatedDate?: string;
    actualDate?: string;
    orderDetails?: { productId: number; quantity: number }[];
  }
  interface CreatePaymentRequest {
    amount: number;
    description?: string;
    buyerName?: string;
    buyerPhone?: string;
    orderId?: number; // ID của đơn hàng hoặc ID thanh toán tùy logic backend
  }
  export interface IPaymentResponse {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number; // Cái này quan trọng để check status
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string; // Cái này quan trọng để hiện QR
  }

  // 2. Định nghĩa kiểu dữ liệu trả về khi check status
  export interface IPaymentStatus {
    id: number;
    status: string; // "PENDING" | "SUCCESS" | "FAILED" | "CANCELED"
  }
  interface ResInvoiceDTO {
    id: number;
    createAt: string; // Instant map sang string (ISO date)
    deliverFee: number;
    discountAmount: number;
    subtotal: number;

    // --- Các trường tính toán mới ---
    taxRate: number;
    taxAmount: number;
    total: number;
    // --------------------------------

    status: "UNPAID" | "PAID" | "CANCELLED"; // StatusInvoice enum

    // Mối quan hệ (IDs)
    orderId: number;
    customerId?: number; // nullable
    employeeId?: number; // nullable
    paymentId?: number;
    voucherId?: number;
  }
  interface IReqInvoice {
    deliverFee: number;
    discountAmount: number;
    subtotal: number;
    status: "UNPAID" | "PAID" | "CANCELLED"; // StatusInvoice enum

    // --- Các trường tính toán từ Client ---
    taxRate: number;
    taxAmount: number;
    total: number;
    // ----------------------------------------

    // Mối quan hệ (IDs)
    orderId: number;
    customerId?: number;
    employeeId?: number;
    paymentId?: number;
    voucherId?: number;
  }
  interface Invoice {
    id?: number;

    deliverFee?: number;
    discountAmount?: number;
    subtotal?: number;

    taxRate?: number;
    taxAmount?: number;
    total?: number;

    status?: "UNPAID" | "PAID" | "CANCELLED";
  }
  // --- Type cho Request (Gửi đi) ---
  export interface ICartItemRequest {
    productId: number;
    quantity: number;
    price: number;
  }

  export interface IReqPlaceOrder {
    receiverName: string;
    receiverPhone: string;
    shipAddress: string;
    note: string;
    paymentMethod: "COD" | "BANK_TRANSFER" | string; // Type string để linh hoạt
    totalPrice: number;
    cartItems: ICartItemRequest[];
  }

  // --- Type cho Response (Nhận về) ---
  export interface IResPlaceOrder {
    id: number; // Order ID
    totalPrice: number;
    paymentMethod: string;
    receiverName: string;
    receiverPhone: string;
    address: string;
    paymentStatus: string;
  }
  export interface IResOrderDetailItem {
    productId: number;
    productName: string;
    productImage: string;
    productSlug: string;
    quantity: number;
    price: number;
  }

  export interface IResOrderDTO {
    id: number;
    orderAt: string;
    note: string;
    statusOrder: string;
    estimatedDate: string;
    actualDate: string | null;

    // Giao hàng
    shipAddress: string;
    receiverName: string;
    receiverPhone: string;

    // Tài chính
    paymentMethod: string;
    paymentStatus: string;
    totalPrice: number;
    subtotal: number;
    shippingFee: number;
    taxAmount: number;
    discountAmount: number;

    // Chi tiết sản phẩm
    orderDetails: IResOrderDetailItem[];
  }
}
