'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { ICategory } from '@/interfaces/ICategory'

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

  type ICategoryWithChildren = ICategory & { children?: ICategoryWithChildren[] }

  // Fetch danh mục
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`)
        const data = await res.json()
        if (data?.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Build cây cha-con từ mảng phẳng
  React.useEffect(() => {
    setTree(buildCategoryTree(categories))
  }, [categories])

  const buildCategoryTree = (
    items: ICategory[],
    parentId: string | null = null
  ): ICategoryWithChildren[] => {
    const tree = items
      .filter((cat) => {
        const pid = cat.parentId ? cat.parentId.toString() : null
        return pid === parentId
      })
      .map((cat) => ({
        ...cat,
        children: buildCategoryTree(items, cat._id),
      }))
  
    // Nếu không có danh mục gốc nào (tree rỗng), render toàn bộ không phân cấp
    return tree.length > 0 ? tree : items.map((cat) => ({ ...cat }))
  }
  

  const renderOptions = (items: ICategoryWithChildren[], level = 0): React.ReactNode[] => {
    return items.flatMap((item) => [
      <SelectItem key={item._id} value={item._id}>
        {`${'— '.repeat(level)}${item.name}`}
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
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
