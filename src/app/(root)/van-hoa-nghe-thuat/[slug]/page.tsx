// src/app/(root)/dia-diem-du-lich/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { IArt } from '@/interfaces/IArt'
import ArtDetail from '@/model/art/ArtDetail'

// Hàm fetch data
async function fetchArt(slug: string): Promise<IArt | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/art/detail/${slug}`, {
      next: { revalidate: 60 },
    })
    
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching art:', error)
    return null
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Trong lúc dòng này đang "await", file loading.tsx sẽ được hiển thị
  const data = await fetchArt(slug)

  if (!data) return notFound()

  // Khi có data, loading.tsx biến mất, dòng này được render
  return <ArtDetail data={data} />
}