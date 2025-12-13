// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
// (Lưu ý: Nếu đây là Văn hóa/Nghệ thuật, route nên là /van-hoa-nghe-thuat/[slug] sẽ chuẩn hơn về cấu trúc URL)

import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import Script from 'next/script'

import { IArt } from '@/interfaces/IArt'
import ArtDetail from '@/model/art/ArtDetail'

// Fetch data (Next.js sẽ tự động dedupe request)
async function fetchArt(slug: string): Promise<IArt | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/art/detail/${slug}`, {
      next: { revalidate: 60 },
    })
    
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching art:', error)
    return null
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

/* ================= 1. METADATA ĐỘNG ================= */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchArt(slug)

  if (!data) {
    return {
      title: 'Không tìm thấy nội dung',
    }
  }

  // Lấy ảnh fallback từ layout cha nếu bài viết không có ảnh
  const previousImages = (await parent).openGraph?.images || []
  
  // Xử lý mô tả: Loại bỏ HTML tags để lấy text thuần
  const plainDesc = data.description 
    ? data.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
    : `Khám phá nét đẹp ${data.name} - Văn hóa nghệ thuật đặc sắc tại Hà Tĩnh.`

  const title = `${data.name} - Văn hóa & Nghệ thuật Hà Tĩnh`
  const pageUrl = `https://hatinhtravel.net/van-hoa-nghe-thuat/${slug}` // Thay domain thật

  return {
    title: title,
    description: plainDesc,
    // Keywords: Kết hợp tên, danh mục và địa danh
    keywords: [
        data.name, 
        'Văn hóa Hà Tĩnh', 
        'Nghệ thuật truyền thống', 
        data.address?.provinceId?.name || 'Hà Tĩnh',
        data.categoryId?.name || ''
    ].filter(Boolean),

    openGraph: {
      title: title,
      description: plainDesc,
      url: pageUrl,
      siteName: 'Hà Tĩnh Travel',
      images: [
        {
          url: data.image || '',
          width: 800,
          height: 600,
          alt: data.name,
        },
        ...previousImages,
      ],
      locale: 'vi_VN',
      type: 'article', // Quan trọng: Khai báo là bài viết
      publishedTime: data.createdAt ? new Date(data.createdAt).toISOString() : undefined,
      modifiedTime: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
      authors: ['Hà Tĩnh Travel'],
      section: 'Culture',
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

/* ================= 2. PAGE CONTENT & JSON-LD ================= */
export default async function Page({ params }: Props) {
  const { slug } = await params
  const data = await fetchArt(slug)

  if (!data) return notFound()

  // Tạo JSON-LD chuẩn cho Bài viết (Article)
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Article', // Google ưu tiên loại này cho tin tức/văn hóa
    headline: data.name,
    image: data.image ? [data.image, ...(data.list_image || [])] : [],
    description: data.description?.replace(/<[^>]*>?/gm, ''),
    author: {
      '@type': 'Organization',
      name: 'Hà Tĩnh Travel',
      url: 'https://hatinhtravel.net'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hà Tĩnh Travel',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hatinhtravel.net/logo.png' // Link logo web bạn
      }
    },
    datePublished: data.createdAt,
    dateModified: data.updatedAt || data.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hatinhtravel.net/van-hoa-nghe-thuat/${slug}`
    },
    // Quan trọng: Gắn bài viết với địa điểm thực tế (Local SEO)
    contentLocation: {
      '@type': 'Place',
      name: `${data.address?.wardId?.name || ''}, ${data.address?.provinceId?.name || 'Hà Tĩnh'}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.address?.provinceId?.name || 'Hà Tĩnh',
        addressCountry: 'VN'
      }
    }
  }

  // Nếu có video, thêm Schema VideoObject
  if (data.video_url) {
    jsonLd['video'] = {
      '@type': 'VideoObject',
      name: `Video giới thiệu ${data.name}`,
      description: `Xem video chi tiết về ${data.name} tại Hà Tĩnh`,
      thumbnailUrl: data.image, // Dùng ảnh đại diện làm thumb video
      uploadDate: data.createdAt,
      contentUrl: data.video_url,
      embedUrl: data.video_url // Nếu là link youtube embed
    }
  }

  return (
    <>
      <Script
        id="json-ld-art"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArtDetail data={data} />
    </>
  )
}