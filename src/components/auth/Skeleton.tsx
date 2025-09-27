// components/auth/HeaderUserSkeleton.tsx
'use client';

import { cn } from '@/lib/utils'; // nếu chưa có cn, thay bằng chuỗi className trực tiếp
import { Skeleton } from '@/components/ui/skeleton';

type Size = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<Size, string> = {
  sm: 'h-8 w-8',   // 32px
  md: 'h-9 w-9',   // 36px (khớp header hiện tại)
  lg: 'h-10 w-10', // 40px
};

export default function HeaderUserSkeleton({
  size = 'md',
  withRing = true,
  showName = false,
  className,
}: {
  size?: Size;
  withRing?: boolean;
  showName?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} aria-hidden>
      {/* Avatar */}
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          withRing && 'ring-1 ring-border shadow-sm',
          SIZE_MAP[size]
        )}
      >
        {/* lớp nền mượt */}
        <div className="absolute inset-0 bg-muted/60" />
        {/* shimmer nhẹ bằng pulse */}
        <Skeleton className="h-full w-full rounded-full animate-pulse" />
        {/* ánh sáng chéo rất nhẹ để có chiều sâu */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>

      {/* Tên (tùy chọn) */}
      {showName && (
        <div className="hidden sm:flex flex-col">
          <Skeleton className="h-3 w-20 rounded-md animate-pulse" />
          <Skeleton className="mt-1 h-3 w-12 rounded-md animate-pulse" />
        </div>
      )}
    </div>
  );
}
