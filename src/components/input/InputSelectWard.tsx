'use client';

import { useEffect, useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface Ward {
  _id: string;
  name: string;
  code: number; // Thêm code nếu cần dùng sau này
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  provinceCode: number | undefined | null; // Sửa từ districtId -> provinceCode
  label?: string;
  disabled?: boolean;
}

export function InputSelectWard<T extends FieldValues>({
  control,
  name,
  label,
  provinceCode,
  disabled
}: Props<T>) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nếu không có provinceCode (ví dụ chưa chọn tỉnh), clear danh sách xã
    if (!provinceCode) {
      setWards([]);
      return;
    }

    setLoading(true);
    // Gọi API theo province_code (khớp với Controller getWards bạn đã sửa)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/wards?province_code=${provinceCode}`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data);
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách xã:', err);
        setWards([]);
      })
      .finally(() => setLoading(false));
  }, [provinceCode]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value?.toString()} // Đảm bảo value là string để Select nhận diện
              onValueChange={field.onChange}
              disabled={disabled || !provinceCode || loading} // Disable khi chưa chọn tỉnh
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Đang tải..." : "Chọn xã/phường"} />
              </SelectTrigger>
              <SelectContent>
                {wards.length > 0 ? (
                  wards.map((w) => (
                    <SelectItem key={w._id} value={w._id}>
                      {w.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    {provinceCode ? "Không có dữ liệu" : "Vui lòng chọn Tỉnh trước"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}