import { cookies } from 'next/headers';
import DetailShopMe from '@/model/shop/DetailShopMe';
import { Metadata } from 'next';


type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; 
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Quản lý cửa hàng',
  };
}
export default async function page() {
  // Get the headers object from Next.js
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value;
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/me/shops`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  if(!data.data) return <div>Không có dữ liệu</div>
  return (
    <div className='p-5'>
      <h1 className='text-2xl font-semibold mb-3'>
        Danh sách của hàng của bạn
      </h1>
      <DetailShopMe data={data.data} />
    </div>
  );
}
