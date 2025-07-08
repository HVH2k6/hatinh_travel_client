'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { InputForm } from '@/components/input/InputForm';
import { STATUS } from '@/util/constant';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { InputSelectedType } from '@/components/input/InputSelectedType';
import { Button } from '@/components/ui/button';

export const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên địa điểm phải từ 5 ký tự trở lên.' }),

  // image: z
  //   .string()
  //   .url({ message: 'Vui lòng chọn hình ảnh hợp lệ (dạng URL).' }),

  // list_image: z
  //   .array(z.string().url({ message: 'Mỗi hình ảnh phải là một URL hợp lệ.' }))
  //   .min(1, { message: 'Cần ít nhất một hình ảnh mô tả.' }),

  description: z
    .string()
    .min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),

  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  typeId: z.string().min(1, { message: 'Vui lòng chọn loại địa điểm.' }),

  // address: z.object({
  //   provinceId: z.string().min(1, { message: 'Chọn tỉnh/thành phố.' }),
  //   districtId: z.string().min(1, { message: 'Chọn quận/huyện.' }),
  //   wardId: z.string().min(1, { message: 'Chọn phường/xã.' }),
  //   detail: z.string().optional(),
  // }),

  // status: z.enum([STATUS.ACTIVE, STATUS.PENDING, STATUS.DELETED], {
  //   required_error: 'Vui lòng chọn trạng thái.',
  // }),

  // isFree: z.boolean(),

  minPrice: z
    .number({
      required_error: 'Vui lòng nhập giá tối thiểu.',
      invalid_type_error: 'Giá tối thiểu phải là số.',
    })
    .nonnegative({ message: 'Giá tối thiểu không được âm.' }),

  maxPrice: z
    .number({
      required_error: 'Vui lòng nhập giá tối đa.',
      invalid_type_error: 'Giá tối đa phải là số.',
    })
    .nonnegative({ message: 'Giá tối đa không được âm.' }),

  // createdBy: z.string().optional(),

  // mapUrl: z.string().url({ message: 'Link bản đồ phải hợp lệ.' }).optional(),
});

type FormType = z.infer<typeof formSchema>;

const CreateDestination = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // image: '',
      // list_image: [],
      description: '',
      categoryId: '',
      typeId: '',
      // address: {
      //   provinceId: '',
      //   districtId: '',
      //   wardId: '',
      //   detail: '',
      // },
      // status: STATUS.ACTIVE,
      // isFree: false,
      minPrice: 0,
      maxPrice: 0,
      // createdBy: '',
      // mapUrl: '',
    },
  });
  const handleSubmit = async (values: FormType) => {
    console.log(values);
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
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-3'
          >
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <InputForm
                control={form.control}
                name='name'
                label='Tên địa điểm'
              />
              <InputForm
                control={form.control}
                name='description'
                label='Mô tả'
              />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <InputSelectCategory
                control={form.control}
                name='categoryId'
                label='Danh mục'
                placeholder='Chọn danh mục'
                allowedSlugs={["dia-diem-tham-quan"]}
              />
               <InputSelectedType
                control={form.control}
                name='typeId'
                label='Chọn loại hình du lịch'
              />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <InputPrice
                control={form.control}
                name='minPrice'
                label='Giá tối thiểu'
              />
              <InputPrice
                control={form.control}
                name='maxPrice'
                label='Giá tối thiểu'
              />
            </div>

            {/* <ButtonSubmit text='Tạo' isLoading={form.formState.isSubmitting} /> */}
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateDestination;
