

import DataTypeTable from '@/model/type/data-table';
import { getType } from '@/model/type/pagination';
import { TypeTable } from '@/model/type/TypeTable';

import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách loại hình du lịch',
  description: 'Trang quản lý danh sách loại hình du lịch',
};
export default async function TypePage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getType({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <DataTypeTable data={result.data} />
    </div>
  );
}
