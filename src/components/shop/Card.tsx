'use client';
import { IShop } from '@/interfaces/IShop';
import { STATUS_SHOP } from '@/util/constant';
import { Button } from '../ui/button';
import Link from 'next/link';

const CardShop = ({ shop }: { shop: IShop }) => {
  return (
    <div className='w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300'>
      {/* Shop Image */}
      <div className='relative h-48 bg-gray-100'>
        <img
          src={shop.image}
          alt={shop.name}
          className='w-full h-full object-cover'
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/320x192?text=No+Image';
          }}
        />
        {shop.status === STATUS_SHOP.ACTIVE && (
          <div className='absolute top-3 right-3'>
            <span className='bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full'>
              Đang hoạt động
            </span>
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className='p-4 space-y-3'>
        {/* Shop Name */}
        <h3 className='text-xl font-bold text-gray-800 truncate'>
          {shop.name}
        </h3>

        {/* Category */}
        <div className='flex items-center space-x-2'>
          <svg
            className='w-5 h-5 text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
            />
          </svg>
          <div>
            <p className='text-sm text-gray-500'>Danh mục</p>
            {/* Thêm optional chaining (?.) đề phòng categoryId null */}
            <p className='text-sm font-medium text-gray-700'>
              {shop.categoryId?.name || 'Không có danh mục'}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2 pt-3 border-t border-gray-100'>
          <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
            {/* Chỉ lấy chữ cái đầu tiên của username để hiển thị avatar */}
            {shop.sellerId?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm text-gray-500'>Người bán</p>
            <p className='text-sm font-medium text-gray-700 truncate'>
              {shop.sellerId?.username || 'Ẩn danh'}
            </p>
          </div>
        </div>
         <Button className='w-full bg-blue-500 hover:bg-blue-600'>
          <Link href={`/cua-hang/${shop.slug}`} className='block w-full'>Xem chi tiết</Link>
        </Button>
      </div>
    </div>
  );
};

// 2. Export default ListCard
// Đổi tên prop đầu vào thành 'data' để khớp với cách gọi bên Page
export default function ListShop({ data }: { data: IShop[] }) {
  // Kiểm tra nếu không có data thì không render hoặc báo lỗi nhẹ
  if (!data || data.length === 0) {
    return <p className='text-gray-500'>Chưa có cửa hàng nào.</p>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {data.map((shop) => (
        <CardShop key={shop._id} shop={shop} />
      ))}
    </div>
  );
}
