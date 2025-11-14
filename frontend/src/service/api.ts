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

export const getCustomersAPI = (page: number, size: number) => {
  const urlBackend = `/api/v1/users?page=${page}&size=${size}`;
  return axios.get<IBackendRes<IModelPaginate<ICustomerTable>>>(urlBackend);
};

export const getProductsAPI = (page: number, size: number) => {
  const urlBackend = `/api/v1/products?page=${page}&size=${size}`;
  return axios.get<IBackendRes<IModelPaginate<IProductTable>>>(urlBackend);
};

export const getAllCategoriesAPI = () => {
  const urlBackend = "/api/v1/categories";
  return axios.get<IBackendRes<ICategory[]>>(urlBackend);
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
export const getProductDetailById = (id:number)=>{
  const urlBackend = `/api/v1/products/${id}`;
  return axios.get<IBackendRes<IProductDetail>>(urlBackend)
}