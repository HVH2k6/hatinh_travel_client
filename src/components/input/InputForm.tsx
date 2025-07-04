import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Control, FieldValues, Path } from 'react-hook-form'

interface InputFormProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: string
  className?: string
}

const InputForm = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  className
  
}: InputFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} className={className}/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputForm
