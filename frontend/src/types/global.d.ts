export {}
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";

declare global{
    interface IBackendRes<T>{
        error?:string | string[];
        message?:string;
        statusCode: number | string;
        data?: T;
    }
    interface IModelPaginate<T>{
        data:{
meta:{
            page:number;
            size: number;
            pages: number;
            total: number;
        },
        result: T[]
        }
        
    }

    interface ILogin{
        data:{
            access_token:string;
        userLogin:{
            id: number,
            email: string,
            name: string,
            role:string
        }
        }
    }
    interface IUser{
        
            id: number,
            email: string,
            name: string,
            role:string
        
    }
    interface IFetchAccount{
        data:{
            user:IUser
        }
    }

    interface ICustomerTable{
        id:number,
        email:string,
        name:string,
        phone:string
    }
    interface IRegister{
        name:string;
        email:string;
        password:string;
        phone:string;
        role:string;
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
interface ICategory {
  id: number;
  name: string;
  slug: string;
  parent_category_id?: number;
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
}