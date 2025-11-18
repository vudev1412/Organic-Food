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


export const getCustomersAPI = (query:string) =>{
    const urlBackend = `/api/v1/customer/profile?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ICustomerTable>>>(urlBackend);
}
export const getEmployeesAPI = (query:string) =>{
    const urlBackend = `/api/v1/employee/profile?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IEmployee>>>(urlBackend);
}

export const updateUserAPI = (id: number, payload: ICustomerTable) => {
  const urlBackend = `/api/v1/customer/profile/${id}`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, payload);
}
export const updateEmployeeAPI = (id: number, payload: IEmployee) => {
  const urlBackend = `/api/v1/employee/profile/${id}`;
  return axios.patch<IBackendRes<IEmployee>>(urlBackend, payload);
}
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



export const deleteUserAPI = (id: number) => {
  const urlBackend = `/api/v1/customer/profile/${id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getProductsAPI = (query: string) => {
  const urlBackend = `/api/v1/product-certificates?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IProductTable>>>(urlBackend);
};

export const deleteProductAPI = (id: number) => {
  const urlBackend = `/api/v1/products/${id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const updateProductAPI = (
  id: number,
  name: string,
  unit: string,
  price: number,
  origin_address: string,
  description: string,
  active: boolean,
  categoryId?: number
) => {
  const urlBackend = `/api/v1/products/${id}`;
  return axios.patch<IBackendRes<IProduct>>(urlBackend, {
    name,
    unit,
    price,
    origin_address,
    description,
    active,
    categoryId,
  });
};
export interface ICreateProductDTO {
  name: string;
  unit: string;
  price: number;
  quantity: number;
  origin_address?: string;
  description?: string;
  active: boolean;
  rating_avg?: number;
  image?: string;
  mfgDate?: Date; // ISO string
  expDate?: Date; // ISO string
  categoryId?: number;
}
export const createProductAPI = (product: ICreateProductDTO) => {
  const urlBackend = `/api/v1/products`; // endpoint backend
  return axios.post<IBackendRes<ICreateProductDTO>>(urlBackend, product);
};

export const getCategoriesAPI = (query: string) => {
  return axios.get(`/api/v1/categories?${query}`);
};

export const createCategoryAPI = (category: ICreateCategoryDTO) => {
  return axios.post(`/api/v1/categories`, category);
};

export const updateCategoryAPI = (id: number, category: ICreateCategoryDTO) => {
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

export const getAllCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories?size=1000";
  return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend);
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
export const getProductDetailById = (id: number) => {
  const urlBackend = `/api/v1/products/${id}`;
  return axios.get<IBackendRes<IProductDetail>>(urlBackend);
};


export const getSubImgByProductId = (id: number) => {
  const urlBackend = `/api/v1/product-images/product/${id}`;
  return axios.get<IBackendRes<IProductImage[]>>(urlBackend);
};

