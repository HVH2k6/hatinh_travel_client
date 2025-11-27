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
import { IUnit } from '@/interfaces/IUnit';


interface InputSelectedUnitProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function InputSelectedUnit<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Chọn đơn vị tính",
}: InputSelectedUnitProps<T>) {
  const [units, setUnits] = useState<IUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch types`);
        }

        const result = await response.json();

        // ✅ Xử lý nhiều cấu trúc response khác nhau
        let unitsData: IUnit[] = [];
        
        if (Array.isArray(result)) {
          unitsData = result;
        } else if (result.data && Array.isArray(result.data)) {
          unitsData = result.data;
        } else if (result.types && Array.isArray(result.types)) {
          unitsData = result.types;
        } else {
          console.error('Invalid types data structure:', result);
          throw new Error('Invalid data structure from API');
        }

        // ✅ Lọc bỏ các item không hợp lệ
        const validTypes = unitsData.filter((type): type is IUnit => 
          type && 
          typeof type === 'object' &&
          '_id' in type &&
          'name' in type &&
          typeof type._id === 'string' && 
          type._id.trim() !== '' &&
          typeof type.name === 'string' &&
          type.name.trim() !== ''
        );

        if (validTypes.length === 0 && unitsData.length > 0) {
          console.warn('All types were filtered out as invalid');
        }

        setUnits(validTypes);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching types:', errorMessage);
        setError(errorMessage);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
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
                ) : units.length > 0 ? (
                  units.map((data) => (
                    <SelectItem key={data._id} value={data._id}>
                      {data.name} - {data.symbol}
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