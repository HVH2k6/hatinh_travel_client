import { IArt } from '@/interfaces/IArt';
import UpdateArt from '@/model/art/UpdateArt';

import type { Metadata } from 'next';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> }; // 👈 params là Promise

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: 'Sửa nghệ thuật',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // 👈 await trước khi dùng
  // Gợi ý: API nên có khả năng lọc theo tỉnh, ví dụ: /attractions?province=ha-tinh
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/art/update-detail/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return <div>Không có dữ liệu</div>;
  const artData = await res.json();
  
  const data: IArt | null = artData;
  
  if (!data) return <div>Không có dữ liệu</div>;

  return <UpdateArt data={data}/>;
}
