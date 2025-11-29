// File path: /src/service/api.ts

import axios from "./axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 3000,
      },
    }
  );
};

export const registerAPI = (name: string, email: string, password: string) => {
  const urlBackend = "/api/v1/auth/users";
  return axios.post(urlBackend, { name, email, password });
};

export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IFetchAccount>>(urlBackend);
};

export const getCustomersAPI = (query: string) => {
  const urlBackend = `/api/v1/customer/profile?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ICustomerTable>>>(urlBackend);
};
export const getEmployeesAPI = (query: string) => {
  const urlBackend = `/api/v1/employee/profile?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IEmployee>>>(urlBackend);
};

export const updateUserAPI = (id: number, payload: ICustomerTable) => {
  const urlBackend = `/api/v1/customer/profile/${id}`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, payload);
};
export const updateUserDTOAPI = (id: number, payload: IReqUpdateUserDTO) => {
  const urlBackend = `/api/v1/users/${id}`;
  return axios.patch<IBackendRes<IRegister>>(urlBackend, payload);
};

export const updateEmployeeAPI = (id: number, payload: IEmployee) => {
  const urlBackend = `/api/v1/employee/profile/${id}`;
  return axios.patch<IBackendRes<IEmployee>>(urlBackend, payload);
};

export const createUserAPI = (
  name: string,
  email: string,
  phone: string,
  role: string
) => {
  const urlBackend = `/api/v1/users`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    name,
    email,
    phone,
    role,
  });
};

export const getUserByIdAPI = (id: number) => {
  const urlBackend = `/api/v1/users/${id}`;
  return axios.get<IBackendRes<IResUserById>>(urlBackend);
};

export const deleteUserProfileAPI = (id: number) => {
  const urlBackend = `/api/v1/customer/profile/${id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};
export const deleteUserAPI = (id: number) => {
  const urlBackend = `/api/v1/users/${id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getProductAPI = () => {
  const urlBackend = `/api/v1/products?size=1000`;
  return axios.get<IBackendRes<IModelPaginate<IProduct>>>(urlBackend);
};
export const getOrderAPI = (query: string) => {
  const urlBackend = `/api/v1/orders?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IOrder>>>(urlBackend);
};
export const getOrderAPIByUserId = (id: number) => {
  const urlBackend = `/api/v1/orders/user-order/${id}`;
  return axios.get<IBackendRes<IOrder>>(urlBackend);
};

export interface ICreateProductDTO {
  name: string;
  unit?: string;
  price: number;
  origin_address?: string;
  description?: string;
  rating_avg?: number;
  quantity?: number;
  image?: string;
  active?: boolean;
  mfgDate?: string;
  expDate?: string;
  categoryId?: number;
}
export const getProductsAPI = (query: string) =>
  axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products?${query}`);

export const createProductAPI = (product: ICreateProductDTO) =>
  axios.post(`/api/v1/products`, product);

export const updateProductAPI = (id: number, product: IProduct) =>
  axios.patch(`/api/v1/products/${id}`, product);

export const deleteProductAPI = (id: number) =>
  axios.delete(`/api/v1/products/${id}`);

export const getProductByIdAPI = (id: number) =>
  axios.get(`/api/v1/products/${id}`);

export const getCategoriesAPI = (query: string) => {
  return axios.get(`/api/v1/categories?${query}`);
};

export const createCategoryAPI = (category: ICreateCategoryDTO) => {
  return axios.post(`/api/v1/categories`, category);
};

export const updateCategoryAPI = (id: number, category: IUpdateCategoryDTO) => {
  return axios.put(`/api/v1/categories/${id}`, category);
};

export const deleteCategoryAPI = (id: number) => {
  return axios.delete(`/api/v1/categories/${id}`);
};
export const getSuppliersAPI = (query: string) => {
  return axios.get(`/api/v1/suppliers?${query}`);
};

export const createSupplierAPI = (supplier: ICreateSupplierDTO) => {
  return axios.post(`/api/v1/suppliers`, supplier);
};

export const updateSupplierAPI = (id: number, supplier: ICreateSupplierDTO) => {
  return axios.patch(`/api/v1/suppliers/${id}`, supplier);
};

export const deleteSupplierAPI = (id: number) => {
  return axios.delete(`/api/v1/suppliers/${id}`);
};

export const getReturnsAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IReturn>>>(
    `/api/v1/returns?${query}`
  );
};

// Lấy chi tiết 1 return theo id
export const getReturnByIdAPI = (id: number) => {
  return axios.get(`/api/v1/returns/${id}`);
};

// Tạo return
export const createReturnAPI = (dto: ICreateReturnDTO) => {
  return axios.post(`/api/v1/returns`, dto);
};

// Update return
export const updateReturnAPI = (id: number, dto: ICreateReturnDTO) => {
  return axios.put(`/api/v1/returns/${id}`, dto);
};

// Delete return
export const deleteReturnAPI = (id: number) => {
  return axios.delete(`/api/v1/returns/${id}`);
};
export const getAllCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories?size=1000";
  return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend);
};

