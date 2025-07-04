'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import InputForm from '@/components/input/InputForm';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';

const formSchema = z.object({
  name: z.string().min(1),
  image: z.instanceof(File),
  list_image: z.array(z.instanceof(File)).min(1),
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
  createdBy: z.string(),
  mapUrl: z.string().url(),
});

type FormType = z.infer<typeof formSchema>;

const CreateDestination = () => {
  const [previewMain, setPreviewMain] = useState<string | null>(null);
  const [previewList, setPreviewList] = useState<string[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: {
        provinceId: '',
        districtId: '',
        wardId: '',
        detail: '',
      },
      status: 'draft',
      isFree: true,
      minPrice: 0,
      maxPrice: 0,
      createdBy: '',
      mapUrl: '',
    },
  });

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setPreviewMain(URL.createObjectURL(file));
    }
  };

  const handleListImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue('list_image', files);
    setPreviewList(files.map((f) => URL.createObjectURL(f)));
  };

  const onSubmit = (values: FormType) => {
    console.log('Submit:', values);
    // Handle upload here
  };

  return (
    <Card className='max-w-5xl mx-auto mt-10 w-4xl'>
      <CardHeader>
        <CardTitle>Tạo địa điểm du lịch</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <InputForm
                control={form.control}
                name='name'
                label='Tên địa điểm du lịch'
                placeholder='Nhập tên địa điểm du lịch'
                className='w-full'
              />
              <InputForm
                control={form.control}
                name='description'
                label='Mô tả địa điểm du lịch'
                placeholder='Nhập mô tả địa điểm du lịch'
                className='w-full'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <InputSelectCategory
                control={form.control}
                name='categoryId'
                label='Danh mục'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <InputForm
                control={form.control}
                name='minPrice'
                label='Giá tham khảo thấp nhất'
                placeholder='Nhập giá tham khảo thấp nhất'
                className='w-full'
              />
              <InputForm
                control={form.control}
                name='maxPrice'
                label='Giá tham khảo cao nhất'
                placeholder='Nhập giá tham khảo cao nhất'
                className='w-full'
              />
            </div>

            <FormItem>
              <FormLabel>Ảnh chính</FormLabel>
              <Input type='file' onChange={handleMainImage} />
              {previewMain && (
                <img src={previewMain} alt='preview' className='mt-2 h-32' />
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Danh sách ảnh</FormLabel>
              <Input type='file' multiple onChange={handleListImages} />
              <div className='grid grid-cols-3 gap-2 mt-2'>
                {previewList.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt='preview'
                    className='h-24 object-cover'
                  />
                ))}
              </div>
            </FormItem>

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
