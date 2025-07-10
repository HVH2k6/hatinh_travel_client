'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/store/authSlice';
import { clearTokens } from '@/lib/token';

import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCheckAuth } from './checkauth';

export default function ButtonLogout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = useCheckAuth()
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?._id }),
      });

      if (!res.ok) throw new Error('Logout failed');

      dispatch(logout());
      clearTokens();
      toast.success('Đăng xuất thành công');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Lỗi đăng xuất. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant='outline' onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='animate-spin mr-2 h-4 w-4' />
          Đang đăng xuất...
        </>
      ) : (
        'Đăng xuất'
      )}
    </Button>
  );
}
