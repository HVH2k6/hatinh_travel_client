import AttractionsTable from '@/model/attraction/AttractionsTable';
import { getAttractions } from '@/model/attraction/pagination';
import { pagination } from '@/util/constant';

export default async function AttractionsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getAttractions({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <AttractionsTable data={result.data} pagination={result.pagination} />
    </div>
  );
}
