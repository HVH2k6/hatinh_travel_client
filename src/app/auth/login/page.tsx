'use client';

import { useRouter } from 'next/navigation';

import { saveTokens } from '@/lib/token';
import api from '@/lib/axios';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post('/user/sign-in', { email, password });
      const { access_token, refresh_token } = res.data;

      // ✅ Lưu token vào cookie
      saveTokens(access_token, refresh_token);

      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      <button onClick={handleLogin}>Đăng nhập</button>
    </>
  );
}
