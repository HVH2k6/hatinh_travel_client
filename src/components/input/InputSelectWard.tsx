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
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  districtId: string | null;
  label?: string;
}

export function InputSelectWard<T extends FieldValues>({
  control,
  name,
  label,
  districtId,
}: Props<T>) {
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    if (!districtId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/wards?district_id=${districtId}`)
      .then(res => res.json())
      .then(setWards)
      .catch(console.error);
  }, [districtId]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!districtId}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Chọn xã" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((w) => (
                  <SelectItem key={w._id} value={w._id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
