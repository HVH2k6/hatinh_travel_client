import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next' // 1. Import types cho Metadata

import { IShop } from '@/interfaces/IShop'
import ShopDetailPage from '@/model/shop/ShopDetail'

// Định nghĩa type cho Props để tái sử dụng
type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchShop(slug: string): Promise<IShop | null> {
  // Lưu ý: Next.js sẽ tự động deduplicate request này nếu gọi nhiều lần trong 1 render pass
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/shop-detail/${slug}`, {
    next: { revalidate: 60 }, 
  })
  if (!res.ok) return null
  return res.json()
}

// 2. Hàm sinh Metadata động
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const shop = await fetchShop(slug)

  // Nếu không tìm thấy shop, trả về metadata mặc định hoặc lỗi
  if (!shop) {
    return {
      title: 'Không tìm thấy cửa hàng',
      description: 'Cửa hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
    }
  }

  // Xử lý dữ liệu để hiển thị đẹp hơn
  const provinceName = (shop.address.provinceId as any)?.name || ''
  const categoryName = (shop.categoryId as any)?.name || 'Cửa hàng'
  
  // Tối ưu Title: Tên Shop | Danh mục - Tỉnh thành
  const title = `${shop.name} - ${categoryName} tại ${provinceName}`.trim()
  
  // Tối ưu Description: Lấy mô tả shop hoặc tự tạo fallback, cắt ngắn chuẩn SEO (khoảng 150-160 ký tự)
  const description = shop.description 
    ? shop.description.slice(0, 160) + (shop.description.length > 160 ? '...' : '')
    : `Khám phá ${shop.name}, chuyên cung cấp ${categoryName} uy tín, chất lượng tại ${provinceName}. Liên hệ ngay: ${shop.contact?.phone || ''}.`

  // Lấy ảnh trước đó (nếu có set ở layout cha) để làm fallback
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: title,
    description: description,
    // Cấu hình Open Graph (Hiển thị khi share lên Facebook, Zalo)
    openGraph: {
      title: title,
      description: description,
      url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/dia-diem-du-lich/${slug}`, // Cần biến môi trường domain thật
      siteName: 'Tên Website Của Bạn', // Ví dụ: Travel Market
      images: [
        {
          url: shop.image || '', // Ảnh đại diện shop
          width: 800,
          height: 600,
          alt: shop.name,
        },
        ...previousImages,
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    // Cấu hình Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [shop.image || ''],
    },
    // Keywords (Tùy chọn, Google giờ ít dùng nhưng các search engine khác có thể cần)
    keywords: [shop.name, categoryName, provinceName, 'du lịch', 'đặc sản', 'mua sắm'],
  }
}

// 3. Page Component chính
export default async function Page({ params }: Props) {
  const { slug } = await params
  const shopData = await fetchShop(slug)
  
  if (!shopData) return notFound()

  return <ShopDetailPage shop={shopData}/>
}