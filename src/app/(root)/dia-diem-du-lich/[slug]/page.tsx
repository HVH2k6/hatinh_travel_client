// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
import { notFound } from 'next/navigation'

import type { IAttraction } from '@/interfaces/IAttraction'
import AttractionDetail from '@/model/attraction/AttractionDetail'

async function fetchAttraction(slug: string): Promise<IAttraction | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions/detail/${slug}`, {
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
  const attraction = await fetchAttraction(slug)
  if (!attraction) return notFound()

  return <AttractionDetail attraction={attraction} />
}
