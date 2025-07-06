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

interface District {
  _id: string;
  name: string;
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onChange?: (districtId: string) => void;
  label?: string;
  className?: string;
}

export function InputSelectDistrict<T extends FieldValues>({
  control,
  name,
  label,
  onChange,
}: Props<T>) {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/districts?province_code=42`)
      .then(res => res.json())
      .then(setDistricts)
      .catch(console.error);
  }, []);

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
              onValueChange={(val) => {
                field.onChange(val);
                onChange?.(val); // Gọi callback load xã
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Chọn huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
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
