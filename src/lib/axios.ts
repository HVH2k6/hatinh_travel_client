import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Gắn access_token vào mỗi request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý response lỗi: access_token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const refresh_token = getRefreshToken();
        if (!refresh_token) throw new Error('Missing refresh token');

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/renew-access-token`, {
          refresh_token,
        });

        const { access_token: newAccessToken } = res.data;
        saveTokens(newAccessToken, refresh_token);

        // ✅ Gắn vào toàn bộ axios mặc định
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalConfig);
      } catch (err) {
        clearTokens();
        // return Promise.reject(new Error('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.'));
        
      }
    }

    return Promise.reject(error);
  }
);

export default api;
