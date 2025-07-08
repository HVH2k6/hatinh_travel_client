'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchUser } from '@/lib/authService';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchUser(dispatch);
  }, [dispatch]);

  return <>{children}</>;
}