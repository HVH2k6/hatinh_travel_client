import { IAttraction } from '@/interfaces/IAttraction';
import UpdateAttraction from '@/model/attraction/UpdateAttraction';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ✅ Dynamic metadata với params được await
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { id } = await params; // ← Await params trước khi destructure

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attractions/update-detail/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      return {
        title: `Không tìm thấy địa điểm #${id}`,
        description: 'Trang sửa địa điểm du lịch',
      };
    }

    const data: IAttraction | null = await res.json();
    return {
      title: data?.name
        ? `Sửa địa điểm: ${data.name}`
        : `Sửa địa điểm #${id}`,
      description: data?.description || 'Trang sửa địa điểm du lịch',
    };
  } catch (error) {
    return {
      title: `Lỗi khi tải địa điểm #${id}`,
      description: 'Trang sửa địa điểm du lịch',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // ← Await params trước khi destructure

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attractions/update-detail/${id}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <div>Không có dữ liệu</div>;
  }

  const data: IAttraction | null = await res.json();
  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  return <>
  <UpdateAttraction data={data} />
  </>
}