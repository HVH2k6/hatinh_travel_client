// components/input/InputForm.tsx
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface InputFormProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  className?: string
  type?: string
  defaultValue?: string
}

export function InputForm<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  type = 'text',
  defaultValue,
}: InputFormProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(type === 'number' ? e.target.value : e.target.value)
              }
              placeholder={placeholder}
              className={className}
              type={type}
              defaultValue={defaultValue}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
