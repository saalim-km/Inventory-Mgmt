import axios from "axios";
import { toast } from "sonner";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
});

let isRefreshing = false;

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('access token expire triggered');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await AxiosInstance.post('/auth/refresh-token');
          isRefreshing = false;

          return AxiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          toast.info("Please login again");
          localStorage.removeItem("userSeesion");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);