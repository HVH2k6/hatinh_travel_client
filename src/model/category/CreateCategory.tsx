'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputForm } from '@/components/input/InputForm';
import { ICategory } from '@/interfaces/ICategory';
import { Skeleton } from '@/components/ui/skeleton';

const NONE_VALUE = '__none__';

const schema = z.object({
  name: z.string().min(2, 'Tên danh mục tối thiểu 2 ký tự'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(), // null = không có cha
});
type FormType = z.infer<typeof schema>;

export default function CreateCategory() {
  const router = useRouter();
  const [parents, setParents] = useState<ICategory[]>([]);
  const [loadingParents, setLoadingParents] = useState<boolean>(true);

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', parentId: null },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?limit=1000`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Không tải được danh mục cha');
        const json = await res.json();
        if (!cancelled) setParents(json?.data || []);
      } catch (e: any) {
        toast.error(e?.message || 'Lỗi tải danh mục cha');
      } finally {
        if (!cancelled) setLoadingParents(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onSubmit = async (values: FormType) => {
    try {
      // await createCategory({ ...values, parentId: values.parentId || null });
      toast.success('Tạo danh mục thành công');
      router.push('/quan-ly/danh-muc');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Tạo danh mục thất bại');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Tạo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InputForm control={form.control} name="name" label="Tên danh mục" placeholder="Ví dụ: Địa điểm tham quan" />

            <InputForm control={form.control} name="description" label="Mô tả (tuỳ chọn)" placeholder="Mô tả ngắn…" />

            <div>
              <Label className="mb-2 block">Danh mục cha (tuỳ chọn)</Label>

              {loadingParents ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Controller
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <Select
                      // Khi null -> undefined để hiện placeholder. KHÔNG dùng ''.
                      value={field.value ?? undefined}
                      onValueChange={(v) => field.onChange(v === NONE_VALUE ? null : v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="— Không chọn —" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Sentinel thay cho value rỗng */}
                        <SelectItem value={NONE_VALUE}>— Không chọn —</SelectItem>
                        {parents.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </div>

            <div className="text-center">
              <ButtonSubmit isLoading={form.formState.isSubmitting} text="Tạo danh mục" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
