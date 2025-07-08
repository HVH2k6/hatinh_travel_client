'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { saveTokens } from '@/lib/token';
import api from '@/lib/axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCredentials } from '@/redux/store/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import { InputForm } from '../input/InputForm';
import InputPassword from '../input/InputPassword';
import ButtonSubmit from '../button/ButtonSubmit';
import { fetchUser } from '@/lib/authService';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, {
    message: 'Mật khẩu phải từ 6 ký tự trở lên.',
  }),
});

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
  
    try {
      const res = await api.post('/user/sign-in', { email, password });
      const { access_token, refresh_token } = res.data;
  
      saveTokens(access_token, refresh_token);
  
      // ✅ Gọi fetchUser để cập nhật redux ngay sau khi login
      await fetchUser(dispatch);
  
      router.push('/');
      // router.refresh();
    } catch (err: any) {
      console.error('Login failed:', err);
      form.setError('email', { message: 'Tài khoản hoặc mật khẩu khống hợp lệ' });
    }
  };
  return (
    <Card className='max-w-sm mx-auto mt-10 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <InputForm
              control={form.control}
              name='email'
              label='Email'
              placeholder='Email'
              type='email'
            />

            <InputPassword
              control={form.control}
              name='password'
              label='Mật khẩu'
              placeholder='********'
            />

            <ButtonSubmit
              isLoading={form.formState.isSubmitting}
              text='Đăng nhập'
            />
          </form>
        </Form>
        <div className='text-center mt-4 '>
          <Button
            type='button'
            variant='outline'
            className='flex items-center w-full'
          >
            <Image
              src='/google.png'
              alt='google'
              width={24}
              height={24}
              className='mr-2'
            />
            Đăng nhập với google
          </Button>
          <div className='flex items-center justify-between font-medium mt-3'>
            <Link
              href='/auth/register'
              className='text-sm text-green-400 hover:text-green-600'
            >
              Đăng ký
            </Link>
            <Link
              href='/auth/forgot-password'
              className='text-sm text-blue-500 hover:text-blue-600'
            >
              Quên mật khẩu
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
