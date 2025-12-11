

import DataArtTable from '@/model/art/data-table';
import { getArt } from '@/model/art/pagination';

import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách nghệ thuật',
  description: 'Trang quản lý danh sách nghệ thuật',
};
export default async function page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getArt({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <DataArtTable data={result.data} />
    </div>
  );
}
