'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { ICategory } from '@/interfaces/ICategory'

type ICategoryWithChildren = ICategory & {
  children?: ICategoryWithChildren[]
}

interface InputSelectCategoryProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
}

export function InputSelectCategory<T extends FieldValues>({
  control,
  name,
  label = 'Danh mục',
  placeholder = 'Chọn danh mục',
}: InputSelectCategoryProps<T>) {
  const [categories, setCategories] = React.useState<ICategory[]>([])
  const [tree, setTree] = React.useState<ICategoryWithChildren[]>([])

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          cache: 'no-store', // đảm bảo luôn fetch mới
        })
        const data = await res.json()
        if (data?.categories) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error('Lỗi khi fetch categories:', err)
      }
    }

    fetchCategories()
  }, [])

  React.useEffect(() => {
    setTree(buildCategoryTree(categories))
  }, [categories])

  // Xây cây từ danh sách phẳng
  const buildCategoryTree = (
    items: ICategory[],
    parentId: string | null = null
  ): ICategoryWithChildren[] => {
    return items
      .filter((cat) => (cat.parentId ?? null) === parentId)
      .map((cat) => ({
        ...cat,
        children: buildCategoryTree(items, cat._id),
      }))
  }

  // Render đệ quy danh sách
  const renderOptions = (
    items: ICategoryWithChildren[],
    level = 0
  ): React.ReactNode[] => {
    return items.flatMap((item) => [
      <SelectItem key={item._id} value={item._id}>
        {'— '.repeat(level) + item.name}
      </SelectItem>,
      ...(item.children ? renderOptions(item.children, level + 1) : []),
    ])
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange} >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={placeholder}/>
              </SelectTrigger>
              <SelectContent>{renderOptions(tree)}</SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
