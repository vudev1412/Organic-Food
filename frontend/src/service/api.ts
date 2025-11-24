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

export const updateEmployeeAPI = (id: number, payload: IEmployee) => {
  const urlBackend = `/api/v1/employee/profile/${id}`;
  return axios.patch<IBackendRes<IEmployee>>(urlBackend, payload);
};

export const createUserAPI = (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  const urlBackend = `/api/v1/users`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    name,
    email,
    password,
    phone,
    role,
  });
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
export const getOrderAPI = () => {
  const urlBackend = `/api/v1/orders`;
  return axios.get<IBackendRes<IOrder>>(urlBackend);
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
  axios.get(`/api/v1/products?${query}`);

export const createProductAPI = (product: ICreateProductDTO) =>
  axios.post(`/api/v1/products`, product);

export const updateProductAPI = (id: number, product: ICreateProductDTO) =>
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
  const urlBackend = `/api/v1/products?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IProductCard>>>(urlBackend);
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
export const clearCartAPI = () => {
  const urlBackend = `/api/v1/cart`;
  return axios.delete<IBackendRes<void>>(urlBackend);
};

export const getCertificate = () => {
  const urlBackend = `/api/v1/certificates`;
  return axios.get<IBackendRes<ICertificate>>(urlBackend);
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

export const uploadFileAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
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
