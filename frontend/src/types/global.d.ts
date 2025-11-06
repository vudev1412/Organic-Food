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
        meta:{
            current:number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }

    interface ILogin{
        access_token:string;
        userLogin:{
            id: number,
            email: string,
            name: string
        }
    }
}