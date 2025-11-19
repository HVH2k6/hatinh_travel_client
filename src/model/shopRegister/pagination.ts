import { pagination } from "@/util/constant";
import { cookies } from 'next/headers'; // 1. Import hàm cookies

export async function getSellerRegisterShop({ page = pagination.page, limit = pagination.limit }) {
  // 2. Lấy access_token từ cookie
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value; // Tên cookie của bạn

  // 3. Kiểm tra xem có token không
  if (!accessToken) {
    // Bạn có thể redirect về trang đăng nhập hoặc throw lỗi
    throw new Error("Không tìm thấy access token. Vui lòng đăng nhập lại.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellerapplication/seller-applications?page=${page}&limit=${limit}`, {
    next: { tags: ['shopRegister'] },
    headers: {
      // 4. Sửa lại header Authorization cho đúng
      "Authorization": `Bearer ${accessToken}`, 
      "Content-Type": "application/json", // Thêm header này
    },
  });

  if (!res.ok) throw new Error("Lỗi lấy dữ liệu");

  const json = await res.json();
  

  return {
    data: json.data,
    pagination: json.pagination,
  };
}