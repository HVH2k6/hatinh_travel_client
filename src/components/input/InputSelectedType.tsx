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
import { IType } from '@/interfaces/IType';

interface InputSelectedTypeProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function InputSelectedType<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Chọn loại hình",
}: InputSelectedTypeProps<T>) {
  const [types, setTypes] = useState<IType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch types`);
        }

        const result = await response.json();

        // ✅ Xử lý nhiều cấu trúc response khác nhau
        let typesData: IType[] = [];
        
        if (Array.isArray(result)) {
          typesData = result;
        } else if (result.data && Array.isArray(result.data)) {
          typesData = result.data;
        } else if (result.types && Array.isArray(result.types)) {
          typesData = result.types;
        } else {
          console.error('Invalid types data structure:', result);
          throw new Error('Invalid data structure from API');
        }

        // ✅ Lọc bỏ các item không hợp lệ
        const validTypes = typesData.filter((type): type is IType => 
          type && 
          typeof type === 'object' &&
          '_id' in type &&
          'name' in type &&
          typeof type._id === 'string' && 
          type._id.trim() !== '' &&
          typeof type.name === 'string' &&
          type.name.trim() !== ''
        );

        if (validTypes.length === 0 && typesData.length > 0) {
          console.warn('All types were filtered out as invalid');
        }

        setTypes(validTypes);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching types:', errorMessage);
        setError(errorMessage);
        setTypes([]);
      } finally {
        setLoading(false);
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
              value={field.value || ''}
              onValueChange={field.onChange}
              disabled={loading || error !== null}
            >
              <SelectTrigger className='w-full'>
                <SelectValue 
                  placeholder={
                    loading 
                      ? "Đang tải..." 
                      : error 
                        ? "Lỗi tải dữ liệu"
                        : placeholder
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    Đang tải...
                  </div>
                ) : error ? (
                  <div className="py-2 px-3 text-sm text-red-500">
                    {error}
                  </div>
                ) : types.length > 0 ? (
                  types.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    Không có dữ liệu
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