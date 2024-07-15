import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import NProgress from "nprogress";
import { toast } from "react-toastify";

interface CustomResponse<T = any> {
  data: T;
  message: string;
}

// Extend the AxiosInstance to override method return types
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any, R = CustomResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  post<T = any, R = CustomResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<T = any, R = CustomResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R>;
  patch<T = any, R = CustomResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R>;
}

const api: CustomAxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_HOST_IP_ADDRESS}/api/`, // Replace with your API's base URL
});

export const getLocalStorageItem = (key) => {
  return localStorage.getItem(key);
};

export function getLocalAccessToken() {
  return getLocalStorageItem("token");
}

api.interceptors.request.use(
  (config) => {
    const authToken = getLocalAccessToken();
    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }
    NProgress.start();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    if (error.response) {
      if (error.response.status === 401 && window.location.pathname !== "/") {
        window.location.href = "/";
      } else if (error.response.status === 404) {
        // Handle not found
      } else if(error.response.status === 500) {
        console.log("500");
        // Handle other error codes as needed
        toast.error("Internal server error");
      }
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
