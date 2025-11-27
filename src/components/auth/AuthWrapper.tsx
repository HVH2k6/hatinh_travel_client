'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchUser } from '@/lib/authService';
import { getAccessToken, getRefreshToken } from '@/lib/token';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // ✅ Chỉ gọi API khi có token
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    if (accessToken || refreshToken) {
      fetchUser(dispatch);
    }
  }, [dispatch]);

  return <>{children}</>;
}