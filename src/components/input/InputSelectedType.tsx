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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { IType } from '@/interfaces/IType'; // Cập nhật đúng path import

interface InputSelectedTypeProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export function InputSelectedType<T extends FieldValues>({
  control,
  name,
  label,
}: InputSelectedTypeProps<T>) {
  const [types, setTypes] = useState<IType[]>([]);

  useEffect(() => {
   const fetchTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type`,{
        cache: 'no-store',
      });
      const data = await response.json();
      setTypes(data.types);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
   };

   fetchTypes();
   
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
              onValueChange={field.onChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Chọn loại hình" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type._id} value={type._id} 
                  >
                    {type.name}
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
