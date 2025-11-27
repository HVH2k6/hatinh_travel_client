'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  LayoutGrid, 
  Package, 
  Image as ImageIcon, 
  FileText, 
  Save 
} from 'lucide-react'; // Import thêm Icon cho đẹp

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { InputForm } from '@/components/input/InputForm';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import RichText from '@/components/editor/RichText';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectedUnit } from '@/components/input/InputSelectedUnit';
import { HandleCreateProduct } from '@/action/HandleProduct';
import { IShop } from '@/interfaces/IShop';

/* ============================ SCHEMA ============================ */
const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên sản phẩm phải từ 5 ký tự trở lên.' }),
  shopId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  image: z.string().url('Ảnh đại diện phải là URL hợp lệ.').optional(),
  price: z.number({ required_error: 'Vui lòng nhập giá.' }).nonnegative({ message: 'Giá không được âm.' }),
  description: z.string().min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
  unitId: z.string().min(1, { message: 'Vui lòng chọn đơn vị tính.' }),
  list_image: z.array(z.string().url()).default([]).optional(),
});

type FormType = z.infer<typeof formSchema>;

type Props = {
  data: IShop;
};

export default function CreateProduct({ data }: Props) {
  const router = useRouter();
  
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shopId: data._id,
      description: '',
      unitId: '',
      image: '',
      price: 0,
      list_image: [],
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      await HandleCreateProduct(values as any);
      toast.success('Tạo sản phẩm thành công');
      form.reset();
      router.push(`/quan-ly-cua-hang/danh-sach-san-pham/${data._id}`);
    } catch (err: any) {
      const msg = err?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-6 mb-20 px-4">
      {/* Header Page */}
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Thêm mới sản phẩm</h1>
           <p className="text-sm text-muted-foreground">Tạo sản phẩm mới cho cửa hàng: <span className="font-semibold text-blue-600">{data.name}</span></p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* === CỘT TRÁI (CHIẾM 2 PHẦN) - THÔNG TIN CHÍNH === */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Block 1: Thông tin chung */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-blue-500" />
                    Thông tin chung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputForm
                    control={form.control}
                    name="name"
                    label="Tên sản phẩm"
                    placeholder="Ví dụ: Khô mực loại 1, Nước mắm nhỉ..."
                  />
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                       <FileText className="w-4 h-4" /> Mô tả chi tiết
                    </Label>
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

              {/* Block 2: Thư viện ảnh */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LayoutGrid className="w-5 h-5 text-purple-500" />
                    Thư viện ảnh
                  </CardTitle>
                  <CardDescription>Tải lên nhiều ảnh để khách hàng có cái nhìn chi tiết hơn.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputUploadMultipleFiles
                    control={form.control}
                    name="list_image"
                  />
                </CardContent>
              </Card>
            </div>

            {/* === CỘT PHẢI (CHIẾM 1 PHẦN) - CÀI ĐẶT & ẢNH ĐẠI DIỆN === */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Block 3: Giá & Đơn vị */}
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
                  
                  <InputSelectedUnit 
                    control={form.control} 
                    name="unitId" 
                    // label="Đơn vị tính" (Giả sử component này có prop label)
                  />
                </CardContent>
              </Card>

              {/* Block 4: Ảnh đại diện (Thumbnail) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-orange-500" />
                    Ảnh đại diện
                  </CardTitle>
                  <CardDescription>Hình ảnh hiển thị đầu tiên trên thẻ sản phẩm.</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputUploadSingleFile 
                    control={form.control} 
                    name="image" 
                  />
                </CardContent>
              </Card>

              {/* Nút Submit Mobile (Hiện khi màn hình nhỏ) */}
              <div className="block md:hidden pt-4">
                 <ButtonSubmit 
                    isLoading={form.formState.isSubmitting} 
                    text="Hoàn tất & Tạo sản phẩm"
                    // className="w-full"
                 />
              </div>
               <div className="hidden md:block">
           {/* Nút submit phụ ở header cho tiện bấm */}
           <ButtonSubmit 
              isLoading={form.formState.isSubmitting} 
              text="Lưu sản phẩm" 
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