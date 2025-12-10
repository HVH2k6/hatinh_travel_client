// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
import { notFound } from 'next/navigation'

import type { IAttraction } from '@/interfaces/IAttraction'
import AttractionDetail from '@/model/attraction/AttractionDetail'
import { IProduct } from '@/interfaces/IProduct'
import ProductDetailPage from '@/model/product/DetailProduct'

async function fetchData(slug: string): Promise<IProduct | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/get/${slug}`, {
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
  const data = await fetchData(slug)
  if (!data) return notFound()

  return <ProductDetailPage productData={data} />
}
