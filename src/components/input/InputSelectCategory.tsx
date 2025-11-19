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
  // Thêm prop mới để chỉ xem danh mục con của một slug cụ thể
  parentSlugViewOnly?: string
}

export function InputSelectCategory<T extends FieldValues>({
  control,
  name,
  label = 'Danh mục',
  placeholder = 'Chọn danh mục',
  allowedSlugs,
  parentSlugViewOnly,
}: InputSelectCategoryProps<T>) {
  // const [categories, setCategories] = React.useState<ICategory[]>([]) // Giữ lại nếu cần, nhưng hiện tại có thể không dùng
  const [tree, setTree] = React.useState<ICategoryWithChildren[]>([])
  const [filtered, setFiltered] = React.useState<ICategory[]>([])
  // State mới để lưu các danh mục con cháu được lọc
  const [childrenOnly, setChildrenOnly] = React.useState<ICategory[]>([])

  // Hàm đệ quy tìm tất cả con cháu
  const getAllDescendants = (
    items: ICategory[],
    parentId: string | null
  ): ICategory[] => {
    const directChildren = items.filter((cat) => (cat.parentId ?? null) === parentId)
    const descendants: ICategory[] = []
    for (const child of directChildren) {
      descendants.push(child)
      descendants.push(...getAllDescendants(items, child._id))
    }
    return descendants
  }

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          cache: 'no-store',
        })

        const data = await res.json()

        if (data?.data) {
          const allCategories = data.data as ICategory[]
          // console.log("🚀 ~ fetchCategories ~ all:", allCategories)

          if (allowedSlugs && allowedSlugs.length > 0) {
            // Logic lọc theo allowedSlugs (Ưu tiên 1)
            const filteredCategories = allCategories.filter((cat) =>
              allowedSlugs.includes(cat.slug)
            )
            setFiltered(filteredCategories)
          } else if (parentSlugViewOnly) {
            // Logic chỉ xem danh mục con (Ưu tiên 2)
            const parentCategory = allCategories.find(
              (cat) => cat.slug === parentSlugViewOnly
            )
            if (parentCategory) {
              const descendants = getAllDescendants(
                allCategories,
                parentCategory._id
              )
              setChildrenOnly(descendants)
            } else {
              setChildrenOnly([])
            }
          } else {
            // Logic mặc định: Hiển thị toàn bộ dạng cây
            // setCategories(allCategories)
            setTree(buildCategoryTree(allCategories))
          }
        }
      } catch (err) {
        console.error('Lỗi khi fetch categories:', err)
      }
    }

    fetchCategories()
  }, [allowedSlugs, parentSlugViewOnly]) // Thêm parentSlugViewOnly vào dependency array

  // Tự động set value nếu allowedSlug chỉ có 1 giá trị
  React.useEffect(() => {
    if (allowedSlugs && allowedSlugs.length === 1 && filtered.length === 1) {
      formSetValue(filtered[0]._id)
    }
  }, [filtered]) // Không cần formSetValue trong dependency vì nó được gán lại trong render

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

  // Khai báo ngoài scope của render và gán lại trong render
  let formSetValue: (value: string) => void = () => {}

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

  // Hàm render danh mục phẳng (dùng cho allowedSlugs hoặc childrenOnly)
  function renderFlatOptions(items: ICategory[]): React.ReactNode[] {
    return items.map((cat) => (
      <SelectItem key={cat._id} value={cat._id}>
        {cat.name}
      </SelectItem>
    ))
  }

  const renderSelectContent = () => {
    if (allowedSlugs && allowedSlugs.length > 0) {
      // Ưu tiên 1: Lọc theo allowedSlugs
      return renderFlatOptions(filtered)
    } else if (parentSlugViewOnly) {
      // Ưu tiên 2: Chỉ xem con cháu của parentSlugViewOnly
      return renderFlatOptions(childrenOnly)
    } else {
      // Mặc định: Hiển thị toàn bộ dạng cây
      return renderOptions(tree)
    }
  }

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
                  {renderSelectContent()}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}