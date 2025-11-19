import { IShop } from '@/interfaces/IShop';
import CreateProduct from '@/model/product/CreateProduct';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; // 👈 params là Promise

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Thêm sản phẩm',
  };
}
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value;
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/me/shops/${id}`,
    {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const shopdata = await res.json();
//   console.log("🚀 ~ Page ~ shopdata:", shopdata)

  const data: IShop | null = shopdata;
  console.log("🚀 ~ Page ~ data:", data)
  

  if (!data) return <div>Không có dữ liệu</div>;
  return <CreateProduct data={data}></CreateProduct>;
return<></>
}
