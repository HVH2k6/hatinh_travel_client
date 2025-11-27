'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  Save, 
  Package, 
  LayoutGrid, 
  Image as ImageIcon, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { InputForm } from '@/components/input/InputForm';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import RichText from '@/components/editor/RichText';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectedUnit } from '@/components/input/InputSelectedUnit'; // Import component chọn đơn vị
import { HandleUpdateProduct } from '@/action/HandleProduct';
import { IProduct } from '@/interfaces/IProduct';

/* ============================ SCHEMA ============================ */
const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên sản phẩm phải từ 5 ký tự trở lên.' }),
  shopId: z.string().min(1, { message: 'Vui lòng chọn.' }),
  image: z.string().url('Ảnh đại diện phải là URL hợp lệ.').optional(),
  price: z.number({ required_error: 'Vui lòng nhập giá.' }).nonnegative({ message: 'Giá không được âm.' }),
  description: z.string().min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
  unitId: z.string().min(1, { message: 'Vui lòng chọn đơn vị tính.' }),
  list_image: z.array(z.string().url()).default([]).optional(),
});

type FormType = z.infer<typeof formSchema>;

type Props = {
  data: IProduct;
};

export default function UpdateProduct({ data }: Props) {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || '',
      shopId: typeof data.shopId === 'string' ? data.shopId : data.shopId?._id || '',
      description: data.description || '',
      // Xử lý an toàn cho unitId (nếu data trả về là object thì lấy _id, nếu string thì giữ nguyên)
      unitId: typeof data.unitId === 'string' ? data.unitId : data.unitId?._id || '', 
      image: data.image || '',
      price: data.price || 0,
      list_image: Array.isArray(data?.list_image) ? data.list_image : [],
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      const payload = { ...values };
      await HandleUpdateProduct(payload as any, data._id);
      
      toast.success('Cập nhật thành công');
      router.push(`/quan-ly-cua-hang/danh-sach-san-pham/${typeof data.shopId === 'string' ? data.shopId : data.shopId?._id}`);
      router.refresh();
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-6 mb-20 px-4">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/quan-ly-cua-hang/danh-sach-san-pham/${typeof data.shopId === 'string' ? data.shopId : data.shopId?._id}`}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
             <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cập nhật sản phẩm</h1>
             <p className="text-sm text-muted-foreground line-clamp-1">
               Đang chỉnh sửa: <span className="font-semibold text-blue-600">{data.name}</span>
             </p>
          </div>
        </div>
        
      
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* === CỘT TRÁI (CHIẾM 2/3) === */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* CARD 1: THÔNG TIN CHÍNH */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-blue-500" />
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputForm
                    control={form.control}
                    name="name"
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm..."
                  />
                  
                  <div className="space-y-2">
                    <Label>Mô tả chi tiết</Label>
                    <Controller
                      control={form.control}
                      name="description"
                      render={({ field, fieldState }) => (
                        <div>
                          <RichText
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Mô tả đặc điểm, nguồn gốc, cách sử dụng..."
                          />
                          {fieldState.error && (
                            <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: THƯ VIỆN ẢNH */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LayoutGrid className="w-5 h-5 text-purple-500" />
                    Thư viện ảnh
                  </CardTitle>
                  <CardDescription>Tải lên nhiều ảnh mô tả thêm về sản phẩm.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputUploadMultipleFiles
                    control={form.control}
                    name="list_image"
                  />
                </CardContent>
              </Card>
            </div>

            {/* === CỘT PHẢI (CHIẾM 1/3) === */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* CARD 3: GIÁ & ĐƠN VỊ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Giá & Đơn vị</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputPrice 
                    control={form.control} 
                    name="price" 
                    label="Giá bán (VNĐ)" 
                  />
                  
                  <Separator />
                  
                  {/* Bổ sung component chọn Unit mà form cũ bị thiếu */}
                  <InputSelectedUnit 
                    control={form.control} 
                    name="unitId" 
                  />
                </CardContent>
              </Card>

              {/* CARD 4: ẢNH ĐẠI DIỆN */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-orange-500" />
                    Ảnh đại diện
                  </CardTitle>
                  <CardDescription>Hình ảnh chính hiển thị trên danh sách.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputUploadSingleFile 
                    control={form.control} 
                    name="image" 
                  />
                </CardContent>
              </Card>

              {/* Mobile Action Button */}
              <div className="block md:hidden pt-4">
                 <ButtonSubmit 
                    isLoading={form.formState.isSubmitting} 
                    text="Lưu thay đổi"
                    // className="w-full"
                 />
              </div>
  <div className="hidden md:block">
           <ButtonSubmit 
              isLoading={form.formState.isSubmitting} 
              text="Lưu thay đổi" 
              // icon={<Save className="w-4 h-4 mr-2" />}
              // onClick={form.handleSubmit(onSubmit)}
           />
        </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}