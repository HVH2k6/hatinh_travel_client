'use server';

import { revalidateTag } from 'next/cache';

export const HandleCreateAttraction  = async (data: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions/create`, {
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
      throw new Error(errorData?.message || 'Failed to create attraction ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thành công
    revalidateTag('attraction');
    return result;
  } catch (error) {
    console.error('🚨 Error creating attraction :', error);
    throw error;
  }
  
};
export const HandleUpdateAttraction  = async (data: any, id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions/update/${id}`, {
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
      throw new Error(errorData?.message || 'Failed to update attraction ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('attraction');
    return result;
  } catch (error) {
    console.error('🚨 Error updating attraction :', error);
    throw error;
  }
};
export const HandleDeleteAttraction  = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Đảm bảo không bị cache
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to delete attraction ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('attraction');
    return result;
  } catch (error) {
    console.error('🚨 Error deleting attraction :', error);
    throw error;
  }
};