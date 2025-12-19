'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, KeyRound, Mail } from 'lucide-react';
import Link from 'next/link';

// UI Components (Shadcn)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// API Service
import { forgotPasswordApi, resetPasswordApi } from '@/service/auth-service';


const emailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

// Schema Bước 2: Nhập OTP & Mật khẩu mới
const resetSchema = z
  .object({
    code: z.string().length(6, { message: 'Mã OTP phải có 6 ký tự' }),
    newPassword: z.string().min(6, { message: 'Mật khẩu phải tối thiểu 6 ký tự' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1); // Quản lý bước
  const [email, setEmail] = useState(''); // Lưu email để dùng ở bước 2
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /* ===== FORM STEP 1 ===== */
  const formEmail = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmitEmail = (values: z.infer<typeof emailSchema>) => {
    startTransition(async () => {
      try {
        await forgotPasswordApi(values.email);
        toast.success('Mã OTP đã được gửi đến email của bạn!');
        setEmail(values.email); // Lưu email lại
        setStep(2); // Chuyển sang bước 2
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  /* ===== FORM STEP 2 ===== */
  const formReset = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmitReset = (values: z.infer<typeof resetSchema>) => {
    startTransition(async () => {
      try {
        // Gọi API reset password với email đã lưu từ bước 1
        await resetPasswordApi({
          email: email,
          code: values.code,
          newPassword: values.newPassword,
        });
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
        router.push('/tai-khoan/dang-nhap'); // Chuyển hướng về trang login
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="flex items-center  bg-gray-50 p-1">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            {step === 1 ? (
              <Mail className="w-6 h-6 text-orange-600" />
            ) : (
              <KeyRound className="w-6 h-6 text-orange-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? 'Nhập email của bạn để nhận mã OTP xác thực.'
              : `Nhập mã OTP đã gửi tới ${email} và mật khẩu mới.`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* =========== BƯỚC 1: NHẬP EMAIL =========== */}
          {step === 1 && (
            <Form {...formEmail}>
              <form onSubmit={formEmail.handleSubmit(onSubmitEmail)} className="space-y-4">
                <FormField
                  control={formEmail.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email đăng ký</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : 'Gửi mã OTP'}
                </Button>
              </form>
            </Form>
          )}

          {/* =========== BƯỚC 2: NHẬP OTP & PASS =========== */}
          {step === 2 && (
            <Form {...formReset}>
              <form onSubmit={formReset.handleSubmit(onSubmitReset)} className="space-y-4">
                <FormField
                  control={formReset.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã OTP (6 số)</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} maxLength={6} disabled={isPending} className="text-center tracking-widest text-lg font-bold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formReset.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formReset.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : 'Đổi mật khẩu'}
                </Button>
                
                {/* Nút quay lại nếu nhập sai email */}
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setStep(1)}
                    disabled={isPending}
                >
                    Quay lại nhập Email
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4 bg-gray-50/50 rounded-b-xl">
          <Link href="/tai-khoan/dang-nhap" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}