export const getParentCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories/parents";
  return axios.get<IBackendRes<IParentCategory>>(urlBackend);
};

export const getProductCardListAPI = (
  page: number,
  size: number,
  sort?: string
) => {
  let urlBackend = `/api/v1/products?page=${page}&size=${size}`;

  // Thêm sort param nếu có
  if (sort) {
    urlBackend += `&sort=${sort}`;
  }

  return axios.get<IBackendRes<IModelPaginate<IProductCard>>>(urlBackend);
};
export const getProductsByCategoryAPI = (
  id: number, // Thêm tham số id danh mục
  page: number,
  size: number,
  sort?: string
) => {
  // Lưu ý: Đường dẫn này phải khớp với @GetMapping bên backend
  // Giả sử prefix global của bạn là /api/v1
  let urlBackend = `/api/v1/product/category/${id}?page=${page}&size=${size}`;

  // Thêm sort param nếu có
  if (sort) {
    urlBackend += `&sort=${sort}`;
  }

  return axios.get<IBackendRes<IModelPaginate<IProductCard>>>(urlBackend);
};
export const getProductDetailById = (id: number) => {
  const urlBackend = `/api/v1/products/${id}`;
  return axios.get<IBackendRes<IProductDetail>>(urlBackend);
};
export const getProductCertificateByIdProduct = (id: number) => {
  const urlBackend = `/api/v1/products/${id}/certificate-details`;
  return axios.get<IBackendRes<ProductCertificateDetail>>(urlBackend);
};

export const searchProductsAPI = (query: string) => {
  const urlBackend = `/api/v1/products/search?query=${encodeURIComponent(
    query
  )}&size=10`;

  return axios.get<IBackendRes<any[]>>(urlBackend).then((res) => {
    if (!res.data.data) return [];

    const mapped: IProductSearchItem[] = res.data.data.map((item) => {
      const p = item.product;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        slug: p.slug,
        image: p.image,
        bestPromotion: item.bestPromotion || null,
      };
    });

    return mapped;
  });
};

export const getSubImgByProductId = (id: number) => {
  const urlBackend = `/api/v1/product-images/product/${id}`;
  return axios.get<IBackendRes<IProductImage[]>>(urlBackend);
};

export const getBestPromotionByProductId = (id: number) => {
  const urlBackend = `/api/v1/promotion-details/${id}/best-promotion`;
  return axios.get<IBackendRes<IBestPromotion>>(urlBackend);
};

export const addToCartAPI = (productId: number, quantity: number) => {
  const URL_API = "/api/v1/items";

  return axios.post<IBackendRes<ICartItemResponse>>(URL_API, {
    productId,
    quantity,
  });
};

export const getCartByUserAPI = () => {
  const urlBackend = `/api/v1/cart`;
  return axios.get(urlBackend);
};

export const getMyCartAPI = () => {
  const urlBackend = `/api/v1/cart/my-cart`;
  return axios.get<IBackendRes<ICartItemDTO[]>>(urlBackend);
};

