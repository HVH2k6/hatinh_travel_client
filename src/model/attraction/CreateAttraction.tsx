'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { InputForm } from '@/components/input/InputForm';
import { InputPrice } from '@/components/input/InputPrice';
import { InputSelectCategory } from '@/components/input/InputSelectCategory';
import { InputSelectedType } from '@/components/input/InputSelectedType';
import InputUploadSingleFile from '@/components/input/InputUploadSingleFile';
import InputUploadMultipleFiles from '@/components/input/InputUploadMultipleFiles';
import { InputSelectDistrict } from '@/components/input/InputSelectDistrict';
import { InputSelectWard } from '@/components/input/InputSelectWard';
import ButtonSubmit from '@/components/button/ButtonSubmit';
import RichText from '@/components/editor/RichText';

import { STATUS, getProvinces } from '@/util/constant';
import { useCheckAuth } from '@/components/auth/checkauth';
import { toast } from 'react-toastify';

/* ============================ TIME SELECT ============================ */

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

function TimeSelect({
  value,
  onChange,
  placeholder = '--',
  hourLabel = 'Giờ',
  minuteLabel = 'Phút',
  className = '',
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hourLabel?: string;
  minuteLabel?: string;
  className?: string;
}) {
  const [h, m] = (value || '').split(':');
  const hour = HOURS.includes(h) ? h : '';
  const minute = MINUTES.includes(m) ? m : '';

  const update = (hh: string, mm: string) => {
    if (hh && mm) onChange(`${hh}:${mm}`);
    else onChange('');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="sr-only">{hourLabel}</label>
        <select
          className="h-10 rounded-md border bg-background px-2"
          value={hour}
          onChange={(e) => update(e.target.value, minute)}
          aria-label={hourLabel}
        >
          <option value="">{placeholder}</option>
          {HOURS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground">:</span>

        <label className="sr-only">{minuteLabel}</label>
        <select
          className="h-10 rounded-md border bg-background px-2"
          value={minute}
          onChange={(e) => update(hour, e.target.value)}
          aria-label={minuteLabel}
        >
          <option value="">{placeholder}</option>
          {MINUTES.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-xs text-muted-foreground hover:underline"
          aria-label="Xoá giờ đã chọn"
        >
          Xoá
        </button>
      ) : null}
    </div>
  );
}

/* ============================ SCHEMA ============================ */

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
      .number({ required_error: 'Vui lòng nhập giá tối thiểu.', invalid_type_error: 'Giá tối thiểu phải là số.' })
      .nonnegative({ message: 'Giá tối thiểu không được âm.' }),
    maxPrice: z
      .number({ required_error: 'Vui lòng nhập giá tối đa.', invalid_type_error: 'Giá tối đa phải là số.' })
      .nonnegative({ message: 'Giá tối đa không được âm.' }),

    // Time HH:mm (optional)
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
type Labels = { categoryName: string; typeName: string; provinceName: string; districtName: string; wardName: string };

/* ============================ COMPONENT ============================ */

import { HandleCreateAttraction } from '@/action/HandleAttraction';

