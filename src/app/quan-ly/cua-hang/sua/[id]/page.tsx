import { IShop } from '@/interfaces/IShop';
import UpdateShop from '@/model/shop/UpdateShop';
import UpdateShopByAdmin from '@/model/shop/UpdateShopByAdmin';

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
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/shops/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const shopdata = await res.json();
  
  const data: IShop | null = shopdata;
  
  if (!data) return <div>Không có dữ liệu</div>;

  return <UpdateShopByAdmin data={data}></UpdateShopByAdmin>;
}
