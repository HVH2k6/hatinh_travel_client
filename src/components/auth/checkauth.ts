// components/auth/checkauth.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { setCredentials, logout } from '@/redux/store/authSlice';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import type { IUser } from '@/interfaces/IUser';

/** Core: bootstrap user vào Redux nếu có token, trả về { user, loading } */
function useAuthBootstrap(): { user: IUser | null; loading: boolean } {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(!user); // nếu đã có user thì không loading
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;

    // 1) Nếu Redux đã có user -> kết thúc
    if (user) {
      setLoading(false);
      bootstrapped.current = true;
      return;
    }

    // 2) Không có token -> không gọi /me
    const hasAnyToken =
      !!Cookies.get('access_token_js') ||
      !!Cookies.get('access_token') ||
      !!Cookies.get('refresh_token');

    if (!hasAnyToken) {
      setLoading(false);
      bootstrapped.current = true;
      return;
    }

    // 3) Gọi /user/me để đồng bộ user vào Redux
    (async () => {
      try {
        const res = await api.get('/user/me');
        const u: IUser | undefined = res.data?.user;
        if (u) {
          const accessFromCookie = Cookies.get('access_token_js') || '';
          dispatch(setCredentials({ user: u, accessToken: accessFromCookie }));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
        bootstrapped.current = true;
      }
    })();
  }, [user, dispatch]);

  // Lấy lại user mới nhất từ Redux (sau khi setCredentials)
  const currentUser = useSelector((s: RootState) => s.auth.user);
  return { user: currentUser, loading };
}

/** ✅ Giữ API cũ: trả về user (IUser | null) để không phá chỗ đang dùng */
export function useCheckAuth(): IUser | null {
  const { user } = useAuthBootstrap();
  return user;
}

/** ✅ Hook mới cho các UI cần skeleton: trả về { user, loading } */
export function useAuthState(): { user: IUser | null; loading: boolean } {
  return useAuthBootstrap();
}
