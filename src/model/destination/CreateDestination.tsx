'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { InputForm } from '@/components/input/InputForm';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectedType } from '@/components/input/InputSelectedType';
import { InputSelectDistrict } from '@/components/input/InputSelectDistrict';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputSelectWard } from '@/components/input/InputSelectWard';
import { STATUS } from '@/util/constant';
import { HandleCreateDestination } from '@/action/HandleDestination';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import { useCheckAuth } from '@/components/auth/checkauth';

const formSchema = z.object({
  name: z.string(),
  image: z.string().url(), // ← ✅ Thay vì z.instanceof(File)
  list_image: z.array(z.string()),
  description: z.string(),
  categoryId: z.string(),
  typeId: z.string(),
  address: z.object({
    provinceId: z.string(),
    districtId: z.string(),
    wardId: z.string(),
    detail: z.string().optional(),
  }),
  status: z.string(),
  isFree: z.boolean(),
  minPrice: z.number(),
  maxPrice: z.number(),
  createdBy: z.string().optional(),
  mapUrl: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;

const CreateDestination = () => {
  const [free, setFree] = useState(false);
  const user = useCheckAuth()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '',
      list_image: [],
      description: '',
      categoryId: '',
      typeId: '',
      address: {
        provinceId: '6864a83b662a27b3f1320469', // Hà Tĩnh
        districtId: '',
        wardId: '',
        detail: '',
      },
      status: STATUS.PENDING,
      isFree: false,
      minPrice: 0,
      maxPrice: 0,
      createdBy: '',
      mapUrl: '',
    },
  });

  const districtId = form.watch('address.districtId');

  const listStatus = [
    {
      value: STATUS.ACTIVE,
      label: 'Hoạt động',
    },
    {
      value: STATUS.PENDING,
      label: 'Chờ duyệt',
    },
    {
      value: STATUS.DELETED,
      label: 'Đã xóa',
    },
  ];

  const createdBy = user ? user._id : '';
  const onSubmit = async (values: FormType) => {
    values.createdBy = createdBy;
    await HandleCreateDestination(values);
  };

  const onError = (errors: any) => {
    console.warn('❌ Validation errors:', errors);
  };

  return (
    <Card className='max-w-5xl mx-auto mt-10 w-5xl'>
      <CardHeader>
        <CardTitle className='text-2xl text-center'>
          Tạo địa điểm du lịch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className='space-y-4'
            encType='multipart/form-data'
          >
            <div className='grid grid-cols-2 gap-4'>
              <InputForm
                control={form.control}
                name='name'
                label='Tên địa điểm du lịch'
                placeholder='Nhập tên'
                className='w-full'
              />
              <InputForm
                control={form.control}
                name='description'
                label='Mô tả'
                placeholder='Nhập mô tả'
                className='w-full'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputSelectCategory
                control={form.control}
                name='categoryId'
                label='Danh mục'
              />
              <InputSelectedType
                control={form.control}
                name='typeId'
                label='Loại hình'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center space-x-2'>
                <Label>Miễn phí</Label>
                <RadioGroup
                  defaultValue='false'
                  name='isFree'
                  className='flex items-center space-x-2'
                  onValueChange={(value) => {
                    const isFreeValue = value === 'true';
                    setFree(isFreeValue);
                    form.setValue('isFree', isFreeValue);
                    if (isFreeValue) {
                      form.setValue('minPrice', 0);
                      form.setValue('maxPrice', 0);
                    }
                  }}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='false' />
                    <Label>Không</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='true' />
                    <Label>Có</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className='flex items-center space-x-2'>
                <Label>Trang thái</Label>
                <RadioGroup
                  defaultValue={STATUS.PENDING}
                  name='status'
                  className='flex items-center space-x-2'
                  onValueChange={(value) => {
                    form.setValue('status', value);
                  }}
                >
                  {listStatus.map((item) => (
                    <div
                      className='flex items-center space-x-2'
                      key={item.value}
                    >
                      <RadioGroupItem value={item.value} />
                      <Label>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <InputPrice
                control={form.control}
                name='minPrice'
                label='Giá thấp nhất'
                placeholder='VD: 1,000'
                className='w-full'
                disabled={free}
              />
              <InputPrice
                control={form.control}
                name='maxPrice'
                label='Giá cao nhất'
                placeholder='VD: 5,000'
                className='w-full'
                disabled={free}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <InputUploadSingleFile
                  onUploadSuccess={(url) => {
                    form.setValue('image', url);
                  }}
                />
              </FormItem>

              <FormItem>
                <FormLabel>Ảnh phụ</FormLabel>
                <InputUploadMultipleFiles
                  onUploadSuccess={(urls) => form.setValue('list_image', urls)}
                />
              </FormItem>
            </div>

            <div className='grid 2xl:grid-cols-4 gap-4'>
              <div className='grid gap-2'>
                <FormLabel>Tỉnh</FormLabel>
                <Input defaultValue={'Tỉnh Hà Tĩnh'} disabled />
              </div>
              <InputSelectDistrict
                control={form.control}
                name='address.districtId'
                label='Huyện'
              />
              <InputSelectWard
                control={form.control}
                name='address.wardId'
                label='Xã/Phường'
                districtId={districtId}
              />
              <InputForm
                control={form.control}
                name='address.detail'
                label='Địa chỉ chi tiết'
                placeholder='VD: Thôn 3, xã ABC'
                className='w-full'
              />
            </div>

            <Button type='submit' className='w-full'>
              Tạo địa điểm
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateDestination;
