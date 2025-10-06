import { ICategory } from '@/interfaces/ICategory'
import UpdateCategory from '@/model/category/UpdateCategory'
import type { Metadata } from 'next'

type PageParams = { id: string }
type PageProps = { params: Promise<PageParams> } // 👈 params là Promise

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params // 👈 await trước khi dùng
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/update/${id}`, { cache: 'no-store' })
    if (!res.ok) {
      return { title: `Không tìm thấy danh mục #${id}`, description: 'Trang sửa danh mục' }
    }
    const data: ICategory | null = await res.json()
    return {
      title: data?.name ? `Sửa danh mục: ${data.name}` : `Sửa danh mục #${id}`,
      description: 'Trang sửa danh mục',
    }
  } catch {
    return { title: `Lỗi khi tải danh mục #${id}`, description: 'Trang sửa danh mục' }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params // 👈 await trước khi dùng
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/update/${id}`, { cache: 'no-store' })

  if (!res.ok) return <div>Không có dữ liệu</div>
const categoryData = await res.json()
  const data: ICategory | null = categoryData.category
  console.log("🚀 ~ Page ~ data:", data)
  if (!data) return <div>Không có dữ liệu</div>

  return <UpdateCategory data={data} />
}
