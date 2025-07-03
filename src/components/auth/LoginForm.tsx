'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { saveTokens } from '@/lib/token';
import api from '@/lib/axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCredentials } from '@/redux/store/authSlice';

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

      // ✅ Lưu token
      saveTokens(access_token, refresh_token);

      // Sau khi gọi API:
      dispatch(
        setCredentials({
          user: res.data.user, // 👈 phải khớp với IUser
          accessToken: res.data.access_token,
        })
      );

      router.push('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login failed:', err);
      form.setError('email', { message: 'Email hoặc mật khẩu không đúng' });
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
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='you@example.com'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input placeholder='******' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full'>
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
