import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// import Cookies from 'js-cookie';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const refresh_token = getRefreshToken();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/renew-access-token`, {
          refresh_token,
        });

        const newAccessToken = (res.data as { access_token: string }).access_token;
        saveTokens(newAccessToken, refresh_token!);

        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalConfig);
      } catch (err) {
        clearTokens();
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
