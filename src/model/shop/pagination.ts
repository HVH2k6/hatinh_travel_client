import { pagination } from '@/util/constant';
import { cookies } from 'next/headers';

// Cập nhật interface props để chứa page, limit, và id
interface props {
  page?: number; // Thêm ? vì nó có giá trị mặc định
  limit?: number; // Thêm ? vì nó có giá trị mặc định
}

export async function getShops({
  page = pagination.page,
  limit = pagination.limit,
}: props) {
  // Ví dụ 2: Nếu ID là một query parameter (dùng cho tìm kiếm/lọc)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shop/shops/?page=${page}&limit=${limit}`,
    {
      next: { tags: ['shop'] },
    }
  );

  if (!res.ok) throw new Error('Lỗi lấy dữ liệu');

  const json = await res.json();

  return {
    data: json.data,
    pagination: json.pagination,
  };
}
