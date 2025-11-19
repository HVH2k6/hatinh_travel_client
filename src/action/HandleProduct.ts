"use server"
import { revalidateTag } from 'next/cache';

export const HandleCreateProduct  = async (data: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store', // Đảm bảo không bị cache
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to create  ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thành công
    revalidateTag('product');
    return result;
  } catch (error) {
    console.error('🚨 Error creating  :', error);
    throw error;
  }
  
};