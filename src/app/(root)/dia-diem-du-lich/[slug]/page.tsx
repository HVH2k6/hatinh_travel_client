// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next' // 1. Import Metadata
import Script from 'next/script' // 2. Import Script để chèn JSON-LD

import type { IAttraction } from '@/interfaces/IAttraction'
import AttractionDetail from '@/model/attraction/AttractionDetail'

// Hàm fetch data (Next.js sẽ tự động dedupe request này, nên gọi 2 lần không sao)
async function fetchAttraction(slug: string): Promise<IAttraction | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions/detail/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/* ================= 1. TẠO METADATA ĐỘNG ================= */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Đợi params (Next.js 15+)
  const { slug } = await params
  
  // Fetch dữ liệu
  const attraction = await fetchAttraction(slug)

  // Nếu không tìm thấy, trả về metadata mặc định hoặc để page xử lý 404
  if (!attraction) {
    return {
      title: 'Không tìm thấy địa điểm',
    }
  }

  // Lấy ảnh trước đó (nếu có) để làm fallback
  const previousImages = (await parent).openGraph?.images || []

  const title = `${attraction.name} - Du lịch Hà Tĩnh`
  // Cắt ngắn mô tả nếu quá dài (tốt cho SEO ~160 ký tự)
  const description = attraction.description 
    ? attraction.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
    : `Khám phá ${attraction.name} tại Hà Tĩnh. Điểm đến hấp dẫn với nhiều trải nghiệm thú vị.`

  return {
    title: title,
    description: description,
    // Cấu hình OpenGraph (Hiển thị khi share Facebook/Zalo)
    openGraph: {
      title: title,
      description: description,
      url: `https://hatinhtravel.net/dia-diem-du-lich/${slug}`, // Thay domain thật
      siteName: 'Hà Tĩnh Travel',
      images: [
        {
          url: attraction.image || '', // Ảnh đại diện của địa điểm
          width: 800,
          height: 600,
          alt: attraction.name,
        },
        ...previousImages,
      ],
      locale: 'vi_VN',
      type: 'article', // Hoặc 'website'
    },
    // Cấu hình Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [attraction.image || ''],
    },
    // Canonical URL (Tránh trùng lặp nội dung)
    alternates: {
      canonical: `https://hatinhtravel.net/dia-diem-du-lich/${slug}`,
    },
  }
}

/* ================= 2. PAGE CONTENT & JSON-LD ================= */
export default async function Page({ params }: Props) {
  const { slug } = await params
  const attraction = await fetchAttraction(slug)

  if (!attraction) return notFound()

  // Tạo cấu trúc dữ liệu Schema.org (Google rất thích cái này cho du lịch)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: attraction.name,
    description: attraction.description?.replace(/<[^>]*>?/gm, ''), // Loại bỏ thẻ HTML trong mô tả
    image: attraction.image ? [attraction.image, ...(attraction.list_image || [])] : [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: attraction.address?.provinceId?.name || 'Hà Tĩnh',
      addressRegion: 'Hà Tĩnh',
      addressCountry: 'VN',
      streetAddress: `${attraction.address?.detail || ''}, ${attraction.address?.wardId?.name || ''}`,
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Nếu DB bạn có lưu tọa độ thì điền vào đây, không thì bỏ qua
      latitude: '', 
      longitude: '',
    },
    priceRange: attraction.isFree 
        ? 'Miễn phí' 
        : `${attraction.minPrice?.toLocaleString()}VNĐ - ${attraction.maxPrice?.toLocaleString()}VNĐ`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        opens: attraction.openTime ? new Date(attraction.openTime).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}) : '00:00',
        closes: attraction.closeTime ? new Date(attraction.closeTime).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}) : '23:59'
      }
    ]
  }

  return (
    <>
      {/* Inject JSON-LD vào thẻ script */}
      <Script
        id="json-ld-attraction"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AttractionDetail attraction={attraction} />
    </>
  )
}