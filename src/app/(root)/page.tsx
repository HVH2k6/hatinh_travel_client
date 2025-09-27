// app/page.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import AttractionList from '@/components/attraction/AttractionList'
import BannerAttraction from '@/components/attraction/Banner'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Khám Phá Du Lịch'
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  || 'http://localhost:3000'
const OG_IMAGE  = '/og/home.jpg' // đặt file trong /public/og/home.jpg

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} – Khám phá địa điểm, đặc sản & chợ`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Khám phá du lịch Việt Nam: gợi ý địa điểm nổi bật, đặc sản địa phương, chợ truyền thống, lịch mở cửa, chi phí tham khảo và kinh nghiệm đi lại. Cập nhật liên tục, dễ tìm kiếm theo khu vực.',
  keywords: [
    'du lịch', 'đi du lịch', 'địa điểm du lịch', 'đặc sản', 'chợ truyền thống',
    'kinh nghiệm du lịch', 'review du lịch', 'lịch mở cửa', 'giá vé tham quan', 'Việt Nam'
  ],
  alternates: {
    canonical: '/',
    languages: { 'vi-VN': '/', 'en-US': '/en' }, // nếu có bản EN
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} – Khám phá địa điểm, đặc sản & chợ`,
    description:
      'Tìm kiếm nhanh địa điểm du lịch, đặc sản địa phương, chợ truyền thống và thông tin mở cửa/chi phí. Lên kế hoạch chuyến đi dễ dàng.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Ảnh bìa trang chủ du lịch Việt Nam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – Khám phá địa điểm, đặc sản & chợ`,
    description:
      'Gợi ý điểm đến, đặc sản và chợ địa phương khắp Việt Nam. Cập nhật nhanh, dễ tìm kiếm.',
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
  authors: [{ name: SITE_NAME }],
}

// --- Trang chủ ---
export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions`, { cache: 'no-store' })
  const data = await response.json()

  return (
    <>
      {/* JSON-LD: WebSite + SearchAction */}
      <Script id="ld-home" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/tim-kiem?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}
      </Script>

      <div className="container">
        <BannerAttraction />
        <div className="mt-10">
          <AttractionList data={data.data || []} />
        </div>
      </div>
    </>
  )
}
