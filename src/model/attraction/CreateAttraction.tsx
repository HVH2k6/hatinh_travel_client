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
import { InputSelectDistrict } from '@/components/input/InputSelectDistrict';
import { InputSelectWard } from '@/components/input/InputSelectWard';
import { toast } from 'react-toastify';
import { HandleCreateAttraction } from '@/action/HandleAttraction';
import RichText from '@/components/editor/RichText';

export const formSchema = z.object({
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
  createdBy: z.string().optional(),
});

type FormType = z.infer<typeof formSchema>;
type Labels = { categoryName: string; typeName: string; provinceName: string; districtName: string; wardName: string };

const CreateAttraction = () => {
  // ---------------- state & form ----------------
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
      createdBy: user?._id,
    },
  });

  const districtId = form.watch('address.districtId');

  // ---------------- effects ----------------
  useEffect(() => {
    (async () => {
      const result = await getProvinces();
      setProvinces(result);
      if (result?.length) {
        form.setValue('address.provinceId', result[0]._id);
        setLabels((s) => ({ ...s, provinceName: result[0].name || '' }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listStatus = useMemo(
    () => [
      { value: STATUS.ACTIVE, label: 'Hoạt động' },
      { value: STATUS.PENDING, label: 'Chờ duyệt' },
      { value: STATUS.DELETED, label: 'Đã xóa' },
    ],
    []
  );

  // ---------------- helpers: AI & ẢNH WEB ----------------
  type WebPhoto = { src: string; alt?: string; author?: string; link?: string };

  // Gọi route Pexels đã tạo: /api/media/search-photos
  async function searchPhotos(query: string, perPage = 4) {
    const res = await fetch('/api/media/search-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        perPage,
        orientation: 'landscape',
        locale: 'vi-VN',
      }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.photos as WebPhoto[]) || [];
  }

  // Tạo 1 <figure> đẹp + credit
  function makeFigureHTML(p: WebPhoto) {
    return `
<figure style="margin:12px 0;border-radius:12px;overflow:hidden;">
  <img src="${p.src}" alt="${p.alt || 'Ảnh minh họa'}"
       style="width:100%;height:220px;object-fit:cover;display:block;" />
  <figcaption style="font-size:12px;color:#6b7280;margin-top:6px;">
    ${p.author ? `Photo by ${p.author}` : 'Photo'}${
      p.link ? ` on <a href="${p.link}" target="_blank" rel="nofollow noopener">Pexels</a>` : ''
    }
  </figcaption>
</figure>`;
  }

  /**
   * Chèn ảnh vào content theo các mục:
   * - Sau <h3>Giới thiệu</h3>
   * - Sau <h3>Trải nghiệm</h3> / <h3>Trải nghiệm gợi ý</h3>
   * - Sau <h3>Ẩm thực</h3> hoặc "Ẩm thực & dịch vụ"
   * - Sau <h3>Giá/Phí</h3>
   * Ảnh dư -> thêm cuối bài.
   */
  function injectImagesIntoHtml(html: string, photos: WebPhoto[]) {
    if (!photos?.length || !html) return html;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const slots = [/giới thiệu/i, /trải nghiệm/i, /(ẩm thực|dịch vụ)/i, /(giá\s*\/?\s*phí|giá|phí)/i];

      let used = 0;
      const h3s = Array.from(doc.querySelectorAll('h3'));

      // helper: tìm element sau heading để chèn
      const findAnchorAfter = (h3: Element): Element => {
        let el: Element | null = h3.nextElementSibling;
        while (el) {
          const tag = el.tagName.toLowerCase();
          if (['p', 'ul', 'ol', 'table'].includes(tag)) return el;
          if (['h2', 'h3', 'h4'].includes(tag)) break;
          el = el.nextElementSibling;
        }
        return h3;
      };

      for (const slot of slots) {
        if (used >= photos.length) break;
        const targetH3 = h3s.find((h) => slot.test(h.textContent || ''));
        if (!targetH3) continue;
        const anchor = findAnchorAfter(targetH3);

        const wrapper = doc.createElement('div');
        wrapper.innerHTML = makeFigureHTML(photos[used++]);
        const node = wrapper.firstElementChild!;
        anchor.parentNode?.insertBefore(node, anchor.nextSibling);
      }

      // Ảnh còn dư -> cuối bài
      while (used < photos.length) {
        const wrapper = doc.createElement('div');
        wrapper.innerHTML = makeFigureHTML(photos[used++]);
        const node = wrapper.firstElementChild!;
        doc.body.appendChild(node);
      }

      return doc.body.innerHTML;
    } catch {
      // Fallback regex: chèn ngay sau <h3> khớp tiêu đề
      let out = html;
      const regs = [
        /(<h3[^>]*>[^<]*Giới thiệu[^<]*<\/h3>)/i,
        /(<h3[^>]*>[^<]*Trải nghiệm[^<]*<\/h3>)/i,
        /(<h3[^>]*>[^<]*(Ẩm thực|dịch vụ)[^<]*<\/h3>)/i,
        /(<h3[^>]*>[^<]*(Giá\s*\/?\s*Phí|Giá|Phí)[^<]*<\/h3>)/i,
      ];
      photos.forEach((p, i) => {
        if (!regs[i]) return;
        out = out.replace(regs[i], `$1${makeFigureHTML(p)}`);
      });
      return out;
    }
  }

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

  // ---------------- submit ----------------
  const handleSubmit = async (values: FormType) => {
    values.createdBy = user?._id;
    const response = await HandleCreateAttraction(values);
    if (response) {
      toast.success('Tạo thành công');
      form.reset();
    }
  };
  const handleError = (errors: any) => console.log(errors);

  // ---------------- UI ----------------
  return (
    <Card className="max-w-6xl mx-auto mt-6 px-2 sm:px-6 md:px-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Tạo địa điểm du lịch</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
            {/* ========== Thông tin cơ bản ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">1) Thông tin cơ bản</h3>
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
                  // onLabelChange={(label: string) => setLabels((s) => ({ ...s, categoryName: label }))}
                />
                <InputSelectedType
                  control={form.control}
                  name="typeId"
                  label="Loại hình du lịch"
                  // onLabelChange={(label: string) => setLabels((s) => ({ ...s, typeName: label }))}
                />
              </div>
            </section>

            {/* ========== Hình ảnh (người dùng upload – không dùng cho AI) ========== */}
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
              <h3 className="text-base font-semibold">3) Giá & Trạng thái</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2">Miễn phí</Label>
                    <RadioGroup
                      defaultValue="false"
                      className="flex items-center gap-6"
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
                    onValueChange={(value) => form.setValue('status', value)}
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

            {/* ========== Địa chỉ ========== */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">4) Địa chỉ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="block mb-2">Tỉnh</Label>
                  <Input
                    disabled
                    value={provinces.find((p) => p._id === form.watch('address.provinceId'))?.name || ''}
                  />
                </div>
                <InputSelectDistrict
                  control={form.control}
                  name="address.districtId"
                  label="Huyện"
                  // onLabelChange={(label: string) => setLabels((s) => ({ ...s, districtName: label }))}
                />
                <InputSelectWard
                  control={form.control}
                  name="address.wardId"
                  label="Xã/Phường"
                  districtId={districtId}
                  // onLabelChange={(label: string) => setLabels((s) => ({ ...s, wardName: label }))}
                />
                <InputForm control={form.control} name="address.detail" label="Địa chỉ chi tiết" placeholder="VD: Thôn 3, xã ABC" />
              </div>
            </section>

            {/* ========== Mô tả ========== */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">5) Mô tả chi tiết</h3>
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

                      // (1) Viết mô tả bám form (HTML)
                      const aiHtml = await generateAiDescriptionStrict(v, labels);

                      // (2) Tìm ảnh web theo ngữ cảnh
                      const provinceName =
                        provinces.find((p) => p._id === v.address?.provinceId)?.name ||
                        labels.provinceName ||
                        '';
                      const query = [v.name, labels.typeName, labels.categoryName, provinceName, labels.districtName, labels.wardName]
                        .filter(Boolean)
                        .join(' ');
                      const photos = await searchPhotos(query, 4);

                      // (3) Chèn ảnh vào từng mục trong content
                      const finalHtml = photos.length ? injectImagesIntoHtml(aiHtml, photos) : aiHtml;

                      form.setValue('description', finalHtml, { shouldValidate: true, shouldDirty: true });
                      toast.success('Đã sinh mô tả & chèn ảnh vào từng mục');
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

            {/* ========== Submit ========== */}
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
