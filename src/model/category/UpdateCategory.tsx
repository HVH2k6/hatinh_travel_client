'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputForm } from '@/components/input/InputForm';
import { ICategory } from '@/interfaces/ICategory';
import { Skeleton } from '@/components/ui/skeleton';
import { HandleUpdateCategory } from '@/action/HandleCategory';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';

const NONE_VALUE = '__none__';

const schema = z.object({
  name: z.string().min(2, 'Tên danh mục tối thiểu 2 ký tự'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
});
type FormType = z.infer<typeof schema>;

type Props = {
  data: ICategory; // nhận trực tiếp từ server
};

export default function UpdateCategory({ data }: Props) {
  const router = useRouter();
  const [parents, setParents] = useState<ICategory[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.name || '',
      description: data.description || '',
      parentId: (data as any)?.parentId ?? null,
    },
  });

  // load parents
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category?limit=1000`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Không tải được danh mục cha');
        const json = await res.json();
        if (!cancelled) setParents(json?.data || []);
      } catch (e: any) {
        toast.error(e?.message || 'Lỗi tải danh mục cha');
      } finally {
        if (!cancelled) setLoadingParents(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const parentOptions = useMemo(() => {
    return parents.filter((p) => p._id !== data._id);
  }, [parents, data._id]);

  const onSubmit = async (values: FormType) => {
    try {
      await HandleUpdateCategory(values, data._id);
      toast.success('Cập nhật danh mục thành công');
      router.push('/quan-ly/danh-muc');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Cập nhật danh mục thất bại');
    }
  };

  return (
    <Card className='max-w-3xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle className='text-2xl text-center'>
          Cập nhật danh mục
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <InputForm
              control={form.control}
              name='name'
              label='Tên danh mục'
              placeholder='Ví dụ: Địa điểm tham quan'
            />
            <InputForm
              control={form.control}
              name='description'
              label='Mô tả (tuỳ chọn)'
              placeholder='Mô tả ngắn…'
            />

            <div>
              <Label className='mb-2 block'>Danh mục cha (tuỳ chọn)</Label>
              {loadingParents ? (
                <Skeleton className='h-10 w-full' />
              ) : (
                <InputSelectCategory
                  control={form.control}
                  name='parentId'
                  
                  placeholder='Ví dụ: Địa điểm tham quan'
                />
              )}
            </div>

            <div className='text-center'>
              <ButtonSubmit
                isLoading={form.formState.isSubmitting}
                text='Lưu thay đổi'
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
