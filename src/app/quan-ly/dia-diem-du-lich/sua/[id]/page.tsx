import { IAttraction } from '@/interfaces/IAttraction';
import UpdateAttraction from '@/model/attraction/UpdateAttraction';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // ✅ BẮT BUỘC await trong Next 15
  console.log("🚀 ~ Page ~ id:", id)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attractions/update-detail/${id}`,
    { cache: 'no-store' }
  );
  console.log("🚀 ~ Page ~ res:", res)


  const data: IAttraction | null = await res.json();
  console.log("🚀 ~ Page ~ data:", data)
  if (!res.ok || !data ) {
    return <div>Không có dữ liệu</div>;
  }

  return <UpdateAttraction data={data} />;
}
