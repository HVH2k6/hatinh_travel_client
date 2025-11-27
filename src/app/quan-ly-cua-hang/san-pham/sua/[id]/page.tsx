import { IProduct } from '@/interfaces/IProduct';
import { IShop } from '@/interfaces/IShop';
import UpdateProduct from '@/model/product/UpdateProduct';
import UpdateShop from '@/model/shop/UpdateShop';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; // 👈 params là Promise

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Sửa sản phẩm',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // 👈 await trước khi dùng

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/detail/${id}`, {
    cache: 'no-store',
    
  });

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const productData = await res.json();
  
  const data: IProduct | null = productData;
  
  if (!data) return <div>Không có dữ liệu</div>;

  return <UpdateProduct data={data}></UpdateProduct>;
}
