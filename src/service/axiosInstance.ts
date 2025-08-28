import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Tạo Axios Instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Thay đổi baseURL theo môi trường của bạn
});

// Trạng thái refresh token
let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

// Hàm gọi các subscriber khi refresh token thành công
function onRefreshed(token: string) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

// Hàm thêm các subscriber vào danh sách chờ
function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

// Xử lý interceptor của Axios Instance
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Xử lý khi gặp lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        // Xóa token nếu không có refresh token
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
       
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.get('/user/refresh-token', {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { access_token } = data;
        Cookies.set('access_token', access_token, { expires: 0.02 }); // Token sống 30 phút hoặc lâu hơn

        onRefreshed(access_token); // Gọi tất cả các subscriber khi refresh token thành công
        isRefreshing = false;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access_token}`,
        };
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
