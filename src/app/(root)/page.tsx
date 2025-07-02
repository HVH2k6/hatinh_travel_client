'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <p>Chào mừng, {user.username}!</p>
      ) : (
        <p>Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}
