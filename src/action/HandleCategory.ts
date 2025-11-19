"use server"
import { revalidateTag } from 'next/cache';

export const HandleCreateCategory  = async (data: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
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
      throw new Error(errorData?.message || 'Failed to create category ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thành công
    revalidateTag('category');
    return result;
  } catch (error) {
    console.error('🚨 Error creating category :', error);
    throw error;
  }
  
};
export const HandleUpdateCategory  = async (data: any, id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/update/${id}`, {
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
      throw new Error(errorData?.message || 'Failed to update category ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('category');
    return result;
  } catch (error) {
    console.error('🚨 Error updating category :', error);
    throw error;
  }
};
export const HandleDeleteCategory  = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Đảm bảo không bị cache
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Server responded with error:', errorData);
      throw new Error(errorData?.message || 'Failed to delete category ');
    }

    const result = await res.json();

    // Chỉ revalidate nếu tạo thông báo
    revalidateTag('category');
    return result;
  } catch (error) {
    console.error('🚨 Error deleting category :', error);
    throw error;
  }
};