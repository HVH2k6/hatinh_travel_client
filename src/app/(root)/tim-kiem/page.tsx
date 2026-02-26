import { Suspense } from 'react';

import SearchSkeleton from '@/components/search/SearchSkeleton';
import SearchResults from '@/components/search/SearchRelust';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = params?.q as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Kết quả tìm kiếm: "${query}"` : 'Tìm kiếm'}
      </h1>
      
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}