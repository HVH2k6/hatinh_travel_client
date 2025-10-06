'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputForm } from '@/components/input/InputForm';
import { HandleCreateCategory } from '@/action/HandleCategory';
import { HandleCreateType } from '@/action/HandleType';



const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  description: z.string().optional(),
  
});
type FormType = z.infer<typeof schema>;

export default function CreateType() {
  const router = useRouter();
 
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: ''},
  });

  

  const onSubmit = async (values: FormType) => {
    console.log("🚀 ~ onSubmit ~ values:", values)
    try {
      // await createCategory({ ...values, parentId: values.parentId || null });
      await HandleCreateType(values)
      toast.success('Tạo thành công');
      router.push('/quan-ly/loai-hinh');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Tạo thất bại');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Tạo loại hình</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputForm control={form.control} name="name" label="Tên danh mục" placeholder="Ví dụ: Địa điểm tham quan" />

            <InputForm control={form.control} name="description" label="Mô tả (tuỳ chọn)" placeholder="Mô tả ngắn…" />

     
            <div className="text-center">
              <ButtonSubmit isLoading={form.formState.isSubmitting} text="Tạo loại hình" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
