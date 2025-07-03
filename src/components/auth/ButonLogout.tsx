'use client';

import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';

import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/store/authSlice';
import { clearTokens } from '@/lib/token';

export default function ButtonLogout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // ✅ Xóa user khỏi Redux
    clearTokens(); // ✅ Xóa access/refresh token
    router.push('/'); // ✅ Chuyển về trang đăng nhập
  };

  return (
    <Button variant='outline' onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
