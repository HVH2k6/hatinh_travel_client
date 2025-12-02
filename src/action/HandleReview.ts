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
export const HandleCreateReview = async (data: any) => {
  try {
    // Lấy headers trước khi fetch
    const headers = await getAuthHeaders(); 

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
      method: 'POST',
      headers: headers, // Truyền object đã được await
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to create review');
    }

    const result = await res.json();
    revalidateTag('review');
    return result;
  } catch (error) {
    console.error('🚨 Error creating review:', error);
    throw error;
  }
};

// 2. UPDATE REVIEW
export const HandleUpdateReview = async (data: any, id: string) => {
  try {
    const headers = await getAuthHeaders(); // Thêm await

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/review/${id}`,
      {
        method: 'PUT',
        headers: headers, // Truyền biến headers vào
        body: JSON.stringify(data),
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to update review');
    }

    const result = await res.json();
    revalidateTag('review');
    return result;
  } catch (error) {
    console.error('🚨 Error updating review:', error);
    throw error;
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