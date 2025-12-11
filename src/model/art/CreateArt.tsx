'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { InputForm } from '@/components/input/InputForm';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';

// Component chọn xã (đã sửa ở các bước trước)
import { InputSelectWard } from '@/components/input/InputSelectWard';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import RichText from '@/components/editor/RichText';

import { getProvinces } from '@/util/constant';
import { HandleCreateArt } from '@/action/HandleArt';
import { MapPin, Image as ImageIcon, Info, FileText, ArrowLeft } from 'lucide-react';

/* ============================ SCHEMA ============================ */
export const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên địa điểm phải từ 5 ký tự trở lên.' }),
  image: z.string().url({ message: 'Vui lòng chọn hình ảnh hợp lệ (dạng URL).' }),
  list_image: z
    .array(z.string().url({ message: 'Mỗi hình ảnh phải là một URL hợp lệ.' }))
    .optional(),
  description: z.string().min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  video_url: z.string().optional(),
  
  // Address Schema: Bỏ districtId
  address: z.object({
    provinceId: z.string().min(1, { message: 'Chọn tỉnh/thành phố.' }),
    wardId: z.string().min(1, { message: 'Chọn phường/xã.' }),
    detail: z.string().optional(),
  }),
});

type FormType = z.infer<typeof formSchema>;

/* ============================ COMPONENT ============================ */
const CreateArt = () => {
  const router = useRouter();
  const [provinces, setProvinces] = useState<any[]>([]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '',
      list_image: [],
      description: '',
      categoryId: '',
      video_url: '',
      address: { provinceId: '', wardId: '', detail: '' },
    },
  });

  // 1. Watch provinceId
  const selectedProvinceId = form.watch('address.provinceId');

  // 2. Tính toán Province Code (Số 42) từ ID (String)
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
        // Mặc định chọn tỉnh đầu tiên (Hà Tĩnh)
        form.setValue('address.provinceId', result[0]._id);
      }
    })();
  }, [form]);

  /* ---------- Submit ---------- */
  const handleSubmit = async (values: FormType) => {
    const payload = { ...values };
    const ok = await HandleCreateArt(payload as any);
    if (ok) {
      toast.success('Tạo thành công');
      router.push('/quan-ly/van-hoa-nghe-thuat'); // Redirect sau khi tạo
      router.refresh();
    }
  };

  const handleError = (e: any) => console.log(e);

  /* ---------- UI Sections Helper ---------- */
  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-4 text-primary">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 pl-0 hover:bg-transparent hover:underline">
          <ArrowLeft size={16} /> Quay lại
        </Button>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center border-b bg-gray-50/50 pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800">Tạo mới Văn hóa & Nghệ thuật</CardTitle>
          <CardDescription>Nhập thông tin chi tiết để chia sẻ địa điểm văn hóa mới</CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-10">
              
              {/* PHẦN 1: THÔNG TIN CHUNG */}
              <section>
                <SectionHeader icon={Info} title="Thông tin cơ bản" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Tên: Chiếm 8/12 cột */}
                  <div className="md:col-span-8">
                    <InputForm
                      control={form.control}
                      name="name"
                      label="Tên địa điểm / Tác phẩm"
                      placeholder="Nhập tên đầy đủ..."
                    />
                  </div>
                  
                  {/* Danh mục: Chiếm 4/12 cột */}
                  <div className="md:col-span-4">
                    <InputSelectCategory
                      control={form.control}
                      name="categoryId"
                      label="Danh mục"
                      placeholder="Chọn loại hình"
                      parentSlugViewOnly={'nghe-thuat'}
                    />
                  </div>

                  {/* Video URL: Full dòng */}
                  <div className="md:col-span-12">
                    <InputForm
                      control={form.control}
                      name="video_url"
                      label="Video giới thiệu (YouTube/Vimeo)"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* PHẦN 2: VỊ TRÍ */}
              <section>
                <SectionHeader icon={MapPin} title="Địa chỉ & Vị trí" />
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tỉnh - Disabled field */}
                    <div className="space-y-2">
                      <Label>Tỉnh / Thành phố</Label>
                      <Input
                        disabled
                        className="bg-gray-100 font-medium text-gray-600 cursor-not-allowed"
                        value={
                          provinces.find((p) => p._id === form.watch('address.provinceId'))?.name ||
                          'Đang tải...'
                        }
                      />
                    </div>

                    {/* Xã: Truyền selectedProvinceCode vào đây */}
                    <InputSelectWard
                      control={form.control}
                      name="address.wardId"
                      label="Phường / Xã"
                      provinceCode={selectedProvinceCode} 
                    />

                    {/* Chi tiết */}
                    <InputForm
                      control={form.control}
                      name="address.detail"
                      label="Số nhà, đường, thôn..."
                      placeholder="VD: Số 123 đường ABC"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* PHẦN 3: HÌNH ẢNH */}
              <section>
                <SectionHeader icon={ImageIcon} title="Hình ảnh minh họa" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Ảnh đại diện: 4 cột */}
                  <div className="md:col-span-4 space-y-2">
                    <Label className="font-medium text-gray-700">Ảnh đại diện (Thumbnail)</Label>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <InputUploadSingleFile control={form.control} name="image" />
                    </div>
                    <p className="text-xs text-muted-foreground">Ảnh này sẽ hiện ở danh sách chính.</p>
                  </div>

                  {/* Album ảnh: 8 cột */}
                  <div className="md:col-span-8 space-y-2">
                    <Label className="font-medium text-gray-700">Album ảnh chi tiết</Label>
                    <div className="bg-gray-50 p-4 rounded-lg border min-h-[150px]">
                      <InputUploadMultipleFiles control={form.control} name="list_image" />
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* PHẦN 4: NỘI DUNG CHI TIẾT */}
              <section>
                <SectionHeader icon={FileText} title="Bài viết chi tiết" />
                <div className="space-y-2">
                  <Label className="sr-only">Mô tả</Label>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <div className="prose-editor">
                        <RichText
                          value={field.value}
                          onChange={(html) => field.onChange(html)}
                          placeholder="Viết bài cảm nhận, lịch sử hình thành, điểm nổi bật..."
                        />
                        {fieldState.error?.message && (
                          <p className="text-sm text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-200 inline-block">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </section>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t mt-8">
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="w-full sm:w-auto"
                   onClick={() => router.back()}
                 >
                   Hủy bỏ
                 </Button>
                 <div className="w-full sm:w-auto">
                    <ButtonSubmit
                      isLoading={form.formState.isSubmitting}
                      text="Đăng bài ngay"
                    />
                 </div>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateArt;