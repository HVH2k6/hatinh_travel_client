'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Image as ImageIcon, MapPin, Info, ArrowLeft } from 'lucide-react';

import { Form } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputForm } from '@/components/input/InputForm';
import { Label } from '@/components/ui/label';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import { InputPrice } from '@/components/input/InputPrice';
// Đã xóa InputSelectDistrict
import { InputSelectWard } from '@/components/input/InputSelectWard';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { getProvinces } from '@/util/constant';
import { Button } from '@/components/ui/button';
import { HandleCreateFood } from '@/action/HandleFood';
import RichText from '@/components/editor/RichText';

/* ====================== SCHEMA (Đã bỏ districtId) ====================== */
const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  description: z.string().optional(),
  image: z.string().url('Ảnh đại diện phải là URL hợp lệ.'),
  list_image: z.array(z.string().url()).default([]).optional(),
  ingredients: z.string().min(2, 'Nguyên liệu tối thiểu 2 ký tự'),
  price: z
    .number({ required_error: 'Vui lòng nhập giá.' })
    .nonnegative({ message: 'Giá không được âm.' }),

  // Address Schema mới
  address: z.object({
    provinceId: z.string().min(1, { message: 'Chọn tỉnh/thành phố.' }),
    // districtId: ... -> ĐÃ XÓA
    wardId: z.string().min(1, { message: 'Chọn phường/xã.' }),
    detail: z.string().optional(),
  }),
});

type FormType = z.infer<typeof schema>;

export default function CreateFood() {
  const router = useRouter();
  const [provinces, setProvinces] = useState<any[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      list_image: [],
      ingredients: '',
      price: 0,
      // Bỏ districtId trong defaultValues
      address: { provinceId: '', wardId: '', detail: '' },
    },
  });

  // 1. Watch provinceId
  const selectedProvinceId = form.watch('address.provinceId');

  // 2. Tính toán Province Code để truyền vào Ward Component
  const selectedProvinceCode = useMemo(() => {
    if (!selectedProvinceId || provinces.length === 0) return null;
    const p = provinces.find((item) => item._id === selectedProvinceId);
    return p ? p.code : null;
  }, [selectedProvinceId, provinces]);

  /* ---------- Effects ---------- */
  useEffect(() => {
    (async () => {
      const result = await getProvinces();
      setProvinces(result || []);
      if (result?.length) {
        // Mặc định chọn Tỉnh đầu tiên
        form.setValue('address.provinceId', result[0]._id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: FormType) => {
    try {
      await HandleCreateFood(values);
      toast.success('Tạo món ăn thành công');
      router.push('/quan-ly/dac-san');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Tạo thất bại');
    }
  };

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      {/* Header Page */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900'>
              Thêm mới Đặc sản
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Điền thông tin chi tiết để đăng tải món ăn đặc sản địa phương.
            </p>
          </div>
        </div>
        <div className='hidden sm:block'>
          {/* Nút Cancel hoặc Save Draft nếu cần */}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* --- CỘT TRÁI: NỘI DUNG CHÍNH (Chiếm 2 phần) --- */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Block 1: Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center text-lg'>
                    <Info className='w-5 h-5 mr-2 text-blue-600' /> Thông tin
                    chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-5'>
                  <InputForm
                    control={form.control}
                    name='name'
                    label='Tên món ăn'
                    placeholder='Ví dụ: Bánh Cu đơ Hà Tĩnh'
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <InputPrice
                      control={form.control}
                      name='price'
                      label='Giá tham khảo (VNĐ)'
                      placeholder='0'
                    />
                    <InputForm
                      control={form.control}
                      name='ingredients'
                      label='Nguyên liệu chính'
                      placeholder='Lạc, mật mía, gừng...'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label className='sr-only'>Mô tả</Label>
                    <Controller
                      control={form.control}
                      name='description'
                      render={({ field, fieldState }) => (
                        <div className='prose-editor'>
                          <RichText
                            value={field.value}
                            onChange={(html) => field.onChange(html)}
                            placeholder='Mô tả'
                          />
                          {fieldState.error?.message && (
                            <p className='text-sm text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-200 inline-block'>
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Block 2: Hình ảnh */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center text-lg'>
                    <ImageIcon className='w-5 h-5 mr-2 text-purple-600' /> Hình
                    ảnh
                  </CardTitle>
                  <CardDescription>
                    Hình ảnh chất lượng cao giúp món ăn hấp dẫn hơn.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Ảnh đại diện */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                    <div className='sm:col-span-1'>
                      <Label className='mb-2 block font-semibold text-sm'>
                        Ảnh đại diện *
                      </Label>
                      <InputUploadSingleFile
                        control={form.control}
                        name='image'
                      />
                    </div>
                    <div className='sm:col-span-2'>
                      <Label className='mb-2 block font-semibold text-sm'>
                        Bộ sưu tập ảnh
                      </Label>
                      <InputUploadMultipleFiles
                        control={form.control}
                        name='list_image'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- CỘT PHẢI: SETTINGS & SUBMIT (Chiếm 1 phần) --- */}
            <div className='lg:col-span-1'>
              <div className='sticky top-6 space-y-6'>
                {/* Block 3: Địa điểm */}
                <Card>
                  <CardHeader className='bg-slate-50 border-b pb-4'>
                    <CardTitle className='flex items-center text-lg'>
                      <MapPin className='w-5 h-5 mr-2 text-red-600' /> Khu vực
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 pt-6'>
                    <div>
                      <Label className='block mb-2 text-xs uppercase text-gray-500 font-bold'>
                        Tỉnh / Thành phố
                      </Label>
                      <Input
                        disabled
                        className='bg-slate-100 font-medium text-slate-700'
                        value={
                          provinces.find(
                            (p) => p._id === form.watch('address.provinceId')
                          )?.name || 'Hà Tĩnh'
                        }
                      />
                    </div>

                    {/* Đã xóa InputSelectDistrict */}

                    {/* Xã: Truyền provinceCode vào đây */}
                    <InputSelectWard
                      control={form.control}
                      name='address.wardId'
                      label='Phường / Xã'
                      provinceCode={selectedProvinceCode}
                    />

                    {/* Chi tiết */}
                    <InputForm
                      control={form.control}
                      name='address.detail'
                      label='Địa chỉ cụ thể'
                      placeholder='Số nhà, thôn, xóm...'
                    />
                  </CardContent>
                </Card>

                {/* Block 4: Submit Action */}
                <Card className='border-none shadow-none bg-transparent'>
                  <ButtonSubmit
                    isLoading={form.formState.isSubmitting}
                    text='Hoàn tất & Đăng bài'
                  />
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
