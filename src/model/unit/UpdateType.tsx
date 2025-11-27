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
import { ICategory } from '@/interfaces/ICategory';
import { HandleUpdateCategory } from '@/action/HandleCategory';
import { IType } from '@/interfaces/IType';
import { HandleUpdateType } from '@/action/HandleType';


const schema = z.object({
  name: z.string().min(2, 'Tên loai hình tối thiểu 2 ký tự'),
  description: z.string().optional(),
  
});
type FormType = z.infer<typeof schema>;

type Props = {
  data: IType; // nhận trực tiếp từ server
};

export default function UpdateType({ data }: Props) {
  const router = useRouter();
  

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.name || '',
      description: data.description || '',
      
    },
  });


  const onSubmit = async (values: FormType) => {
    try {
      await HandleUpdateType(values, data._id);
      toast.success('Cập nhật loại hình thành công');
      router.push('/quan-ly/loai-hinh');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Cập nhật loại hình thất bại');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cập nhật loại hình</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputForm control={form.control} name="name" label="Tên loại hình" placeholder="Ví dụ: Địa điểm tham quan" />
            <InputForm control={form.control} name="description" label="Mô tả (tuỳ chọn)" placeholder="Mô tả ngắn…" />

  

            <div className="text-center">
              <ButtonSubmit isLoading={form.formState.isSubmitting} text="Lưu thay đổi" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
