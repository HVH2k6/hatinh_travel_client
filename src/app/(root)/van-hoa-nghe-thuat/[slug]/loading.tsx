// src/app/(root)/dia-diem-du-lich/[slug]/loading.tsx
import ArtDetail from '@/model/art/ArtDetail';

export default function Loading() {
  
  return <ArtDetail data={null as any} isLoading={true} />;
}