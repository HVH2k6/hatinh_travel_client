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
import api from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

const formSchema = z.object({
  username: z.string().min(5, {
    message: 'Tài khoản phải từ 6 ký tự trở lên.',
  }),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, {
    message: 'Mật khẩu phải từ 6 ký tự trở lên.',
  }),
  phoneNumber: z.string().min(10, {
    message: 'Số điện thoại phải từ 10 ký tự trở lên.',
  }),
});

export function RegisterForm() {
  

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, username, phoneNumber } = values;

    try {
      const res = await api.post('/user/sign-up', {
        username,
        email,
        password,
        phoneNumber,
      });

      if (res.status === 200) {
        toast.success('Đăng ký thành công');
      }
      router.push('/auth/login');
      
    } catch (err: any) {
      console.error('Login failed:', err);

      const message = 'Có lỗi';

      
      form.setError('email', { message });
    }
  };

  return (
    <Card className='max-w-sm mx-auto mt-10 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Đăng ký</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người dùng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên của bạn'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập số điện thoại'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Đăng ký
            </Button>
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
          <div className='text-center font-medium mt-3'>
            <Link
              href='/auth/login'
              className='text-sm text-green-400 hover:text-green-600'
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
