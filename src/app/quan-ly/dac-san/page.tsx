

import DataFoodTable from '@/model/food/data-table';
import { getFood } from '@/model/food/pagination';

import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách đặc sản',
  description: 'Trang quản lý danh sách đặc sản',
};
export default async function page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getFood({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <DataFoodTable data={result.data} />
    </div>
  );
}