export const updateCartAPI = (productId: number, quantity: number) => {
  const URL_API = "/api/v1/items";
  console.log("Check ID gửi đi:", productId);
  return axios.put<IBackendRes<ICartItemResponse>>(URL_API, {
    productId,
    quantity,
  });
};
export const clearCartAPI = (userId: number) => {
  return axios.delete(`/api/v1/cart/clear/${userId}`);
};

export const getCertificate = () => {
  const urlBackend = `/api/v1/certificates`;
  return axios.get<IBackendRes<ICertificate>>(urlBackend);
};
export const getUnits = () => {
  const urlBackend = `/api/v1/units`;
  return axios.get<IBackendRes<IUnit>>(urlBackend);
};

export const getOrderDetailsFullAPI = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IOrderDetailFull>>>(
    `/api/v1/order-details?${query}`
  );
};

export const deleteOrderDetailAPI = (orderId: number, productId: number) => {
  return axios.delete(`/api/order-details/${orderId}/${productId}`);
};
export const createOrderDetailAPI = (data: ICreateOrderDetailDTO) => {
  return axios.post(`/api/v1/order-details`, data);
};

export const updateOrderDetailAPI = (
  orderId: number,
  productId: number,
  data: ICreateOrderDetailDTO
) => {
  return axios.patch(`/api/v1/order-details/${orderId}/${productId}`, data);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCustomerProfileAPI = (data: any) => {
  return axios.post(`/api/v1/customer/profile`, data);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createEmployeeProfileAPI = (data: any) => {
  return axios.post(`/api/v1/employee/profile`, data);
};

const uploadFile = (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadFileProductAPI = (
  file: File,
  folder: string = "products"
) => {
  return uploadFile(file, folder);
};

export const uploadFileCertsAPI = (file: File, folder: string = "certs") => {
  return uploadFile(file, folder);
};
export const uploadFileAvatarAPI = (file: File, folder: string = "avatar") => {
  return uploadFile(file, folder);
};

export const uploadMultipleFilesAPI = (
  files: File[],
  folder: string = "products"
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("folder", folder);

  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/files/multiple`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// =============================================================================
//  CUSTOMER ADDRESS API
// =============================================================================

/**
 * Lấy danh sách tất cả địa chỉ (Thường dùng cho Admin)
 */
export const getAllAddressesAPI = () => {
  const urlBackend = "/api/v1/address";
  return axios.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Lấy chi tiết một địa chỉ theo ID
 */
export const getAddressByIdAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}`;
  return axios.get<IBackendRes<ICustomerAddress>>(urlBackend);
};

/**
 * Lấy danh sách địa chỉ của một User cụ thể
 */
export const getAddressesByUserIdAPI = (userId: number) => {
  const urlBackend = `/api/v1/address/user/${userId}`;
  return axios.get<IBackendRes<ICustomerAddress[]>>(urlBackend);
};

/**
 * Tạo mới một địa chỉ
 * @param data DTO tạo mới
 */
export const createAddressAPI = (data: ICreateCustomerAddressDTO) => {
  const urlBackend = "/api/v1/address";
  return axios.post<IBackendRes<ICustomerAddress>>(urlBackend, data);
};

/**
 * Cập nhật một địa chỉ
 * @param id ID của địa chỉ cần sửa
 * @param data DTO cập nhật (chỉ gửi các trường cần sửa)
 */
export const updateAddressAPI = (
  id: number,
  data: IUpdateCustomerAddressDTO
) => {
  const urlBackend = `/api/v1/address/${id}`;
  // Controller Java dùng @PatchMapping
  return axios.patch<IBackendRes<ICustomerAddress>>(urlBackend, data);
};

/**
 * Xóa một địa chỉ
 * @param id ID của địa chỉ cần xóa
 */
export const deleteAddressAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}`;
  return axios.delete<IBackendRes<void>>(urlBackend);
};

/**
 * Cập nhật địa chỉ mặc định
 * @param id ID của địa chỉ muốn đặt làm mặc định
 */
export const setDefaultAddressAPI = (id: number) => {
  const urlBackend = `/api/v1/address/${id}/default`;
  return axios.patch<IBackendRes<ICustomerAddress>>(urlBackend);
};

/**
 * API Đăng ký tài khoản mới
 * Endpoint: /api/v1/auth/register
 * Lưu ý: API này sẽ tạo user và tự động kích hoạt gửi OTP trong backend
 */
export const registerUserAPI = (data: IRegisterRequest) => {
  const urlBackend = "/api/v1/auth/register";
  return axios.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Xác thực OTP (Dùng sau khi đăng ký xong)
 * Endpoint: /api/v1/auth/verify-otp
 */
export const verifyOtpAPI = (data: IVerifyOtpRequest) => {
  const urlBackend = "/api/v1/auth/verify-otp";
  return axios.post<IBackendRes<void>>(urlBackend, data);
};

/**
 * API Gửi lại mã OTP (Dùng khi hết hạn hoặc user không nhận được mail)
 * Endpoint: /api/v1/auth/send-otp
 */
export const resendOtpAPI = (email: string) => {
  const urlBackend = "/api/v1/auth/send-otp";
  return axios.post<IBackendRes<void>>(urlBackend, { email });
};

/**
 * API Gửi yêu cầu lấy lại mật khẩu (Gửi OTP qua email)
 * Endpoint: /api/v1/auth/forgot-password
 */
export const sendForgotPasswordOtpAPI = (email: string) => {
  const urlBackend = "/api/v1/auth/forgot-password";
  return axios.post<IBackendRes<string>>(urlBackend, { email });
};

/**
 * API Đặt lại mật khẩu mới (Kèm OTP xác thực)
 * Endpoint: /api/v1/auth/reset-password
 */
export const resetPasswordAPI = (data: IResetPasswordRequest) => {
  const urlBackend = "/api/v1/auth/reset-password";
  return axios.post<IBackendRes<string>>(urlBackend, data);
};
/**
 * Lấy danh sách các voucher còn sử dụng được.
 * Endpoint: GET /api/v1/vouchers/available
 */
export const getAvailableVouchersAPI = () => {
  const urlBackend = "/api/v1/vouchers/available";
  // Giả định backend trả về IBackendRes chứa List<IResVoucherDTO>
  return axios.get<IBackendRes<IResVoucherDTO[]>>(urlBackend);
};
/**
 * Lấy chi tiết một voucher theo mã code.
 * Endpoint: GET /api/v1/vouchers/code/{code}
 * @param code Mã code của voucher
 */
export const getVoucherByCodeAPI = (code: string) => {
  const urlBackend = `/api/v1/vouchers/code/${code}`;
  // Giả định backend trả về IBackendRes chứa IResVoucherDTO
  return axios.get<IBackendRes<IResVoucherDTO>>(urlBackend);
};
// =============================================================================
//  REVIEW API
// =============================================================================

/**
 * Lấy danh sách reviews theo productId (có phân trang)
 * @param productId ID của sản phẩm
 * @param page Trang hiện tại (mặc định 0)
 * @param size Số lượng items mỗi trang (mặc định 10)
 */
export const getReviewsByProductIdAPI = (
  productId: number,
  page: number = 0,
  size: number = 10
) => {
  const urlBackend = `/api/v1/reviews/product/${productId}?page=${page}&size=${size}`;
  return axios.get<IBackendRes<ISpringRawResponse<IResReviewDTO>>>(urlBackend);
};

/**
 * Lấy chi tiết một review theo ID
 * @param id ID của review
 */
export const getReviewByIdAPI = (id: number) => {
  const urlBackend = `/api/v1/reviews/${id}`;
  return axios.get<IBackendRes<IResReviewDTO>>(urlBackend);
};

/**
 * Tạo mới một review
 * @param data DTO tạo review
 *
 * Lưu ý:
 * - Backend sẽ kiểm tra user đã review sản phẩm này chưa
 * - Backend sẽ kiểm tra user đã mua, thanh toán và nhận hàng thành công chưa
 * - Nếu không đủ điều kiện sẽ throw RuntimeException
 */
export const createReviewAPI = (data: ICreateReviewDTO) => {
  const urlBackend = "/api/v1/reviews";

  // --- BƯỚC MAPPING: Chuyển từ phẳng (Flat) sang lồng nhau (Nested) ---
  const payload = {
    rating: data.rating,
    comment: data.comment,
    product: {
      id: data.productId,
    },
    user: {
      id: data.userId,
    },
  };

  // Gửi payload (đã lồng nhau) đi thay vì data gốc
  return axios.post<IBackendRes<IResReviewDTO>>(urlBackend, payload);
};
/**
 * Cập nhật một review
 * @param id ID của review cần sửa
 * @param data DTO cập nhật (chỉ gửi các trường cần sửa)
 */
export const updateReviewAPI = (id: number, data: IUpdateReviewDTO) => {
  // Nối id vào URL: /api/v1/reviews/10
  const urlBackend = `/api/v1/reviews/${id}`;

  // Dùng axios.patch tương ứng với @PatchMapping của backend
  return axios.patch<IBackendRes<IResReviewDTO>>(urlBackend, data);
};

/**
 * Xóa một review
 * @param id ID của review cần xóa
 */
export const deleteReviewAPI = (id: number) => {
  const urlBackend = `/api/v1/reviews/${id}`;
  return axios.delete<IBackendRes<void>>(urlBackend);
};
export const createOrder = (data: IReqCreateOrder) => {
  const urlBackend = `/api/v1/orders`;
  return axios.post<IBackendRes<void>>(urlBackend, data);
};
export const updateOrder = (orderId: number, data: IUpdateOrderDTO) => {
  const urlBackend = `/api/v1/orders/${orderId}`;
  return axios.patch<IBackendRes<void>>(urlBackend, data);
};
export const deleteOrder = (orderId: number, hardDelete = false) => {
  const urlBackend = `/api/v1/orders/${orderId}?hardDelete=${hardDelete}`;
  return axios.delete<IBackendRes<void>>(urlBackend);
};
export const getOrderByUserId = (userId: number) => {
  const urlBackend = `/api/v1/orders/user-order/${userId}`;
  return axios.get<IBackendRes<IOrder>>(urlBackend);
};
/**
 * Lấy danh sách sản phẩm có khuyến mãi tốt nhất.
 * Endpoint: GET /api/v1/products/best-promotion
 * FIX: Chuyển đổi kiểu trả về thành IModelPaginate<IProductCard>
 */
export const getBestPromotedProductsAPI = (
  page: number = 1,
  size: number = 4
) => {
  const urlBackend = `/api/v1/products/best-promotion?size=${size}&page=${page}`;

  // Axios gọi API và nhận IBackendRes<ISpringRawResponse<IProductWithPromotion>>
  return axios
    .get<IBackendRes<ISpringRawResponse<IProductWithPromotion>>>(urlBackend)
    .then((response) => {
      const paginatedData = response.data.data;
      if (!paginatedData) {
        // Trả về IBackendRes với kiểu IModelPaginate rỗng nếu không có dữ liệu
        return {
          ...response.data,
          data: {
            meta: { page: page, size: size, pages: 0, total: 0 },
            result: [],
          },
        } as IBackendRes<ISpringRawResponse<IProductCard>>;
      }

      // Mapping IProductWithPromotion sang IProductCard
      const mappedResult: IProductCard[] = paginatedData.result.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug!,
        image: p.image || "",
        price: p.finalPrice, // Giá cuối cùng đã giảm
        quantity: p.quantity,
        // Thêm trường discount nếu có promotion
        discount: p.promotionType
          ? {
              type: p.promotionType,
              value: p.promotionValue,
            }
          : undefined,
      }));

      // Tạo cấu trúc IModelPaginate<IProductCard> giả lập để khớp với ProductRight
      const mappedResponse: IBackendRes<ISpringRawResponse<IProductCard>> = {
        ...response.data,
        data: {
          meta: paginatedData.meta,
          result: mappedResult,
        },
      };
      return mappedResponse;
    });
};

/**
 * Lấy danh sách sản phẩm mới về (New Arrivals)
 * Endpoint: GET /api/v1/products/new-arrivals
 * FIX: Chuyển đổi kiểu trả về thành IModelPaginate<IProductCard>
 */
export const getNewArrivalsProductsAPI = (
  page: number = 1,
  size: number = 4
) => {
  const urlBackend = `/api/v1/products/new-arrivals?size=${size}&page=${page}`;

  // API này trả về IProductWithPromotion vì JSON mẫu có originalPrice/finalPrice
  return axios
    .get<IBackendRes<ISpringRawResponse<IProductWithPromotion>>>(urlBackend)
    .then((response) => {
      const paginatedData = response.data.data;
      if (!paginatedData) {
        return {
          ...response.data,
          data: {
            meta: { page: page, size: size, pages: 0, total: 0 },
            result: [],
          },
        } as IBackendRes<ISpringRawResponse<IProductCard>>;
      }

      // Mapping IProductWithPromotion sang IProductCard
      const mappedResult: IProductCard[] = paginatedData.result.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug!,
        image: p.image || "",
        price: p.finalPrice, // Dùng finalPrice (có thể bằng originalPrice nếu không có khuyến mãi)
        quantity: p.quantity,
        discount: p.promotionType
          ? {
              type: p.promotionType,
              value: p.promotionValue,
            }
          : undefined,
      }));

      const mappedResponse: IBackendRes<ISpringRawResponse<IProductCard>> = {
        ...response.data,
        data: {
          meta: paginatedData.meta,
          result: mappedResult,
        },
      };
      return mappedResponse;
    });
};

export const getAllPromotionsAPI = () => {
  const urlBackend = "/api/v1/promotions";
  // Giả định backend trả về trực tiếp mảng các promotions
  return axios.get<IBackendRes<IPromotion[]>>(urlBackend);
};

// Lấy sản phẩm theo ID khuyến mãi (có phân trang)
export const getProductsByPromotionIdAPI = (
  promotionId: number,
  page: number = 1,
  size: number = 10
) => {
  const urlBackend = `/api/v1/products/promotion/${promotionId}?page=${page}&size=${size}`;
  // Trả về cấu trúc paginated list của IPromotionProductItem
  return axios.get<IBackendRes<ISpringRawResponse<IPromotionProductItem>>>(
    urlBackend
  );
};
const BASE_URL = "/api/v1/payments";

export const PaymentAPI = {
  // 1. Tạo link thanh toán
  createPayment: async (data: CreatePaymentRequest) => {
    const response = await axios.post<IBackendRes<IPaymentResponse>>(
      `${BASE_URL}/create`,
      data
    );
    return response.data;
  },

  // 2. Check trạng thái
  checkStatus: async (paymentId: number) => {
    const response = await axios.get<IBackendRes<IPaymentStatus>>(
      `${BASE_URL}/status/${paymentId}`
    );
    return response.data;
  },
};
/**
 * API Đặt hàng dành cho User (Checkout)
 * Endpoint: POST /api/v1/orders/place-order
 * Xử lý: Tạo Order -> Trừ kho -> Tạo Invoice -> Trả về kết quả để thanh toán
 */
export const placeOrderAPI = (data: IReqPlaceOrder) => {
  const urlBackend = `/api/v1/orders/place-order`;
  return axios.post<IBackendRes<IResPlaceOrder>>(urlBackend, data);
};
/**
 * Lấy chi tiết đơn hàng (Dành cho User - Success Page)
 * Endpoint: GET /api/v1/orders/user/{id}
 */
export const getOrderByIdV2API = (id: number) => {
  const urlBackend = `/api/v1/orders/user/${id}`;
  return axios.get<IBackendRes<IResOrderDTO>>(urlBackend);
};
