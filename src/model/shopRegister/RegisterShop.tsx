'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { InputForm } from '@/components/input/InputForm';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';

// Đã xóa InputSelectDistrict
import { InputSelectWard } from '@/components/input/InputSelectWard';
import ButtonSubmit from '@/components/button/ButtonSubmit';

import { getProvinces } from '@/util/constant';
import { useCheckAuth } from '@/components/auth/checkauth';
import { toast } from 'react-toastify';
import { HandleCreateSellerApplication } from '@/action/HandleShop';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';

/* ============================ SCHEMA (chuẩn backend - Bỏ District) ============================ */
const formSchema = z.object({
  shopDraft: z.object({
    name: z
      .string()
      .min(5, { message: 'Tên cửa hàng phải từ 5 ký tự trở lên.' }),
    categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
    image: z.string().url('Ảnh đại diện phải là URL hợp lệ.').optional(),
    
    // Address Schema mới
    address: z.object({
      provinceId: z.string().min(1, 'Chọn tỉnh/thành phố.'),
      // districtId: ... -> ĐÃ XÓA
      wardId: z.string().min(1, 'Chọn phường/xã.'),
      detail: z.string().optional(),
    }),

    contact: z
      .object({
        phone: z.string().optional(),
        facebook: z.string().optional(),
        zalo: z.string().optional(),
      })
      .optional(),
    documents: z
      .array(z.string().url('Mỗi tài liệu phải là URL hợp lệ.'))
      .default([])
      .optional(),
  }),
  userId: z.string().optional(), // nếu backend lấy từ token có thể không gửi
});

