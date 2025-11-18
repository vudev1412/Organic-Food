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
    id: number;
    type: string;
    value: number;
  }
  interface IProductCard {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
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
  interface IEmployee{
    id: number;
    employeeCode:string;
    address:string;
    hireDate:string;
    salary:number;
    user:ICustomer;
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
  interface ICertificate{
    id:number;
    name:string;
    image:string;
  }
  interface IProductTable{
      imageUrl:string;
      certNo:string;
      date:string;
      product:IProduct;
      certificate:ICertificate;
  }
  interface ICategory {
    parentCategoryId: null;
    data: {
      id: number;
      name: string;
      slug: string;
      parentCategoryId?: number;
    };
  }
  interface ICreateCategoryDTO {
    name: string;
    slug: string;
    parent_category_id?: number;
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
  interface IProductTable {
    id: number;
    image: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    active: boolean;
  }
  interface ICategory {
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
    discount?: number;
    quantity: number;
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
}
