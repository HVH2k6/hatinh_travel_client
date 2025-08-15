// components/editor/TiptapWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

// 👇 dynamic import ở client component → hợp lệ
const Tiptap = dynamic(() => import('./Test'), {
  ssr: false,
})

export default function TiptapWrapper() {
  return <Tiptap />
}
