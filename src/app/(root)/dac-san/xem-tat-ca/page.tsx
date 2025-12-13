import type { Metadata } from 'next';
import Script from 'next/script';
import ListFood from '@/model/food/ListFood';
import Pagination from '@/components/ui/pagination-item';

// 1. Cấu hình Metadata chuẩn SEO cho trang danh sách
export const metadata: Metadata = {
  title:
    'Top 20+ Đặc sản Hà Tĩnh Nổi Tiếng & Món Ngon Phải Thử | Hà Tĩnh Travel',
  description:
    'Danh sách tổng hợp các món đặc sản Hà Tĩnh ngon nức tiếng: Cu đơ, Ram mướt, Gỏi cá đục... Địa chỉ ăn ngon, giá cả và mua làm quà uy tín.',
  keywords: [
    'Đặc sản Hà Tĩnh',
    'Món ngon Hà Tĩnh',
    'Ẩm thực Hà Tĩnh',
    'Mua quà Hà Tĩnh',
  ],
  openGraph: {
    title: 'Khám phá thiên đường ẩm thực & Đặc sản Hà Tĩnh',
    description:
      'Tổng hợp danh sách những món ăn đặc sản đậm chất miền Trung tại Hà Tĩnh.',
    url: 'https://hatinhtravel.net/dac-san', // Thay bằng URL thực tế của trang này
    type: 'website',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1LfRUSgcfjxUAVuYU7kC3fFlLUIoiIpP-', // Ảnh đại diện cho danh mục ẩm thực
        width: 1200,
        height: 630,
        alt: 'Ẩm thực Hà Tĩnh',
      },
    ],
  },
  alternates: {
    canonical: 'https://hatinhtravel.net/dac-san',
  },
};
async function getFoods(page: number = 1, limit: number = 24) {
  try {
    // Gọi API với tham số page và limit
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/food?limit=${limit}&page=${page}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return { data: [], totalPages: 0 };

    const json = await res.json();

    // Giả sử API trả về cấu trúc: { data: [...], pagination: { totalPages: 10, ... } }
    // Nếu API chỉ trả về totalItems, bạn tính totalPages = Math.ceil(totalItems / limit)
    return {
      data: json.data || [],
      totalPages: json.pagination?.totalPages || 1, // Thay đổi tùy theo response thực tế của API
    };
  } catch (error) {
    console.error('Lỗi lấy danh sách món ăn:', error);
    return { data: [], totalPages: 0 };
  }
}

// Next.js App Router: Page nhận props searchParams
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>; // Next.js 15 bắt buộc await searchParams
}) {
  // 1. Lấy trang hiện tại từ URL
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const LIMIT = 24;

  // 2. Fetch dữ liệu theo trang
  const { data: foods, totalPages } = await getFoods(currentPage, LIMIT);
  // 3. Tạo Schema Markup dạng ItemList (Danh sách)
  // Giúp Google hiểu cấu trúc danh sách và các phần tử bên trong
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Danh sách Đặc sản Hà Tĩnh',
    description: 'Các món ăn nổi tiếng tại Hà Tĩnh',
    itemListElement: foods.map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product', // Hoặc 'FoodEstablishment' nếu là quán ăn
        name: item.name,
        description: item.description
          ?.replace(/<[^>]*>?/gm, '')
          .substring(0, 150),
        image: item.image,
        url: `https://hatinhtravel.net/dac-san/${item.slug}`, // URL chi tiết
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'VND',
        },
      },
    })),
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <Script
        id='json-ld-food-list'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='container mx-auto px-4 py-8'>
        {/* Thẻ H1 ẩn hoặc hiện tùy design, nhưng cần thiết cho SEO */}
        <h1 className='sr-only'>
          Danh sách Đặc sản Hà Tĩnh - Món ngon làm quà
        </h1>

        <ListFood food={foods} isHeading={false} />
        <div className='mt-8'>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
