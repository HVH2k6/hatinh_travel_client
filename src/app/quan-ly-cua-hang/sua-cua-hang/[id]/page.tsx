import { IShop } from '@/interfaces/IShop';
import UpdateShop from '@/model/shop/UpdateShop';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; // 👈 params là Promise

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Sửa cửa hàng',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // 👈 await trước khi dùng
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value;
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/me/shops/${id}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const shopdata = await res.json();
  
  const data: IShop | null = shopdata;
  
  if (!data) return <div>Không có dữ liệu</div>;

  return <UpdateShop data={data}></UpdateShop>;
}
