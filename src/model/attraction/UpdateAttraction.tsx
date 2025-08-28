'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InputForm } from '@/components/input/InputForm';
import { STATUS, getProvinces } from '@/util/constant';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { InputSelectedType } from '@/components/input/InputSelectedType';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import { Label } from '@/components/ui/label';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCheckAuth } from '@/components/auth/checkauth';
import { Input } from '@/components/ui/input';
import { InputSelectDistrict } from '@/components/input/InputSelectDistrict';
import { InputSelectWard } from '@/components/input/InputSelectWard';

import { toast } from 'react-toastify';
import { HandleCreateAttraction, HandleUpdateAttraction } from '@/action/HandleAttraction';
import { IAttraction } from '@/interfaces/IAttraction';
import { useRouter } from 'next/navigation';

export const formSchema = z.object({
  name: z.string().min(5, { message: 'Tên địa điểm phải từ 5 ký tự trở lên.' }),
  image: z
    .string()
    .url({ message: 'Vui lòng chọn hình ảnh hợp lệ (dạng URL).' }),
  list_image: z
    .array(z.string().url({ message: 'Mỗi hình ảnh phải là một URL hợp lệ.' }))
    .min(1, { message: 'Cần ít nhất một hình ảnh mô tả.' }),
  description: z
    .string()
    .min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
  typeId: z.string().min(1, { message: 'Vui lòng chọn loại địa điểm.' }),
  address: z.object({
    provinceId: z.string().min(1, { message: 'Chọn tỉnh/thành phố.' }),
    districtId: z.string().min(1, { message: 'Chọn quận/huyện.' }),
    wardId: z.string().min(1, { message: 'Chọn phường/xã.' }),
    detail: z.string().optional(),
  }),
  status: z.enum([STATUS.ACTIVE, STATUS.PENDING, STATUS.DELETED], {
    required_error: 'Vui lòng chọn trạng thái.',
  }),
  isFree: z.boolean(),
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
  createdBy: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;
interface IUpdateAttraction {
  data: IAttraction;
}
const UpdateAttraction = ({ data }: IUpdateAttraction) => {
  const [free, setFree] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const user = useCheckAuth();
  const router = useRouter()

  const defaultValues = useMemo<FormType>(
    () => ({
      name: data?.name ?? '',
      image: data?.image ?? '',
      list_image: data?.list_image ?? [],
      description: data?.description ?? '',
      categoryId: data?.categoryId?._id ?? '',
      typeId: data?.typeId?._id ?? '',
      address: {
        provinceId: data?.address?.provinceId?._id ?? '',
        districtId: data?.address?.districtId?._id ?? '',
        wardId: data?.address?.wardId?._id ?? '',
        detail: data?.address?.detail ?? '',
      },
      status: (data?.status as any) ?? STATUS.ACTIVE,
      isFree: Boolean(data?.isFree),
      minPrice: Number(data?.minPrice ?? 0),
      maxPrice: Number(data?.maxPrice ?? 0),
      createdBy: user?._id,
    }),
    [data, user?._id]
  );
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const districtId = form.watch('address.districtId');

  useEffect(() => {
    async function fetchData() {
      const result = await getProvinces();
      setProvinces(result);
      setLoadingProvinces(false);
      if (result.length > 0) {
        form.setValue('address.provinceId', result[0]._id);
      }
    }
    fetchData();
  }, [form]);

  const listStatus = [
    { value: STATUS.ACTIVE, label: 'Hoạt động' },
    { value: STATUS.PENDING, label: 'Chờ duyệt' },
    { value: STATUS.DELETED, label: 'Đã xóa' },
  ];

  const handleSubmit = async (values: FormType) => {
    // add createdBy
    values.createdBy = user?._id;
    const response = await HandleUpdateAttraction(values,data._id);

    if(response) {
      toast.success('Cập nhật thành công');
      form.reset();
      router.push('/manage/attraction');
    }
  };

  const handleError = (errors: any) => console.log(errors);

  return (
    <Card className='max-w-6xl mx-auto mt-6 px-2 sm:px-6 md:px-10'>
      <CardHeader>
        <CardTitle className='text-2xl text-center'>
          Tạo địa điểm du lịch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleError)}
            className='space-y-6'
          >
            {/* Tên và mô tả */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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

            {/* Danh mục & loại */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <InputSelectCategory
                control={form.control}
                name='categoryId'
                label='Danh mục'
                placeholder='Chọn danh mục'
                allowedSlugs={['dia-diem-tham-quan']}
              />
              <InputSelectedType
                control={form.control}
                name='typeId'
                label='Loại hình du lịch'
              />
            </div>

            {/* Miễn phí & Trạng thái */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label className='block mb-2'>Miễn phí</Label>
                <RadioGroup
                  defaultValue='false'
                  className='flex items-center gap-6'
                  onValueChange={(value) => {
                    const isFreeValue = value === 'true';
                    setFree(isFreeValue);
                    form.setValue('isFree', isFreeValue);
                    if (isFreeValue) {
                      form.setValue('minPrice', 0);
                      form.setValue('maxPrice', 0);
                    }
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem value='false' />
                    <Label>Không</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem value='true' />
                    <Label>Có</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className='block mb-2'>Trạng thái</Label>
                <RadioGroup
                  defaultValue={STATUS.ACTIVE}
                  className='flex items-center gap-6'
                  onValueChange={(value) => form.setValue('status', value)}
                >
                  {listStatus.map((item) => (
                    <div className='flex items-center gap-2' key={item.value}>
                      <RadioGroupItem value={item.value} />
                      <Label>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Giá */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <InputPrice
                control={form.control}
                name='minPrice'
                label='Giá tối thiểu'
                disabled={free}
              />
              <InputPrice
                control={form.control}
                name='maxPrice'
                label='Giá tối đa'
                disabled={free}
              />
            </div>

            {/* Hình ảnh */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label className='block mb-2'>Hình ảnh đại diện</Label>
                <InputUploadSingleFile control={form.control} name='image' />
              </div>
              <div>
                <Label className='block mb-2'>Danh sách ảnh</Label>
                <InputUploadMultipleFiles
                  control={form.control}
                  name='list_image'
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <Label className='block mb-2'>Tỉnh</Label>
                <Input
                  disabled
                  value={
                    provinces.find(
                      (p) => p._id === form.watch('address.provinceId')
                    )?.name || ''
                  }
                />
              </div>
              <InputSelectDistrict
                control={form.control}
                name='address.districtId'
                label='Huyện'
              />
              <InputSelectWard
                control={form.control}
                name='address.wardId'
                label='Xã/Phường'
                districtId={districtId}
              />
              <InputForm
                control={form.control}
                name='address.detail'
                label='Địa chỉ chi tiết'
                placeholder='VD: Thôn 3, xã ABC'
              />
            </div>

            {/* Submit */}
            <div className='text-center'>
              <ButtonSubmit
                isLoading={form.formState.isSubmitting}
                text='Tạo địa điểm'
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateAttraction;
