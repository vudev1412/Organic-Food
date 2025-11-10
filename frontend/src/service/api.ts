import axios from "./axios.customize";

export const loginAPI = (username:string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend,{username, password});
}

export const registerAPI = (name:string,email:string,password:string) =>{
    const urlBackend = "/api/v1/auth/users";
    return axios.post(urlBackend,{name,email,password});
}