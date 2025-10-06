import { IType } from '@/interfaces/IType'
import UpdateType from '@/model/type/UpdateType'
import type { Metadata } from 'next'

// 👇 Trong Next 15+, params là Promise
type PageParams = { id: string }
type PageProps = { params: Promise<PageParams> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params // ✅ phải await

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/update/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return {
        title: `Không tìm thấy loại hình #${id}`,
        description: 'Trang sửa loại hình du lịch',
      }
    }

    const data: IType | null = await res.json()
    return {
      title: data?.name ? `Sửa loại hình: ${data.name}` : `Sửa loại hình #${id}`,
      description: data?.description || 'Trang sửa loại hình du lịch',
    }
  } catch {
    return {
      title: `Lỗi khi tải loại hình #${id}`,
      description: 'Trang sửa loại hình du lịch',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params // ✅ phải await

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/update/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) return <div>Không có dữ liệu</div>

  const data: IType | null = await res.json()
  if (!data) return <div>Không có dữ liệu</div>

  return <UpdateType data={data} />
}
