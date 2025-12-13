import type { Metadata } from 'next';
import Script from 'next/script';
import ListFood from "@/model/food/ListFood";

// 1. Cấu hình Metadata chuẩn SEO cho trang danh sách
export const metadata: Metadata = {
  title: 'Top 20+ Đặc sản Hà Tĩnh Nổi Tiếng & Món Ngon Phải Thử | Hà Tĩnh Travel',
  description: 'Danh sách tổng hợp các món đặc sản Hà Tĩnh ngon nức tiếng: Cu đơ, Ram mướt, Gỏi cá đục... Địa chỉ ăn ngon, giá cả và mua làm quà uy tín.',
  keywords: ['Đặc sản Hà Tĩnh', 'Món ngon Hà Tĩnh', 'Ẩm thực Hà Tĩnh', 'Mua quà Hà Tĩnh'],
  openGraph: {
    title: 'Khám phá thiên đường ẩm thực & Đặc sản Hà Tĩnh',
    description: 'Tổng hợp danh sách những món ăn đặc sản đậm chất miền Trung tại Hà Tĩnh.',
    url: 'https://hatinhtravel.net/dac-san', // Thay bằng URL thực tế của trang này
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/your-cloud/image/upload/banner-am-thuc.jpg', // Ảnh đại diện cho danh mục ẩm thực
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

// Hàm lấy dữ liệu (Tách ra để dễ quản lý)
async function getFoods() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/food?limit=24`,
      // 2. Tối ưu Performance: Cache 1 tiếng (3600s) thay vì no-store
      // Giúp trang load nhanh hơn, cải thiện Core Web Vitals
      { next: { revalidate: 3600 } } 
    );
    
    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Lỗi lấy danh sách món ăn:", error);
    return [];
  }
}

export default async function Page() {
  const foods = await getFoods();

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
        description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 150),
        image: item.image,
        url: `https://hatinhtravel.net/dac-san/${item.slug}`, // URL chi tiết
        offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'VND'
        }
      },
    })),
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <Script
        id="json-ld-food-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Thẻ H1 ẩn hoặc hiện tùy design, nhưng cần thiết cho SEO */}
        <h1 className="sr-only">Danh sách Đặc sản Hà Tĩnh - Món ngon làm quà</h1>
        
        <ListFood food={foods} isHeading={false} />
      </div>
    </>
  );
}