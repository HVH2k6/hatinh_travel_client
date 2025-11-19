'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { InputForm } from '@/components/input/InputForm';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import { InputSelectDistrict } from '@/components/input/InputSelectDistrict';
import { InputSelectWard } from '@/components/input/InputSelectWard';
import ButtonSubmit from '@/components/button/ButtonSubmit';

import { getProvinces } from '@/util/constant';
import { useCheckAuth } from '@/components/auth/checkauth';
import { toast } from 'react-toastify';

import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { IShop } from '@/interfaces/IShop';
import { HandleUpdateShop } from '@/action/HandleShop';
import { useRouter } from 'next/navigation';
import RichText from '@/components/editor/RichText';
import { InputPrice } from '@/components/input/InputPrice';
import { HandleCreateProduct } from '@/action/HandleProduct';

/* ============================ SCHEMA (chuẩn backend) ============================ */
const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên cửa hàng phải từ 5 ký tự trở lên.' }),
  shopId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  image: z.string().url('Ảnh đại diện phải là URL hợp lệ.').optional(),
  price: z
    .number({
      required_error: 'Vui lòng nhập giá .',
      invalid_type_error: 'Giá  phải là số.',
    })
    .nonnegative({ message: 'Giá  không được âm.' }),
  description: z
    .string()
    .min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
  
  list_image: z
    .array(z.string().url('Mỗi tài liệu phải là URL hợp lệ.'))
    .default([])
    .optional(),
});

type FormType = z.infer<typeof formSchema>;

const API = process.env.NEXT_PUBLIC_API_URL;
type Props = {
  data: IShop; // nhận trực tiếp từ server
};

export default function CreateProduct({ data }: Props) {
  // console.log(data)
  const user = useCheckAuth();

  const [provinces, setProvinces] = useState<any[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shopId: data._id,
      description: '',

      image: '',
      price: 0,
     
      list_image: [],
    },
  });

  const router = useRouter();

  const onSubmit = async (values: FormType) => {
    try {
      const payload = { ...values };
      await HandleCreateProduct(payload as any);

      toast.success('Cập nhật thành công');

      form.reset({
        name: '',
        shopId: '',
        image: '',
        price: 0,

        description: '',
        // contact: { phone: '', facebook: '', zalo: '' },
        list_image: [],
      });
      router.push('/quan-ly-cua-hang');
      //   console.log("values >>>>>>>", values);
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
        <CardTitle className='text-2xl text-center'>Caapj nh</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='space-y-8'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputForm
                control={form.control}
                name='name'
                label='Tên sản phẩm'
              />
              <InputPrice control={form.control} name='price' label='Giá' />
            </div>
            {/* 1) Thông tin cơ bản */}
            <section className='space-y-4'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm'>
                  1
                </span>
                <h3 className='text-base font-semibold'>Thông tin cơ bản</h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='block mb-2'>Ảnh đại diện (URL)</Label>
                  <InputUploadSingleFile control={form.control} name='image' />
                </div>
                <div>
                  <Label className='block mb-2'>Ảnh mô tả thêm</Label>
                  <InputUploadMultipleFiles
                    control={form.control}
                    name='list_image'
                  />
                </div>
              </div>
            </section>

            <section className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm'>
                    6
                  </span>
                  <h3 className='text-base font-semibold'>Mô tả chi tiết</h3>
                </div>
              </div>

              <Controller
                control={form.control}
                name='description'
                render={({ field, fieldState }) => (
                  <div>
                    <RichText
                      value={field.value}
                      onChange={(html) => field.onChange(html)}
                      placeholder='Mô tả nổi bật, trải nghiệm, thời điểm lý tưởng, lưu ý…'
                    />
                    {fieldState.error?.message ? (
                      <p className='text-sm text-red-500 mt-2'>
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />
            </section>

            {/* Submit */}
            <div className='pt-2 border-t'>
              <div className='text-center'>
                <ButtonSubmit
                  isLoading={form.formState.isSubmitting}
                  text={'Tạo sản phẩm'}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
