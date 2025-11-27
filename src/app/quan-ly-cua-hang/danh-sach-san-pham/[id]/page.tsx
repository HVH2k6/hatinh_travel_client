import { getProduct } from '@/model/product/pagination';
import ProductTable from '@/model/product/ProductTable';
import { pagination } from '@/util/constant';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: number; limit?: number }>;
}

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm',
};

export default async function TypePage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Props) {

  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  
  const id = params.id;

  console.log('🚀 ~ TypePage ~ ID:', id); 

  
  const page = searchParams.page || pagination.page;
  const limit = searchParams.limit || pagination.limit;
  if (!id) {
    return <p>Lỗi: Không tìm thấy ID sản phẩm.</p>;
  }

  const result = await getProduct({ id, page, limit });

  if (!result.data) return <p>Không có dữ liệu</p>;
  return <ProductTable data={result.data} />;
}
