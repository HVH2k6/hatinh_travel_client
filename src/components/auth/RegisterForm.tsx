'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
import api from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import InputSendOtp from '../input/InputOtp';

const formSchema = z.object({
  username: z.string().min(5, { message: 'Tên người dùng phải từ 5 ký tự trở lên.' }),
  email: z.string().email('Email không hợp lệ'),
  code: z.string().length(6, { message: 'OTP gồm 6 số' }),
  password: z.string().min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên.' }),
  phoneNumber: z.string().min(10, { message: 'Số điện thoại phải từ 10 ký tự trở lên.' }),
});

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      code: '',
      password: '',
      phoneNumber: '',
    },
    mode: 'onTouched',
  });

  const email = useWatch({ control: form.control, name: 'email' });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await api.post('/user/sign-up', values);
      if (res.status === 200 || res.status === 201) {
        toast.success('Đăng ký thành công');
        router.push('/tai-khoan/dang-nhap');
        return;
      }
      toast.error('Đăng ký thất bại, vui lòng thử lại');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Có lỗi';
      toast.error(message);
      if (message.toLowerCase().includes('email')) {
        form.setError('email', { message });
      } else if (message.toLowerCase().includes('otp')) {
        form.setError('code', { message });
      }
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-sm">
      <h1 className="text-3xl font-semibold tracking-tight text-sky-600">Register</h1>
      <p className="text-sm text-muted-foreground mb-6">Tạo tài khoản mới để bắt đầu trải nghiệm</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên của bạn" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InputSendOtp
            control={form.control}
            name="code"
            label="Mã OTP"
            email={email || ''}
            countdownSeconds={300}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" type="tel" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-11">
            Đăng ký
          </Button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="flex w-full items-center justify-center h-11">
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              width={20}
              height={20}
              className="mr-2"
            />
            Đăng ký với Google
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-3">
            Bạn đã có tài khoản?{' '}
            <Link href="/tai-khoan/dang-nhap" className="text-sky-600 hover:text-sky-700 font-medium">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
