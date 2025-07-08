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
  allowedSlugs?: string[]
}

export function InputSelectCategory<T extends FieldValues>({
  control,
  name,
  label = 'Danh mục',
  placeholder = 'Chọn danh mục',
  allowedSlugs,
}: InputSelectCategoryProps<T>) {
  const [categories, setCategories] = React.useState<ICategory[]>([])
  const [tree, setTree] = React.useState<ICategoryWithChildren[]>([])
  const [filtered, setFiltered] = React.useState<ICategory[]>([])

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          cache: 'no-store',
        })
        const data = await res.json()

        if (data?.categories) {
          const all = data.categories as ICategory[]

          if (allowedSlugs && allowedSlugs.length > 0) {
            const filteredCategories = all.filter((cat) =>
              allowedSlugs.includes(cat.slug)
            )
            setFiltered(filteredCategories)
          } else {
            setCategories(all)
            setTree(buildCategoryTree(all))
          }
        }
      } catch (err) {
        console.error('Lỗi khi fetch categories:', err)
      }
    }

    fetchCategories()
  }, [allowedSlugs])

  // Tự động set value nếu allowedSlug chỉ có 1 giá trị
  React.useEffect(() => {
    if (allowedSlugs && allowedSlugs.length === 1 && filtered.length === 1) {
      formSetValue(filtered[0]._id)
    }
  }, [filtered])

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

  let formSetValue: (value: string) => void = () => {}

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        formSetValue = field.onChange // Lưu để dùng ngoài useEffect

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {allowedSlugs && allowedSlugs.length > 0
                    ? filtered.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    : renderOptions(tree)}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )

  // Đệ quy render cây danh mục
  function renderOptions(
    items: ICategoryWithChildren[],
    level = 0
  ): React.ReactNode[] {
    return items.flatMap((item) => [
      <SelectItem key={item._id} value={item._id}>
        {'— '.repeat(level) + item.name}
      </SelectItem>,
      ...(item.children ? renderOptions(item.children, level + 1) : []),
    ])
  }
}
