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
}
