// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx (Lưu ý: Route này thường dành cho địa điểm, nếu là món ăn bạn cân nhắc đổi thành /dac-san/[slug])
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import Script from 'next/script'

import FoodDetail from '@/model/food/FoodDetail'
import { IFood } from '@/interfaces/IFood'

// Fetch data (Next.js sẽ dedupe request này)
async function fetchFood(slug: string): Promise<IFood | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/food-detail/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/* ================= 1. METADATA ĐỘNG (SEO ON-PAGE) ================= */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const food = await fetchFood(slug)

  if (!food) {
    return {
      title: 'Không tìm thấy món ăn',
    }
  }

  // Lấy ảnh fallback từ layout cha nếu món ăn không có ảnh
  const previousImages = (await parent).openGraph?.images || []

  // Xử lý mô tả: Loại bỏ HTML tags nếu nội dung là Rich Text
  const plainDesc = food.description 
    ? food.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
    : `Thưởng thức ${food.name} - Đặc sản nổi tiếng Hà Tĩnh.`

  const title = `${food.name} - Đặc sản Hà Tĩnh`

  return {
    title: title,
    description: plainDesc,
    keywords: [food.name, 'Đặc sản Hà Tĩnh', 'Món ngon Hà Tĩnh', food.ingredients || ''],
    
    // Open Graph (Hiển thị đẹp trên Facebook/Zalo)
    openGraph: {
      title: title,
      description: plainDesc,
      url: `https://hatinhtravel.net/dac-san/${slug}`, // Đổi lại đúng path thực tế của bạn
      siteName: 'Hà Tĩnh Travel',
      images: [
        {
          url: food.image || '',
          width: 800,
          height: 600,
          alt: food.name,
        },
        ...previousImages,
      ],
      locale: 'vi_VN',
      type: 'article',
    },
    // Canonical URL
    alternates: {
      canonical: `https://hatinhtravel.net/dac-san/${slug}`,
    },
  }
}

/* ================= 2. PAGE CONTENT & JSON-LD ================= */
export default async function Page({ params }: Props) {
  const { slug } = await params
  const data = await fetchFood(slug)

  if (!data) return notFound()

  // Tạo Schema Markup loại Product (Sản phẩm)
  // Google sẽ hiển thị giá tiền, hình ảnh và trạng thái hàng hóa
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    image: data.image ? [data.image, ...(data.list_image || [])] : [],
    description: data.description?.replace(/<[^>]*>?/gm, ''),
    sku: data._id, // Hoặc slug
    offers: {
      '@type': 'Offer',
      url: `https://hatinhtravel.net/dac-san/${slug}`,
      priceCurrency: 'VND',
      price: data.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Hà Tĩnh Travel'
      }
    },
    // Thêm thông tin nguyên liệu nếu có (Dạng additionalProperty)
    additionalProperty: data.ingredients ? [
        {
            '@type': 'PropertyValue',
            name: 'Nguyên liệu chính',
            value: data.ingredients
        }
    ] : []
  }

  return (
    <>
      {/* Inject JSON-LD giúp Google hiểu đây là sản phẩm/món ăn */}
      <Script
        id="json-ld-food"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FoodDetail food={data} />
    </>
  )
}