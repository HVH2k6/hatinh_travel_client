import HaTinhTourism from '@/components/info/InfoTravel';
import type { Metadata } from 'next';
import Script from 'next/script';

// 1. Cấu hình Metadata chuẩn SEO
export const metadata: Metadata = {
  title: 'Du lịch Hà Tĩnh 2025 - Khám phá Điểm đến, Đặc sản & Văn hóa',
  description:
    'Cẩm nang du lịch Hà Tĩnh toàn tập: Top địa điểm tham quan nổi tiếng, món ngon đặc sản phải thử và nét đẹp văn hóa nghệ thuật truyền thống.',
  keywords: ['Du lịch Hà Tĩnh', 'Địa điểm Hà Tĩnh', 'Đặc sản Hà Tĩnh', 'Cu đơ', 'Biển Thiên Cầm', 'Chùa Hương Tích'],
  openGraph: {
    title: 'Du lịch Hà Tĩnh - Trải nghiệm vẻ đẹp miền Trung',
    description: 'Khám phá vẻ đẹp thiên nhiên và con người Hà Tĩnh. Lên lịch trình ngay hôm nay!',
    url: 'https://hatinhtravel.net', // Thay bằng domain thật của bạn
    siteName: 'Hà Tĩnh Travel',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1-JrjtTWwKh8EZzfbV6dCN3E1wfjfIpqB', // Thay bằng ảnh banner đẹp nhất
        width: 1200,
        height: 630,
        alt: 'Du lịch Hà Tĩnh',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Du lịch Hà Tĩnh - Khám phá & Trải nghiệm',
    description: 'Top điểm đến và món ăn ngon tại Hà Tĩnh.',
  },
  alternates: {
    canonical: 'https://hatinhtravel.net', // Quan trọng để tránh trùng lặp nội dung
  },
};

// Hàm lấy dữ liệu (Tách ra để tái sử dụng nếu cần)
async function getData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 2. Tối ưu Performance: Dùng Promise.all để fetch song song 3 API cùng lúc
  // Giúp giảm thời gian chờ (Time To First Byte - TTFB) -> Tốt cho SEO
  const [resAttractions, resFood, resArt] = await Promise.all([
    fetch(`${API_URL}/attractions?limit=4`, { next: { revalidate: 3600 } }), // Cache 1 tiếng (Tốt hơn no-store)
    fetch(`${API_URL}/food?limit=4`, { next: { revalidate: 3600 } }),
    fetch(`${API_URL}/art?limit=4`, { next: { revalidate: 3600 } }),
  ]);

  if (!resAttractions.ok || !resFood.ok || !resArt.ok) {
    // Xử lý lỗi nhẹ nhàng, không crash trang
    return { attractions: [], foods: [], arts: [] };
  }

  const dataAttractions = await resAttractions.json();
  const dataFood = await resFood.json();
  const dataArt = await resArt.json();

  return {
    attractions: dataAttractions.data || [],
    foods: dataFood.data || [],
    arts: dataArt.data || [],
  };
}

export default async function Page() {
  const { attractions, foods, arts } = await getData();

  // 3. Tạo Schema Markup (JSON-LD)
  // Giúp Google hiển thị dạng danh sách (List) đẹp mắt trên kết quả tìm kiếm
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      ...attractions.slice(0, 5).map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: item.name,
          description: item.description,
          image: item.image,
          address: {
            '@type': 'PostalAddress',
            addressLocality: item.address?.provinceId?.name || 'Hà Tĩnh',
            addressRegion: 'Hà Tĩnh',
            addressCountry: 'VN',
          },
        },
      })),
    ],
  };

  return (
    <>
      {/* Inject JSON-LD vào trang */}
      <Script
        id="json-ld-tourism"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HaTinhTourism data={attractions} foods={foods} arts={arts} />
    </>
  );
}