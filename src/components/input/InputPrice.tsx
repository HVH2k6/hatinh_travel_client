'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface InputPriceProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function InputPrice<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  disabled,
}: InputPriceProps<T>) {
  const [localValue, setLocalValue] = useState<string>('');

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === 'number' ? field.value : 0;

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder}
                className={className}
                value={localValue || value.toLocaleString('en-US')}
                disabled={disabled}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, '');
                  const number = parseInt(raw || '0');

                  if (!isNaN(number)) {
                    setLocalValue(number.toLocaleString('en-US'));
                    field.onChange(number); // set number into form state
                  } else {
                    setLocalValue('');
                    field.onChange(0);
                  }
                }}
                onBlur={() => {
                  setLocalValue('');
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
