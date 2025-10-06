
import CategoryTable from '@/model/category/CategoryTable';
import { getCategories } from '@/model/category/pagination';
import { pagination } from '@/util/constant';

export default async function AttractionsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getCategories({ page, limit });
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <CategoryTable data={result.data}  />
    </div>
  );
}
