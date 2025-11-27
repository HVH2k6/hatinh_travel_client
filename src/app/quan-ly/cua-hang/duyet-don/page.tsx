
import SellerApplicationTable from '@/model/shopRegister/data-table';
import { getSellerRegisterShop } from '@/model/shopRegister/pagination';
import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách shop bán hàng',
  description: 'Trang quản lý danh sách shop bán hàng',
};
export default async function SellerRegisterPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: number; limit?: number }>;
}) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;

  const result = await getSellerRegisterShop({ page, limit });
  console.log("🚀 ~ SellerRegisterPage ~ result:", result)
  if(!result.data) return <p>Không có dữ liệu</p>
  

  return (
    <div className='p-6 space-y-4'>
      <SellerApplicationTable data={result.data}  />
    </div>
  );
}
