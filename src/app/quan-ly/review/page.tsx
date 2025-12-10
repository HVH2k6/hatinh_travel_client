import { Suspense } from 'react';
import ReviewPage from "@/model/review/ReviewData";
import { Skeleton } from '@/components/ui/skeleton';

// Loading component cho Suspense fallback
function ReviewPageSkeleton() {
  return (
    <div className='p-6 space-y-6 bg-slate-50 min-h-screen'>
      <Skeleton className='h-8 w-64' />
      <Skeleton className='h-32 w-full' />
      <Skeleton className='h-96 w-full' />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ReviewPageSkeleton />}>
      <ReviewPage />
    </Suspense>
  );
}