// app/page.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import AttractionList from '@/components/attraction/AttractionList'
import BannerAttraction from '@/components/attraction/Banner'
import CardSgop from '@/components/shop/Card'
import CardShop from '@/components/shop/Card'

// --- TỐI ƯU HÓA CHO HÀ TĨNH ---
const SITE_NAME = 'Cẩm Nang Du Lịch Hà Tĩnh'
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const OG_IMAGE  = '/og/ha-tinh.jpg' // Đổi tên ảnh để thể hiện rõ nội dung

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `Du Lịch Hà Tĩnh 2025: Cẩm Nang, Địa Điểm & Đặc Sản`,
    template: `%s – ${SITE_NAME}`,
  },
  description:
    'Khám phá toàn bộ du lịch Hà Tĩnh: Cẩm nang chi tiết về các địa điểm nổi tiếng như Chùa Hương Tích, biển Thiên Cầm, Ngã ba Đồng Lộc. Cập nhật thông tin đặc sản, văn hóa và kinh nghiệm du lịch mới nhất 2025.',
  keywords: [
    'du lịch Hà Tĩnh', 'địa điểm du lịch Hà Tĩnh', 'đặc sản Hà Tĩnh', 'biển Thiên Cầm',
    'chùa Hương Tích Hà Tĩnh', 'kinh nghiệm du lịch Hà Tĩnh', 'ẩm thực Hà Tĩnh', 'Ngã ba Đồng Lộc'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `Du Lịch Hà Tĩnh 2025: Cẩm Nang Toàn Tập`,
    description:
      'Cẩm nang du lịch Hà Tĩnh chi tiết nhất: khám phá các địa điểm, đặc sản, văn hóa và lên kế hoạch chuyến đi dễ dàng.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Ảnh bìa Cẩm nang du lịch Hà Tĩnh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Du Lịch Hà Tĩnh 2025: Cẩm Nang Toàn Tập`,
    description:
      'Cẩm nang du lịch Hà Tĩnh chi tiết nhất: khám phá các địa điểm, đặc sản, văn hóa và lên kế hoạch chuyến đi dễ dàng.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: 'travel',
}

// --- Trang chủ ---
export default async function Home() {
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions`, { cache: 'no-store' })
  const data = await response.json()
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage', // Dùng CollectionPage tốt hơn cho trang danh sách
    name: 'Tổng hợp Địa điểm Du lịch Hà Tĩnh',
    description: 'Danh sách các địa điểm tham quan, di tích lịch sử và danh lam thắng cảnh nổi bật tại tỉnh Hà Tĩnh.',
    url: SITE_URL,
    about: {
      '@type': 'Place',
      name: 'Hà Tĩnh, Việt Nam'
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: data.data?.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction', // Khai báo rõ từng item là địa điểm du lịch
          name: item.name,
          description: item.description.substring(0, 150), // Lấy mô tả ngắn
          url: `${SITE_URL}/dia-diem/${item.slug}`, // Đường dẫn tới trang chi tiết
          image: item.image
        }
      })) || []
    }
  }

  return (
    <>
      <Script id="ld-home" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      <div className="container">
        <BannerAttraction />
        <div className="mt-10">
          <h1 className="text-3xl font-bold mb-6">Các Địa Điểm Nổi Bật tại Hà Tĩnh</h1>
          <AttractionList data={data.data || []} />
          {/* <CardShop  /> */}
        </div>
      </div>
    </>
  )
}