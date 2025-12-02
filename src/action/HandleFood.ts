"use server"
import { revalidateTag } from 'next/cache';

export const HandleCreateFood  = async (data: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/create`, {
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
    revalidateTag('food');
    return result;
  } catch (error) {
    console.error('🚨 Error creating  :', error);
    throw error;
  }
  
};
export const HandleUpdateFood  = async (data: any, id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store', // Đảm bảo không bị cache
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to update  ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('food');
    return result;
  } catch (error) {
    console.error('🚨 Error updating  :', error);
    throw error;
  }
};
export const HandleDeleteFood  = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Đảm bảo không bị cache
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to delete  ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('food');
    return result;
  } catch (error) {
    console.error('🚨 Error deleting  :', error);
    throw error;
  }
};