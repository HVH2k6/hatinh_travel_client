import AttractionsTable from '@/model/attraction/AttractionsTable';
import { getAttractions } from '@/model/attraction/pagination';
import { getShops } from '@/model/shop/pagination';
import ShopTable from '@/model/shop/ShopTable';
import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách các cửa hàng',
//   description: 'Trang quản lý danh sách địa điểm du lịch',
};
export default async function ShopPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getShops({ page, limit });
  console.log("🚀 ~ ShopPage ~ result:", result)
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <ShopTable data={result.data} />
    </div>
  );
}
