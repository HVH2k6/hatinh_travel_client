'use client';

import * as React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

type InputSendOtpProps<FormT extends FieldValues> = {
  control: Control<FormT>;
  name: Path<FormT>; // Update the type to Path<FormT>
  label?: string;
  email: string;
  disabled?: boolean;
  countdownSeconds?: number;
};
export default function InputSendOtp<FormT extends FieldValues>({
  control,
  name,
  label = 'Mã OTP',
  email,
  disabled,
  countdownSeconds = 300,
}: InputSendOtpProps<FormT>) {
  const { field } = useController({ control, name });

  const [remaining, setRemaining] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const storageKey = React.useMemo(
    () => (email ? `otp_expiry_${email}` : ''),
    [email]
  );

  // Load remaining time từ localStorage khi có email
  React.useEffect(() => {
    if (!storageKey) return;
    const expiryStr =
      typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (expiryStr) {
      const expiry = Number(expiryStr);
      const now = Date.now();
      if (expiry > now) {
        setRemaining(Math.ceil((expiry - now) / 1000));
      } else {
        localStorage.removeItem(storageKey);
        setRemaining(0);
      }
    } else {
      setRemaining(0);
    }
    // khi đổi email, reset lại remaining theo key mới
  }, [storageKey]);

  // Tick đếm ngược mỗi giây
  React.useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  };

  const canSend =
    !disabled &&
    !!email &&
    remaining <= 0 &&
    // email định dạng cơ bản (để tránh gọi API khi chưa nhập hợp lệ)
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setLoading(true);
      await api.post('/otp/create', { email }); // endpoint tạo OTP của bạn
      toast.success('Đã gửi OTP đến email của bạn');
      const expiry = Date.now() + countdownSeconds * 1000;
      if (storageKey) localStorage.setItem(storageKey, String(expiry));
      setRemaining(countdownSeconds);
    } catch (e: any) {
      // server có thể trả 400 khi OTP còn hạn
      const msg =
        e?.response?.data?.message || 'Không thể gửi OTP, vui lòng thử lại';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormField
      name={name as any}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className='flex gap-2'>
            <FormControl>
              <Input
                placeholder='Nhập mã OTP'
                inputMode='numeric'
                maxLength={6}
                {...field}
              />
            </FormControl>

            <Button
              type='button'
              variant={remaining > 0 ? 'secondary' : 'outline'}
              onClick={handleSend}
              disabled={!canSend || loading}
              className='whitespace-nowrap'
            >
              {loading
                ? 'Đang gửi...'
                : remaining > 0
                ? `Gửi lại ${format(remaining)}`
                : 'Gửi OTP'}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
