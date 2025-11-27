

import DataTypeTable from '@/model/type/data-table';
import { getType } from '@/model/type/pagination';
import { TypeTable } from '@/model/type/TypeTable';
import DataUnitTable from '@/model/unit/data-table';
import { getUnit } from '@/model/unit/pagination';

import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách đơn vị tính',
  description: 'Trang quản lý danh sách đơn vị tính',
};
export default async function TypePage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getUnit({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <DataUnitTable data={result.data} />
    </div>
  );
}
