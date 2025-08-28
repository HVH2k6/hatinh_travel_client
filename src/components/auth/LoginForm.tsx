'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { saveTokens } from '@/lib/token';
import api from '@/lib/axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { InputForm } from '../input/InputForm';
import InputPassword from '../input/InputPassword';
import ButtonSubmit from '../button/ButtonSubmit';
import { fetchUser } from '@/lib/authService';
import { toast } from 'react-toastify';
import Image from 'next/image';
import * as React from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên.' }),
});

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await api.post('/user/sign-in', values);
      const { access_token, refresh_token } = res.data;
      saveTokens(access_token, refresh_token);
      await fetchUser(dispatch);
      toast.success('Đăng nhập thành công');
      router.push('/');
    } catch (err: any) {
      const errMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Đăng nhập thất bại';
      toast.error(errMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      // TODO: thay đường dẫn theo backend OAuth của bạn
      // ví dụ: window.location.href = '/api/auth/google';
      window.location.href = '/api/auth/google';
    } finally {
      // không set false để tránh user click tiếp trong lúc redirect
    }
  };

  const isSubmitting = form.formState.isSubmitting || googleLoading;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-sky-600 text-center mb-4">Đăng nhập</h1>
      

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <InputForm
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
       
          />

          <InputPassword
            control={form.control}
            name="password"
            label="Mật khẩu"
            placeholder="********"
           
          />

          <div className="flex items-center justify-end -mt-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <ButtonSubmit
            isLoading={form.formState.isSubmitting}
            text="Đăng nhập"
            
          />

          {/* Divider: dùng bg-background để hợp dark mode */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">hoặc</span>
            </div>
          </div>

          {/* Google login only (ảnh online) */}
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-center h-11"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang chuyển hướng Google...
              </>
            ) : (
              <>
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Đăng nhập với Google
              </>
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-3">
            Don’t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-sky-600 hover:text-sky-700 font-medium"
            >
              Register Now
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