type FormType = z.infer<typeof formSchema>;

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterShop() {
  const user = useCheckAuth();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [checking, setChecking] = useState(true);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopDraft: {
        name: '',
        categoryId: '',
        image: '',
        // Bỏ districtId trong defaultValues
        address: { provinceId: '', wardId: '', detail: '' },
        contact: { phone: '', facebook: '', zalo: '' },
        documents: [],
      },
      userId: user?._id,
    },
  });

  // 1. Watch provinceId
  const selectedProvinceId = form.watch('shopDraft.address.provinceId');

  // 2. Tính toán Province Code (Số 42) để truyền vào Ward Component
  const selectedProvinceCode = useMemo(() => {
    if (!selectedProvinceId || provinces.length === 0) return null;
    const p = provinces.find((item) => item._id === selectedProvinceId);
    return p ? p.code : null;
  }, [selectedProvinceId, provinces]);

  /* ---------- Preload tỉnh + Pre-check pending ---------- */
  useEffect(() => {
    (async () => {
      try {
        const result = await getProvinces();
        setProvinces(result || []);
        if (result?.length) {
          form.setValue('shopDraft.address.provinceId', result[0]._id, {
            shouldDirty: true,
          });
        }
      } catch {
        toast.error('Không tải được danh sách tỉnh/thành');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!user?._id) {
          setChecking(false);
          return;
        }
        // Tuỳ route backend của bạn — ví dụ: /seller-application/my?status=pending
        const res = await fetch(
          `${API}/seller-application/my?status=pending&userId=${user._id}`,
          { cache: 'no-store' }
        );
        if (res.ok) {
          const data = await res.json();
          const has =
            (Array.isArray(data) && data.length > 0) || (data?.total ?? 0) > 0;
          setHasPending(has);
        }
      } catch {
        // không khoá form chỉ vì lỗi mạng
      } finally {
        setChecking(false);
      }
    })();
  }, [user?._id]);

  /* ---------- Submit ---------- */
  const onSubmit = async (values: FormType) => {
    try {
      const payload = { ...values, userId: user?._id };
      await HandleCreateSellerApplication(payload as any);

      toast.success('Đã gửi hồ sơ đăng ký mở shop. Vui lòng chờ admin duyệt.');
      setHasPending(true);
      form.reset({
        shopDraft: {
          name: '',
          categoryId: '',
          image: '',
          // Reset address (giữ lại province mặc định nếu cần)
          address: {
            provinceId: form.getValues('shopDraft.address.provinceId') || '',
            wardId: '',
            detail: '',
          },
          contact: { phone: '', facebook: '', zalo: '' },
          documents: [],
        },
        userId: user?._id,
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.body?.message ||
        err?.response?.data?.message ||
        'Gửi hồ sơ thất bại, vui lòng thử lại.';

      // 🔒 Chặn spam: nếu server trả 409 (đã có pending)
      if (err?.status === 409 || /chờ duyệt/i.test(msg)) {
        setHasPending(true);
        toast.info(
          'Bạn đã đăng ký, vui lòng đợi admin duyệt trước khi gửi lại.'
        );
        return;
      }

      toast.error(msg);
    }
  };

  const onError = (e: any) => console.log(e);

  return (
    <Card className='max-w-4xl mx-auto mt-6 px-2 sm:px-6 md:px-10'>
      <CardHeader>
        <CardTitle className='text-2xl text-center'>Đăng ký bán hàng</CardTitle>
      </CardHeader>

      <CardContent>
        {hasPending && (
          <div className='mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800'>
            Bạn đã gửi hồ sơ đăng ký. Vui lòng chờ admin duyệt trước khi gửi
            lại.
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='space-y-8'
          >
            <fieldset
              disabled={hasPending || checking}
              className={hasPending ? 'opacity-60 pointer-events-none' : ''}
            >
              {/* 1) Thông tin cơ bản */}
              <section className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm'>
                    1
                  </span>
                  <h3 className='text-base font-semibold'>Thông tin cơ bản</h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='md:col-span-2'>
                    <InputForm
                      control={form.control}
                      name='shopDraft.name'
                      label='Tên shop'
                      placeholder='Nhập tên cửa hàng'
                    />
                  </div>

                  <InputSelectCategory
                    control={form.control}
                    name='shopDraft.categoryId'
                    label='Danh mục'
                    placeholder='Chọn danh mục'
                    parentSlugViewOnly={'dac-san-dia-phuong'}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label className='block mb-2'>Ảnh đại diện (URL)</Label>
                    <InputUploadSingleFile
                      control={form.control}
                      name='shopDraft.image'
                    />
                  </div>
                  <div>
                    <Label className='block mb-2'>Tài liệu (tuỳ chọn)</Label>
                    <InputUploadMultipleFiles
                      control={form.control}
                      name='shopDraft.documents'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Ví dụ: ảnh GPKD, CCCD, ảnh quầy hàng…
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <InputForm
                    control={form.control}
                    name='shopDraft.contact.phone'
                    label='Số điện thoại'
                    placeholder='VD: 0912xxxxxx'
                  />
                  <InputForm
                    control={form.control}
                    name='shopDraft.contact.facebook'
                    label='Facebook (link)'
                    placeholder='https://facebook.com/...'
                  />
                  <InputForm
                    control={form.control}
                    name='shopDraft.contact.zalo'
                    label='Zalo'
                    placeholder='Số/Zalo link (tuỳ)'
                  />
                </div>
              </section>

              {/* 2) Địa chỉ */}
              <section className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm'>
                    2
                  </span>
                  <h3 className='text-base font-semibold'>Địa chỉ</h3>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div>
                    <Label className='block mb-2'>Tỉnh</Label>
                    <Input
                      disabled
                      value={
                        provinces.find(
                          (p) =>
                            p._id === form.watch('shopDraft.address.provinceId')
                        )?.name || ''
                      }
                    />
                  </div>

                  {/* Đã xóa InputSelectDistrict */}

                  {/* Xã: Truyền selectedProvinceCode */}
                  <InputSelectWard
                    control={form.control}
                    name='shopDraft.address.wardId'
                    label='Xã/Phường'
                    provinceCode={selectedProvinceCode} 
                  />

                  <InputForm
                    control={form.control}
                    name='shopDraft.address.detail'
                    label='Địa chỉ chi tiết'
                    placeholder='VD: Số 10, Đường ABC…'
                  />
                </div>
              </section>

              {/* Submit */}
              <div className='pt-2 border-t'>
                <div className='text-center'>
                  <ButtonSubmit
                    isLoading={form.formState.isSubmitting}
                    text={checking ? 'Đang kiểm tra…' : 'Gửi hồ sơ đăng ký'}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}