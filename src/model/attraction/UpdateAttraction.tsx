'use client';

import { useForm, Controller } from 'react-hook-form';
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
import { InputSelectWard } from '@/components/input/InputSelectWard';
import { toast } from 'react-toastify';
import { HandleUpdateAttraction } from '@/action/HandleAttraction';
import { IAttraction } from '@/interfaces/IAttraction';
import { useRouter } from 'next/navigation';
import RichText from '@/components/editor/RichText';
import { Skeleton } from '@/components/ui/skeleton';

/* ====================== Loading Skeleton ====================== */
const LoadingSkeleton = () => (
  <Card className="max-w-6xl mx-auto mt-6 px-2 sm:px-6 md:px-10">
    <CardHeader>
      <CardTitle className="text-2xl text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </CardContent>
  </Card>
);

/* ====================== Time Helpers ====================== */
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function toHHmmFromAny(v: any): string {
  if (v == null || v === '') return '';
  if (typeof v === 'string') {
    // Nếu là chuỗi HH:mm hợp lệ
    if (timeRegex.test(v)) return v;
    // Thử chuyển đổi chuỗi ngày/tháng/năm kèm giờ (ISO date string)
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      // Sử dụng toLocaleTimeString để đảm bảo định dạng HH:mm
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return '';
  }
  // Nếu là đối tượng Date hoặc timestamp
  if ((v instanceof Date && !isNaN(v.getTime())) || typeof v === 'number') {
    const d = new Date(v);
    if (!isNaN(d.getTime()))
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return '';
}

/**
 * Component Select Giờ/Phút tách rời, trả về giá trị chuỗi "HH:mm"
 */
function TimeSelect({
  value,
  onChange,
  placeholder = '--',
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  // Tách giá trị hiện tại ra giờ và phút. Nếu value rỗng, h và m sẽ là ''
  const [h, m] = (value || '').split(':');

  // Đảm bảo giá trị hiển thị trên select khớp với list option
  const currentHour = HOURS.includes(h) ? h : '';
  const currentMinute = MINUTES.includes(m) ? m : '';

  const update = (newHour: string, newMinute: string) => {
    // Nếu 1 trong 2 select đang là placeholder -> coi như xoá giá trị
    if (!newHour || !newMinute) {
      onChange('');
      return;
    }

    // Chỉ khi cả giờ và phút đều được chọn thì mới set vào form
    onChange(`${newHour}:${newMinute}`);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-10 rounded-md border bg-background px-2"
        value={currentHour}
        onChange={(e) => update(e.target.value, currentMinute)}
        aria-label="Giờ"
      >
        <option value="">{placeholder}</option>
        {HOURS.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <span className="text-muted-foreground">:</span>
      <select
        className="h-10 rounded-md border bg-background px-2"
        value={currentMinute}
        onChange={(e) => update(currentHour, e.target.value)}
        aria-label="Phút"
      >
        <option value="">{placeholder}</option>
        {MINUTES.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      {value ? (
        <button
          type="button"
          className="text-xs text-muted-foreground hover:underline"
          onClick={() => onChange('')}
        >
          Xoá
        </button>
      ) : null}
    </div>
  );
}

/* ====================== Schema (ĐÃ BỎ DISTRICT) ====================== */
export const formSchema = z
  .object({
    name: z.string().min(5, { message: 'Tên địa điểm phải từ 5 ký tự trở lên.' }),
    image: z.string().url({ message: 'Vui lòng chọn hình ảnh hợp lệ (dạng URL).' }),
    list_image: z
      .array(z.string().url({ message: 'Mỗi hình ảnh phải là một URL hợp lệ.' }))
      .min(1, { message: 'Cần ít nhất một hình ảnh mô tả.' }),
    description: z.string().min(10, { message: 'Vui lòng nhập mô tả chi tiết hơn.' }),
    categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục.' }),
    typeId: z.string().min(1, { message: 'Vui lòng chọn loại địa điểm.' }),

    // Schema Address mới
    address: z.object({
      provinceId: z.string().min(1, { message: 'Chọn tỉnh/thành phố.' }),
      wardId: z.string().min(1, { message: 'Chọn phường/xã.' }),
      detail: z.string().optional(),
    }),

    status: z.enum([STATUS.ACTIVE, STATUS.PENDING, STATUS.DELETED], {
      required_error: 'Vui lòng chọn trạng thái.',
    }),
    isFree: z.boolean(),
    minPrice: z
      .number({ required_error: 'Vui lòng nhập giá tối thiểu.', invalid_type_error: 'Giá tối thiểu phải là số.' })
      .nonnegative({ message: 'Giá tối thiểu không được âm.' }),
    maxPrice: z
      .number({ required_error: 'Vui lòng nhập giá tối đa.', invalid_type_error: 'Giá tối đa phải là số.' })
      .nonnegative({ message: 'Giá tối đa không được âm.' }),

    // ⏰ open/close time (optional, HH:mm)
    openTime: z
      .string()
      .optional()
      .refine((v) => !v || timeRegex.test(v), { message: 'Định dạng giờ phải là HH:mm (vd: 08:30).' }),
    closeTime: z
      .string()
      .optional()
      .refine((v) => !v || timeRegex.test(v), { message: 'Định dạng giờ phải là HH:mm (vd: 17:30).' }),

    createdBy: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // Chỉ kiểm tra khi cả hai trường đều có giá trị hợp lệ
    if (val.openTime && val.closeTime && timeRegex.test(val.openTime) && timeRegex.test(val.closeTime)) {
      const toMin = (s: string) => {
        const [h, m] = s.split(':').map(Number);
        return h * 60 + m;
      };
      if (toMin(val.closeTime) < toMin(val.openTime)) {
        ctx.addIssue({
          path: ['closeTime'],
          code: z.ZodIssueCode.custom,
          message: 'Giờ đóng cửa phải sau giờ mở cửa (nếu qua đêm, để trống để bỏ kiểm tra).',
        });
      }
    }
  });

type FormType = z.infer<typeof formSchema>;
// Bỏ districtName
type Labels = { categoryName: string; typeName: string; provinceName: string; wardName: string };

interface IUpdateAttraction {
  data: IAttraction;
  isLoading?: boolean;
}

/* ====================== Component ====================== */
const UpdateAttraction = ({ data, isLoading = false }: IUpdateAttraction) => {
  const user = useCheckAuth();
  const router = useRouter();
  const [aiLoading, setAiLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Labels ban đầu (được dùng cho AI generate, dựa trên data cũ)
  const [labels] = useState<Labels>({
    categoryName: (data as any)?.categoryId?.name ?? '',
    typeName: (data as any)?.typeId?.name ?? '',
    provinceName: (data as any)?.address?.provinceId?.name ?? '',
    wardName: (data as any)?.address?.wardId?.name ?? '',
  });

  const defaultValues = useMemo<FormType>(
    () => ({
      name: data?.name ?? '',
      image: data?.image ?? '',
      list_image: Array.isArray(data?.list_image) ? data.list_image : [],
      description: data?.description ?? '',
      categoryId: (data as any)?.categoryId?._id ?? '',
      typeId: (data as any)?.typeId?._id ?? '',
      // Address Default Values (Bỏ District)
      address: {
        provinceId: (data as any)?.address?.provinceId?._id ?? '',
        wardId: (data as any)?.address?.wardId?._id ?? '',
        detail: (data as any)?.address?.detail ?? '',
      },
      status:
        data?.status && [STATUS.ACTIVE, STATUS.PENDING, STATUS.DELETED].includes(data.status as any)
          ? (data.status as any)
          : STATUS.ACTIVE,
      isFree: Boolean(data?.isFree),
      minPrice: Number(data?.minPrice ?? 0),
      maxPrice: Number(data?.maxPrice ?? 0),
      // Sử dụng hàm toHHmmFromAny để chuẩn hóa định dạng thời gian
      openTime: toHHmmFromAny((data as any)?.openTime),
      closeTime: toHHmmFromAny((data as any)?.closeTime),

      createdBy: (user as any)?._id,
    }),
    [data, user?._id]
  );

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [free, setFree] = useState<boolean>(defaultValues.isFree);

  // Watch Province để lấy Code
  const selectedProvinceId = form.watch('address.provinceId');

  // Tính toán Province Code
  const selectedProvinceCode = useMemo(() => {
    if (!selectedProvinceId || provinces.length === 0) return null;
    const p = provinces.find((item) => item._id === selectedProvinceId);
    return p ? p.code : null;
  }, [selectedProvinceId, provinces]);

  // Load provinces data
  useEffect(() => {
    (async () => {
      try {
        const result = await getProvinces();
        setProvinces(result || []);
        // Nếu data chưa có province, set mặc định cái đầu (Chỉ chạy lần đầu)
        const current = form.getValues('address.provinceId');
        if (!current && result?.length) {
          form.setValue('address.provinceId', result[0]._id, { shouldValidate: true });
        }
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading provinces:', error);
        setDataLoaded(true);
      }
    })();
  }, [form]);

  const listStatus = useMemo(
    () => [
      { value: STATUS.ACTIVE, label: 'Hoạt động' },
      { value: STATUS.PENDING, label: 'Chờ duyệt' },
      { value: STATUS.DELETED, label: 'Đã xóa' },
    ],
    []
  );

  // AI Generate (Bỏ districtName)
  async function generateAiDescriptionStrict(v: FormType, lbls: Labels) {
    // Lấy tên tỉnh hiện tại từ provinces state, hoặc fallback về label ban đầu
    const provinceName = provinces.find((p) => p._id === v.address?.provinceId)?.name || lbls.provinceName || '';
    const payload = {
      name: v.name,
      categoryName: lbls.categoryName, // Lưu ý: lbls.categoryName là tên category cũ
      typeName: lbls.typeName, // Tên type cũ
      provinceName,
      wardName: lbls.wardName, // Tên ward cũ
      addressDetail: v.address?.detail || '',
      isFree: v.isFree,
      minPrice: v.minPrice,
      maxPrice: v.maxPrice,
      detailLevel: 'high',
    };

    const res = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'AI generate failed');
    }
    const json = await res.json();
    return (json.text as string) || '';
  }

  const handleSubmit = async (values: FormType) => {
    values.createdBy = (user as any)?._id;

    if (values.isFree) {
      values.minPrice = 0;
      values.maxPrice = 0;
    }

    const payload: any = {
      ...values,
      // Đảm bảo gửi chuỗi rỗng nếu không chọn, hoặc chuỗi HH:mm hợp lệ
      openTime: values.openTime?.trim() ? values.openTime : undefined,
      closeTime: values.closeTime?.trim() ? values.closeTime : undefined,
    };

    const ok = await HandleUpdateAttraction(payload, (data as any)._id || '');
    if (ok) {
      toast.success('Cập nhật thành công');
      router.push('/quan-ly/dia-diem-du-lich');
    }
  };

  const handleError = (errors: any) => console.log(errors);

  if (isLoading || !data || !dataLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="max-w-6xl mx-auto mt-6 px-2 sm:px-6 md:px-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cập nhật địa điểm du lịch</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
            {/* ========== Thông tin cơ bản ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputForm control={form.control} name="name" label="Tên địa điểm" />
                </div>
                <InputSelectCategory
                  control={form.control}
                  name="categoryId"
                  label="Danh mục"
                  placeholder="Chọn danh mục"
                  allowedSlugs={['dia-diem-tham-quan']}
                />
                <InputSelectedType control={form.control} name="typeId" label="Loại hình du lịch" />
              </div>
            </section>

            {/* ========== Hình ảnh ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">2) Hình ảnh</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-2">Hình ảnh đại diện</Label>
                  <InputUploadSingleFile control={form.control} name="image" />
                </div>
                <div>
                  <Label className="block mb-2">Danh sách ảnh</Label>
                  <InputUploadMultipleFiles control={form.control} name="list_image" />
                </div>
              </div>
            </section>

            {/* ========== Giá & Trạng thái ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Giá & Trạng thái</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2">Miễn phí</Label>
                    <RadioGroup
                      defaultValue={defaultValues.isFree ? 'true' : 'false'}
                      className="flex items-center gap-6"
                      onValueChange={(value) => {
                        const isFreeValue = value === 'true';
                        setFree(isFreeValue);
                        form.setValue('isFree', isFreeValue, { shouldDirty: true, shouldValidate: true });
                        if (isFreeValue) {
                          form.setValue('minPrice', 0, { shouldDirty: true, shouldValidate: true });
                          form.setValue('maxPrice', 0, { shouldDirty: true, shouldValidate: true });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="false" />
                        <Label>Không</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="true" />
                        <Label>Có</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <InputPrice control={form.control} name="minPrice" label="Giá tối thiểu" disabled={free} />
                  <InputPrice control={form.control} name="maxPrice" label="Giá tối đa" disabled={free} />
                </div>

                <div>
                  <Label className="block mb-2">Trạng thái</Label>
                  <RadioGroup
                    value={form.watch('status')}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    onValueChange={(value) =>
                      form.setValue('status', value as any, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    {listStatus.map((item) => (
                      <label className="inline-flex items-center gap-2" key={item.value}>
                        <RadioGroupItem value={item.value} />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </section>

            {/* ========== Giờ hoạt động (SỬA LẠI ĐỂ SỬ DỤNG TIMESELECT ĐÚNG CÁCH) ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Giờ hoạt động</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="openTime"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label className="block mb-2">Giờ mở cửa (00:00–23:59)</Label>
                      {/* Truyền field.value và field.onChange trực tiếp */}
                      <TimeSelect value={field.value || ''} onChange={field.onChange} />
                      <p className="text-xs text-muted-foreground mt-1">Để trống nếu không rõ.</p>
                      {fieldState.error?.message ? (
                        <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="closeTime"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label className="block mb-2">Giờ đóng cửa (00:00–23:59)</Label>
                      {/* Truyền field.value và field.onChange trực tiếp */}
                      <TimeSelect value={field.value || ''} onChange={field.onChange} />
                      <p className="text-xs text-muted-foreground mt-1">
                        Nếu hoạt động qua đêm, để trống để bỏ kiểm tra.
                      </p>
                      {fieldState.error?.message ? (
                        <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                      ) : null}
                    </div>
                  )}
                />
              </div>
            </section>

            {/* ========== Địa chỉ (CẬP NHẬT) ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Địa chỉ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="block mb-2">Tỉnh</Label>
                  <Input
                    disabled
                    value={
                      provinces.find((p) => p._id === form.watch('address.provinceId'))?.name ||
                      labels.provinceName ||
                      ''
                    }
                  />
                  {/* Nếu muốn input cho phép chọn tỉnh, dùng Select Component */}
                </div>

                {/* InputSelectWard nhận provinceCode */}
                <InputSelectWard
                  control={form.control}
                  name="address.wardId"
                  label="Xã/Phường"
                  provinceCode={selectedProvinceCode}
                />

                <InputForm control={form.control} name="address.detail" label="Địa chỉ chi tiết" placeholder="VD: Thôn 3, xã ABC" />
              </div>
            </section>

            {/* ========== Mô tả ========== */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Mô tả chi tiết</h3>
                <button
                  type="button"
                  disabled={aiLoading}
                  className="inline-flex items-center rounded-md px-3 py-1.5 text-sm border shadow-sm hover:bg-accent disabled:opacity-60"
                  onClick={async () => {
                    try {
                      setAiLoading(true);
                      const v = form.getValues();
                      if (!v.name?.trim()) {
                        toast.error('Vui lòng nhập Tên địa điểm trước khi dùng AI');
                        return;
                      }
                      const aiHtml = await generateAiDescriptionStrict(v, labels);
                      form.setValue('description', aiHtml, { shouldValidate: true, shouldDirty: true });
                      toast.success('Đã sinh mô tả chi tiết');
                    } catch (err: any) {
                      toast.error(err?.message || 'Tạo nội dung AI thất bại');
                    } finally {
                      setAiLoading(false);
                    }
                  }}
                >
                  {aiLoading ? 'Đang tạo…' : 'Use AI'}
                </button>
              </div>

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <div>
                    <RichText
                      value={field.value}
                      onChange={(html) => field.onChange(html)}
                      placeholder="Mô tả nổi bật, trải nghiệm, thời điểm lý tưởng, lưu ý…"
                    />
                    {fieldState.error?.message ? (
                      <p className="text-sm text-red-500 mt-2">{fieldState.error.message}</p>
                    ) : null}
                  </div>
                )}
              />
            </section>

            {/* Submit */}
            <div className="text-center">
              <ButtonSubmit isLoading={form.formState.isSubmitting} text="Cập nhật địa điểm" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateAttraction;