import React from 'react';
import Link from 'next/link';
import { IShop } from '@/interfaces/IShop';
import { IProduct } from '@/interfaces/IProduct';
import {
  MapPin,
  Phone,
  Facebook,
  MessageCircle,
  Share2,
  Heart,
  User,
  ShieldCheck,
  Store,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewSection from '@/components/review/ReviewSection';

// --- HELPER FETCH PRODUCTS ---
async function fetchProductsByShop(shopId: string): Promise<IProduct[]> {
  try {
    // Gọi API theo route: router.get('/products/:id', controller.getAllByShopId);
    // Lưu ý: Controller của bạn dùng paginate, nên kết quả trả về thường là { docs: [], ... } hoặc { data: [], ... }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/products/${shopId}?limit=12`,
      {
        cache: 'no-store', // Hoặc next: { revalidate: ... }
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    console.log('🚀 ~ fetchProductsByShop ~ data:', data);
    // Kiểm tra cấu trúc trả về của paginate
    return data.docs || data.data || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// --- COMPONENTS UI NHỎ ---
const Badge = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}
  >
    {children}
  </span>
);

const ProductCard = ({ product }: { product: IProduct }) => {
  return (
    <div className='group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full'>
      <div className='relative h-48 w-full overflow-hidden bg-gray-100'>
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
        />
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button className='p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500'>
            <Heart className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='p-4 flex flex-col flex-1'>
        <h3 className='font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
          {product.name}
        </h3>

        <div className='mt-auto pt-3 border-t border-gray-50 flex items-center justify-between'>
          <span className='text-lg font-bold text-blue-600'>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
            /{product.unitId.symbol}
          </span>
        </div>
        <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
          <Link href={`/san-pham/${product.slug}`} className='block w-full'>
            Xem chi tiết
          </Link>
        </Button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
// Nhận props { shop } thay vì params
export default async function ShopDetailPage({ shop }: { shop: IShop }) {
  // Gọi API lấy products ngay trên Server Component
  const products = await fetchProductsByShop(shop._id);

  // Helper xử lý địa chỉ
  const provinceName = (shop.address.provinceId as any)?.name || '';
  // const districtName = (shop.address.districtId as any)?.name || '';
  const wardName = (shop.address.wardId as any)?.name || '';
  const fullAddress = [
    shop.address.detail,
    wardName,
    // districtName,
    provinceName,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className='min-h-screen bg-[#F8F9FA] font-sans pb-20'>
      {/* --- HERO BANNER --- */}
      <div className='relative h-[45vh] w-full bg-gray-900 group'>
        <img
          src={shop.image || '/placeholder-image.jpg'}
          alt={shop.name}
          className='h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
            <div className='space-y-3 text-white'>
              <div className='flex items-center gap-2'>
                <Badge className='bg-blue-600 border-none text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'>
                  {(shop.categoryId as any)?.name}
                </Badge>
                {shop.status?.toLowerCase() === 'active' && (
                  <span className='flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20 backdrop-blur-md'>
                    <span className='relative flex h-2 w-2'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                    </span>
                    Đang hoạt động
                  </span>
                )}
              </div>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg capitalize'>
                {shop.name}
              </h1>
              <div className='flex items-center text-gray-200 text-sm md:text-base font-medium'>
                <MapPin className='w-4 h-4 mr-2 text-red-500 shrink-0' />
                <span className='truncate max-w-xl'>{fullAddress}</span>
              </div>
            </div>
            {/* Actions */}
            <div className='flex gap-3 pb-2'>
              <button className='flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 font-medium text-sm'>
                <Share2 className='w-4 h-4' />{' '}
                <span className='hidden sm:inline'>Chia sẻ</span>
              </button>
              <button className='flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 font-medium text-sm'>
                <Heart className='w-4 h-4' />{' '}
                <span className='hidden sm:inline'>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* CỘT TRÁI (8/12) */}
          <div className='lg:col-span-8 space-y-8'>
            {/* 1. Giới thiệu */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <div className='flex items-center gap-2 mb-4 text-blue-600'>
                <Store className='w-6 h-6' />
                <h2 className='text-xl font-bold text-gray-900'>Giới thiệu</h2>
              </div>
              <p className='text-gray-600 leading-relaxed mb-6'>
                {shop.description ||
                  `Chào mừng đến với ${
                    shop.name
                  }. Chúng tôi cung cấp các sản phẩm chất lượng thuộc danh mục ${
                    (shop.categoryId as any)?.name
                  }.`}
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-slate-50 p-4 rounded-xl flex items-start gap-3'>
                  <div className='bg-white p-2 rounded-lg shadow-sm text-blue-600'>
                    <CalendarDays className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase font-semibold'>
                      Ngày tham gia
                    </p>
                    <p className='font-medium text-gray-900'>
                      {shop.createdAt
                        ? new Date(shop.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='bg-slate-50 p-4 rounded-xl flex items-start gap-3'>
                  <div className='bg-white p-2 rounded-lg shadow-sm text-orange-500'>
                    <User className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase font-semibold'>
                      Chủ sở hữu
                    </p>
                    <p className='font-medium text-gray-900 capitalize'>
                      {(shop.sellerId as any)?.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DANH SÁCH SẢN PHẨM (MỚI THÊM) */}
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='w-6 h-6 text-blue-600' />
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Sản phẩm nổi bật
                  </h2>
                  <span className='ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full'>
                    {products.length}
                  </span>
                </div>
                {products.length > 0 && (
                  <Link
                    href='#'
                    className='text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1'
                  >
                    Xem tất cả <ArrowRight className='w-4 h-4' />
                  </Link>
                )}
              </div>

              {products.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {products.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              ) : (
                <div className='bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300'>
                  <ShoppingBag className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>
                    Cửa hàng chưa đăng tải sản phẩm nào.
                  </p>
                </div>
              )}
            </div>
            <ReviewSection targetId={shop._id} targetType='Shop'/>
          </div>

          {/* CỘT PHẢI (4/12): Sticky Contact Sidebar */}
          <div className='lg:col-span-4'>
            <div className='sticky top-24 space-y-5'>
              <div className='bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 overflow-hidden relative'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0'></div>
                <div className='relative z-10 flex flex-col items-center text-center mb-6'>
                  <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-blue-200 shadow-lg mb-3 ring-4 ring-white'>
                    {(shop.sellerId as any)?.username?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 capitalize'>
                    {(shop.sellerId as any)?.username}
                  </h3>
                  <div className='flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1'>
                    <ShieldCheck className='w-3 h-3' /> Đã xác thực
                  </div>
                </div>
                <div className='space-y-3 relative z-10'>
                  {shop.contact?.phone && (
                    <a
                      href={`tel:${shop.contact.phone}`}
                      className='group flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-5 rounded-xl transition-all shadow-md active:scale-95'
                    >
                      <span className='flex items-center gap-3'>
                        <Phone className='w-5 h-5 fill-current' /> Gọi điện ngay
                      </span>
                      <span className='opacity-90 font-normal'>
                        {shop.contact.phone}
                      </span>
                    </a>
                  )}
                  {shop.contact?.facebook && (
                    <a
                      href={shop.contact.facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center gap-3 w-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-semibold py-3.5 px-5 rounded-xl transition-all'
                    >
                      <Facebook className='w-5 h-5' /> Nhắn tin Facebook
                    </a>
                  )}
                  <button className='flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-700 font-semibold py-3.5 px-5 rounded-xl transition-all'>
                    <MessageCircle className='w-5 h-5 text-gray-500' /> Chat
                    Zalo
                  </button>
                </div>
              </div>
              <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
                <h4 className='font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide'>
                  Khu vực hoạt động
                </h4>
                <div className='flex items-start gap-3'>
                  <MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
                  <p className='text-sm text-gray-600'>
                    {wardName},<br />
                    <span className='font-semibold text-gray-900'>
                      {provinceName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
