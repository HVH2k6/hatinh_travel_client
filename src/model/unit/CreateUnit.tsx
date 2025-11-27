'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Import UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputForm } from '@/components/input/InputForm';

// Import Server Action
import { HandleCreateUnit } from '@/action/HandleUnit';
// Đảm bảo import InputPrice đúng đường dẫn
import { InputPrice } from '@/components/input/InputPrice';

const schema = z.object({
  name: z.string({ required_error: "Vui lòng nhập tên đơn vị" })
    .min(2, 'Tên quá ngắn, tối thiểu 2 ký tự')
    .trim(),
  symbol: z.string({ required_error: "Vui lòng nhập ký hiệu" })
    .min(1, 'Ký hiệu không được để trống')
    .trim(),
  type: z.enum(['weight', 'volume', 'count', 'length', 'area', 'other'], {
    required_error: 'Vui lòng chọn nhóm phân loại',
  }),
  // 👇 ĐÃ SỬA: Xóa .default(0). 
  // InputPrice luôn trả về số (0 hoặc giá trị nhập), và useForm đã init bằng 0
  // nên chỉ cần validate là number là đủ.
  order: z.coerce.number(), 
});

type FormType = z.infer<typeof schema>;

// Danh sách các loại nhóm để hiển thị trong Select
const unitTypes = [
  { value: 'weight', label: 'Trọng lượng (kg, g, tấn...)' },
  { value: 'volume', label: 'Thể tích (lít, ml...)' },
  { value: 'count', label: 'Số lượng (cái, hộp, thùng...)' },
  { value: 'length', label: 'Chiều dài (m, cm...)' },
  { value: 'area', label: 'Diện tích (m2...)' },
  { value: 'other', label: 'Khác' },
];

export default function CreateUnit() {
  const router = useRouter();

  // 2. Khởi tạo Form
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      symbol: '',
      type: undefined,
      order: 0, // Giá trị mặc định ở đây sẽ đảm nhận vai trò khởi tạo
    },
  });

  // 3. Xử lý Submit
  const onSubmit = async (values: FormType) => {
    console.log("🚀 ~ onSubmit Creating Unit ~ values:", values);
    try {
      await HandleCreateUnit(values);
      
      toast.success('Tạo đơn vị tính thành công!');
      router.push('/quan-ly/don-vi-tinh');
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Tạo thất bại, vui lòng thử lại sau.');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-lg border-t-4 border-t-blue-600">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Thêm mới Đơn vị tính
        </CardTitle>
        <p className="text-center text-sm text-gray-500">
          Tạo các đơn vị đo lường cho sản phẩm (Ví dụ: kg, hộp, cái...)
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Nhóm 2 cột cho Tên và Ký hiệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputForm
                control={form.control}
                name="name"
                label="Tên đầy đủ"
                placeholder="VD: Kilogam, Hộp, Chiếc"
              />

              <InputForm
                control={form.control}
                name="symbol"
                label="Ký hiệu hiển thị"
                placeholder="VD: kg, hộp, cái"
                // Lưu ý: InputForm của bạn có prop description không?
                // Nếu không có trong definition của InputForm thì xóa dòng dưới đi
                // description="Ký hiệu ngắn gọn hiển thị cạnh giá tiền."
              />
            </div>

            {/* Select Component cho Loại phân nhóm */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhóm phân loại <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="-- Chọn nhóm đơn vị --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Input số cho Thứ tự (Tùy chọn) */}
            <InputPrice
              control={form.control}
              name="order"
              label="Thứ tự ưu tiên (Tùy chọn)"
              placeholder="Nhập số thứ tự (mặc định 0)"
              // 👇 ĐÃ SỬA: Xóa prop 'description' vì Component InputPrice không nhận prop này
            />
            
            {/* Nút Submit */}
            <div className="pt-4 text-center">
              <ButtonSubmit 
                isLoading={form.formState.isSubmitting} 
                text="Hoàn tất & Thêm mới"
                // className="w-full md:w-auto px-8"
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}