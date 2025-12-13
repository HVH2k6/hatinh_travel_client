import type { Metadata } from 'next';
import Script from 'next/script';
import AttractionList from "@/model/attraction/AttractionList";
import Pagination from "@/components/ui/pagination-item"; // Import component phân trang

// 1. Cấu hình SEO Metadata
export const metadata: Metadata = {
  title: 'Top 20+ Địa Điểm Du Lịch Hà Tĩnh Nổi Tiếng Nhất 2025',
  description: 'Khám phá các điểm đến hấp dẫn tại Hà Tĩnh: Biển Thiên Cầm, Chùa Hương Tích, Ngã Ba Đồng Lộc... Cẩm nang du lịch, giá vé và hướng dẫn chi tiết.',
  keywords: ['Du lịch Hà Tĩnh', 'Địa điểm tham quan Hà Tĩnh', 'Check-in Hà Tĩnh', 'Biển Thiên Cầm', 'Du lịch tâm linh Hà Tĩnh'],
  openGraph: {
    title: 'Bản đồ du lịch Hà Tĩnh - Top điểm đến không thể bỏ qua',
    description: 'Danh sách tổng hợp các danh lam thắng cảnh, di tích lịch sử và bãi biển đẹp tại Hà Tĩnh.',
    url: 'https://hatinhtravel.net/dia-diem-du-lich',
    type: 'website',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1dcdrKXnA6FWUIMnf01SRJNVK2gdYe21K', // Thay ảnh banner du lịch
        width: 1200,
        height: 630,
        alt: 'Địa điểm du lịch Hà Tĩnh',
      },
    ],
  },
  alternates: {
    canonical: 'https://hatinhtravel.net/dia-diem-du-lich',
  },
};

// Hàm lấy dữ liệu (Hỗ trợ phân trang)
async function getAttractions(page: number = 1, limit: number = 24) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attractions?limit=${limit}&page=${page}`,
      { next: { revalidate: 3600 } } // Cache 1 tiếng
    );
    
    if (!res.ok) return { data: [], totalPages: 0 };
    
    const json = await res.json();
    return {
      data: json.data || [],
      totalPages: json.pagination?.totalPages || 1 // Thay đổi tùy theo response API của bạn
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách địa điểm:", error);
    return { data: [], totalPages: 0 };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const LIMIT = 12;

  const { data: attractions, totalPages } = await getAttractions(currentPage, LIMIT);

  // 2. Tạo Schema JSON-LD (TouristAttraction)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh sách Địa điểm du lịch Hà Tĩnh',
    description: 'Các điểm tham quan nổi tiếng',
    itemListElement: attractions.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristAttraction',
        name: item.name,
        description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150),
        image: item.image,
        url: `https://hatinhtravel.net/dia-diem-du-lich/${item.slug}`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: item.address?.provinceId?.name || 'Hà Tĩnh',
            addressRegion: 'Hà Tĩnh',
            addressCountry: 'VN'
        }
      },
    })),
  };

  return (
    <>
      <Script
        id="json-ld-attraction-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Thẻ H1 ẩn cho SEO */}
        <h1 className="sr-only">Danh sách các địa điểm du lịch Hà Tĩnh - Trang {currentPage}</h1>

        {attractions.length > 0 ? (
          <>
            <AttractionList data={attractions} isHeading={false} />
            
            {/* Phân trang */}
            <div className="mt-8">
               <Pagination totalPages={totalPages} />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có địa điểm nào được cập nhật.</p>
          </div>
        )}
      </div>
    </>
  );
}