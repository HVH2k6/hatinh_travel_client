import { IFood } from '@/interfaces/IFood';
import UpdateFood from '@/model/food/UpdateFood';

import type { Metadata } from 'next';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; // 👈 params là Promise

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Sửa đặc sản',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // 👈 await trước khi dùng
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const foodData = await res.json();
  
  const data: IFood | null = foodData;
  
  if (!data) return <div>Không có dữ liệu</div>;

  return <UpdateFood data={data}/>;
}