const CreateAttraction = () => {
  const [free, setFree] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const user = useCheckAuth();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [labels, setLabels] = useState<Labels>({
    categoryName: '',
    typeName: '',
    provinceName: '',
    districtName: '',
    wardName: '',
  });

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: '',
      list_image: [],
      description: '',
      categoryId: '',
      typeId: '',
      address: { provinceId: '', districtId: '', wardId: '', detail: '' },
      status: STATUS.ACTIVE,
      isFree: false,
      minPrice: 0,
      maxPrice: 0,
      openTime: '', // để trống -> backend tự default nếu muốn
      closeTime: '',
      createdBy: user?._id,
    },
  });

  const districtId = form.watch('address.districtId');

  /* ---------- Effects ---------- */
  useEffect(() => {
    (async () => {
      const result = await getProvinces();
      setProvinces(result || []);
      if (result?.length) {
        form.setValue('address.provinceId', result[0]._id);
        setLabels((s) => ({ ...s, provinceName: result[0].name || '' }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listStatus = useMemo(
    () => [
      { value: STATUS.ACTIVE, label: 'Hoạt động' },
      { value: STATUS.PENDING, label: 'Chờ duyệt' },
      { value: STATUS.DELETED, label: 'Đã xoá' },
    ],
    []
  );

  /* ---------- AI helper ---------- */
  async function generateAiDescriptionStrict(v: FormType, lbls: Labels) {
    const provinceName = provinces.find((p) => p._id === v.address?.provinceId)?.name || lbls.provinceName || '';
    const payload = {
      name: v.name,
      categoryName: lbls.categoryName,
      typeName: lbls.typeName,
      provinceName,
      districtName: lbls.districtName,
      wardName: lbls.wardName,
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

  /* ---------- Submit ---------- */
  const handleSubmit = async (values: FormType) => {
    if (values.isFree) {
      values.minPrice = 0;
      values.maxPrice = 0;
    }
    values.createdBy = user?._id;

    const payload = {
      ...values,
      openTime: values.openTime?.trim() ? values.openTime : undefined,
      closeTime: values.closeTime?.trim() ? values.closeTime : undefined,
    };

    const ok = await HandleCreateAttraction(payload as any);
    if (ok) {
      toast.success('Tạo thành công');
      form.reset({
        name: '',
        image: '',
        list_image: [],
        description: '',
        categoryId: '',
        typeId: '',
        address: { provinceId: form.getValues('address.provinceId') || '', districtId: '', wardId: '', detail: '' },
        status: STATUS.ACTIVE,
        isFree: false,
        minPrice: 0,
        maxPrice: 0,
        openTime: '',
        closeTime: '',
        createdBy: user?._id,
      });
      setFree(false);
    }
  };
  const handleError = (e: any) => console.log(e);

  /* ---------- UI ---------- */
  return (
    <Card className="max-w-6xl mx-auto mt-6 px-2 sm:px-6 md:px-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Tạo địa điểm du lịch</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
            {/* 1) Thông tin cơ bản */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                <h3 className="text-base font-semibold">Thông tin cơ bản</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputForm control={form.control} name="name" label="Tên địa điểm" placeholder="Ví dụ: Chùa Hương Tích" />
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

            {/* 2) Hình ảnh */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                <h3 className="text-base font-semibold">Hình ảnh</h3>
              </div>
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

            {/* 3) Giá & Trạng thái */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
                <h3 className="text-base font-semibold">Giá & Trạng thái</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="block mb-2">Miễn phí</Label>
                    <RadioGroup
                      defaultValue="false"
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
                    defaultValue={STATUS.ACTIVE}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    onValueChange={(value) =>
                      form.setValue('status', value as any, { shouldDirty: true, shouldValidate: true })
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

            {/* 4) Giờ hoạt động */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
                <h3 className="text-base font-semibold">Giờ hoạt động</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="openTime"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label className="block mb-2">Giờ mở cửa (00:00–23:59)</Label>
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

            {/* 5) Địa chỉ */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">5</span>
                <h3 className="text-base font-semibold">Địa chỉ</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="block mb-2">Tỉnh</Label>
                  <Input
                    disabled
                    value={provinces.find((p) => p._id === form.watch('address.provinceId'))?.name || ''}
                  />
                </div>
                <InputSelectDistrict control={form.control} name="address.districtId" label="Huyện" />
                <InputSelectWard control={form.control} name="address.wardId" label="Xã/Phường" districtId={districtId} />
                <InputForm control={form.control} name="address.detail" label="Địa chỉ chi tiết" placeholder="VD: Thôn 3, xã ABC" />
              </div>
            </section>

            {/* 6) Mô tả */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">6</span>
                  <h3 className="text-base font-semibold">Mô tả chi tiết</h3>
                </div>
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
            <div className="pt-2 border-t">
              <div className="text-center">
                <ButtonSubmit isLoading={form.formState.isSubmitting} text="Tạo địa điểm" />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAttraction;
