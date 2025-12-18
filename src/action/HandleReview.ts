'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// 1. Đánh dấu hàm này là async để tương thích tốt nhất (đặc biệt là Next.js 15)
const getAuthHeaders = async () => {
  const cookieStore = await cookies(); // Thêm await ở đây nếu dùng Next.js 15
  const token = cookieStore.get('access_token')?.value;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || ''}`,
  };
};

// 1. CREATE REVIEW
// LƯU Ý: Không throw Error để tránh làm vỡ Server Components khi Server Action fail.
// Thay vào đó luôn trả về object { success, data?, error? } để client tự handle.
export const HandleCreateReview = async (data: any) => {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('❌ Server responded with error:', result);
      return {
        success: false,
        error: result?.message || 'Failed to create review',
      };
    }

    revalidateTag('review');
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('🚨 Error creating review:', error);
    return {
      success: false,
      error: error?.message || 'Failed to create review',
    };
  }
};

// 2. UPDATE REVIEW
// TƯƠNG TỰ CREATE: không throw Error ra ngoài để tránh làm vỡ Server Components.
// Luôn trả về object { success, data?, error? }.
export const HandleUpdateReview = async (data: any, id: string) => {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('❌ Server responded with error:', result);
      return {
        success: false,
        error: result?.message || 'Failed to update review',
      };
    }

    revalidateTag('review');
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('🚨 Error updating review:', error);
    return {
      success: false,
      error: error?.message || 'Failed to update review',
    };
  }
};

// 3. DELETE REVIEW
export const HandleDeleteReview = async (id: string) => {
  try {
    const headers = await getAuthHeaders(); // Thêm await

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/review/${id}`,
      {
        method: 'DELETE',
        headers: headers, // Truyền biến headers vào
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to delete review');
    }

    const result = await res.json();
    revalidateTag('review');
    return result;
  } catch (error) {
    console.error('🚨 Error deleting review:', error);
    throw error;
  }
};