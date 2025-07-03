'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCredentials } from '@/redux/store/authSlice';
import api from '@/lib/axios';
import { getAccessToken } from '@/lib/token';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const res = await api.get('/user/me');
        dispatch(setCredentials({ user: res.data.user, accessToken: token }));
      } catch (err) {
        console.log('Không thể lấy thông tin người dùng', err);
      }
    };

    fetchUser();
  }, [dispatch]);

  return <>{children}</>;
}
