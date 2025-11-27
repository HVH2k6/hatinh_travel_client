
import { ISellerApplication } from '@/interfaces/ISellerApplication'
import DetailRegister from '@/model/shopRegister/Detail'
import type { Metadata } from 'next'

type PageParams = { id: string }
type PageProps = { params: Promise<PageParams> } // 👈 params là Promise

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params // 👈 await trước khi dùng
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellerapplication/seller-application-detail/${id}`, { cache: 'no-store' })
    if (!res.ok) {
      return { title: `Không tìm thấy yêu cầu #${id}`, description: 'Trang xem chi tiết yêu cầu' }
    }
    const data: ISellerApplication | null = await res.json()
    return {
      title: data?.shopDraft.name ? `Xem chi tiết yêu cầu đăng ký shop: ${data.shopDraft.name}` : `Sửa  #${id}`,
      description: 'Trang xem chi tiết yêu cầu',
    }
  } catch {
    return { title: `Lỗi khi tải danh mục #${id}`, description: 'Trang sửa danh mục' }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params // 👈 await trước khi dùng
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellerapplication/seller-application-detail/${id}`, { cache: 'no-store' })

  if (!res.ok) return <div>Không có dữ liệu</div>
const RegisterShopData = await res.json()
  const data: ISellerApplication | null = RegisterShopData
  console.log("🚀 ~ Page ~ data:", data)
  if (!data) return <div>Không có dữ liệu</div>

  return <DetailRegister data={data} />
}
