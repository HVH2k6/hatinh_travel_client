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

import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { IShop } from '@/interfaces/IShop';
import { HandleUpdateShop } from '@/action/HandleShop';
import { useRouter } from 'next/navigation';

/* ============================ SCHEMA (chuẩn backend - Bỏ District) ============================ */
const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên cửa hàng phải từ 5 ký tự trở lên.' }),
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
});

type FormType = z.infer<typeof formSchema>;

const API = process.env.NEXT_PUBLIC_API_URL;
type Props = {
  data: IShop; // nhận trực tiếp từ server
};

export default function UpdateShop({ data }: Props) {
  const user = useCheckAuth();
  const router = useRouter();
  const [provinces, setProvinces] = useState<any[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || '',
      categoryId: (data as any)?.categoryId?._id ?? '',
      image: data.image || '',
      // Mapping Address (Bỏ District)
      address: {
        provinceId: (data as any)?.address?.provinceId?._id ?? '',
        wardId: (data as any)?.address?.wardId?._id ?? '',
        detail: (data as any)?.address?.detail ?? '',
      },
      contact: {
        phone: data?.contact?.phone,
        facebook: data?.contact?.facebook,
        zalo: data?.contact?.zalo,
      },
      documents: Array.isArray(data?.documents) ? data.documents : [],
    },
  });

  // 1. Watch provinceId
  const selectedProvinceId = form.watch('address.provinceId');

  // 2. Tính toán Province Code (Số 42) để truyền vào Ward Component
  const selectedProvinceCode = useMemo(() => {
    if (!selectedProvinceId || provinces.length === 0) return null;
    const p = provinces.find((item) => item._id === selectedProvinceId);
    return p ? p.code : null;
  }, [selectedProvinceId, provinces]);

  /* ---------- Preload tỉnh ---------- */
  useEffect(() => {
    (async () => {
      try {
        const result = await getProvinces();
        setProvinces(result || []);
        // Nếu data cũ chưa có province, set mặc định cái đầu
        if (!form.getValues('address.provinceId') && result?.length) {
          form.setValue('address.provinceId', result[0]._id);
        }
      } catch {
        toast.error('Không tải được danh sách tỉnh/thành');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Submit ---------- */
  const onSubmit = async (values: FormType) => {
    try {
      const payload = { ...values, userId: user?._id };
      await HandleUpdateShop(payload as any, data._id);

      toast.success('Cập nhật thành công');
      router.push('/quan-ly-cua-hang');
      router.refresh();
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.body?.message ||
        err?.response?.data?.message ||
        'Có lỗi xảy ra, vui lòng thử lại.';

      toast.error(msg);
    }
  };

  const onError = (e: any) => console.log(e);

  return (
    <Card className='max-w-4xl mx-auto mt-6 px-2 sm:px-6 md:px-10'>
      <CardHeader>
        <CardTitle className='text-2xl text-center'>Cập nhật Cửa hàng</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='space-y-8'
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
                    name='name'
                    label='Tên shop'
                    placeholder='Nhập tên cửa hàng'
                  />
                </div>

                <InputSelectCategory
                  control={form.control}
                  name='categoryId'
                  label='Danh mục'
                  placeholder='Chọn danh mục'
                  parentSlugViewOnly={'dac-san-dia-phuong'}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='block mb-2'>Ảnh đại diện (URL)</Label>
                  <InputUploadSingleFile control={form.control} name='image' />
                </div>
                <div>
                  <Label className='block mb-2'>Tài liệu (tuỳ chọn)</Label>
                  <InputUploadMultipleFiles
                    control={form.control}
                    name='documents'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Ví dụ: ảnh GPKD, CCCD, ảnh quầy hàng…
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <InputForm
                  control={form.control}
                  name='contact.phone'
                  label='Số điện thoại'
                  placeholder='VD: 0912xxxxxx'
                />
                <InputForm
                  control={form.control}
                  name='contact.facebook'
                  label='Facebook (link)'
                  placeholder='https://facebook.com/...'
                />
                <InputForm
                  control={form.control}
                  name='contact.zalo'
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

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div>
                  <Label className='block mb-2'>Tỉnh</Label>
                  <Input
                    disabled
                    value={
                      provinces.find(
                        (p) => p._id === form.watch('address.provinceId')
                      )?.name || ''
                    }
                  />
                </div>

                {/* Đã xóa InputSelectDistrict */}

                {/* Xã: Truyền selectedProvinceCode */}
                <InputSelectWard
                  control={form.control}
                  name='address.wardId'
                  label='Xã/Phường'
                  provinceCode={selectedProvinceCode}
                />

                <InputForm
                  control={form.control}
                  name='address.detail'
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
                  text={'Cập nhật'}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}