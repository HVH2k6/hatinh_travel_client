import ListShopRegister from '@/model/shopRegister/ListShopRegister';
import { cookies } from 'next/headers';

export default async function page() {
  // Lấy cookie store - không cần await
  const cookieStore = await cookies();
  
  // Lấy giá trị của access_token - chỉ đọc, không xóa
  const token = cookieStore.get('access_token')?.value;
  
  console.log('🚀 ~ page ~ token (from server):', token);
  
  // Kiểm tra token trước khi gọi API
  if (!token) {
    console.error('Không tìm thấy access token trên server');
    return (
      <div className="mx-auto max-w-4xl p-4">
        <h1 className="text-2xl font-bold text-red-600">
          Bạn cần đăng nhập để xem trang này
        </h1>
      </div>
    );
  }

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sellerapplication/me`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }

    const res = await data.json();
    

    return (
      <div className="mx-auto max-w-4xl p-4">
        <h1 className="mb-6 text-3xl font-bold">
          Lịch sử Đơn đăng ký Shop
        </h1>
        
        <ListShopRegister data={res.data} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div className="mx-auto max-w-4xl p-4">
        <h1 className="text-2xl font-bold text-red-600">
          Có lỗi xảy ra khi tải dữ liệu
        </h1>
      </div>
    );
  }
}