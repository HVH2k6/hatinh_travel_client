// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
import { notFound } from 'next/navigation'

import FoodDetail from '@/model/food/FoodDetail'
import { IFood } from '@/interfaces/IFood'
import ListFood from '@/model/food/ListFood'

async function fetchFood(slug: string): Promise<IFood[] | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food/ward/${slug}`, {
    next: { revalidate: 60 }, // hoặc cache: 'no-store' nếu cần
  })
  if (!res.ok) return null
  return res.json()
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // 🔧 quan trọng: await params
  const { slug } = await params
  const data = await fetchFood(slug)
  if (!data) return <p>Không có dữ liệu</p>

  return <ListFood food={data} />

}
