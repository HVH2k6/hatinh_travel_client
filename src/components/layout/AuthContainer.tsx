'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthContainerProps = {
  children: React.ReactNode;
  /** Ảnh panel trái (nên đặt trong /public để khỏi config domain) */
  heroImageSrc?: string;
  /** alt text cho ảnh để tốt hơn cho a11y/SEO */
  heroAlt?: string;
  /** Brand text góc trái (desktop) */
  brand?: string;
  /** Chips địa danh */
  places?: string[];
  /** Tông màu chính */
  palette?: 'sky' | 'emerald';
  /** Ẩn/hiện nút về trang chủ */
  showHome?: boolean;
  /** Thêm class bên ngoài thẻ Card khi cần */
  className?: string;
  /** Độ mờ overlay ở panel trái (0–100, %), mặc định 50 */
  overlayOpacity?: number;
  /** Tắt redirect khi đã đăng nhập (ví dụ trang giới thiệu) */
  disableRedirectIfLoggedIn?: boolean;
};

export default function AuthContainer({
  children,
  heroImageSrc = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroAlt = 'Hà Tĩnh – biển & di tích',
  brand = 'Visit Hà Tĩnh',
  places = ['Thiên Cầm', 'Đồng Lộc', 'Hương Tích', 'Kẻ Gỗ'],
  palette = 'sky',
  showHome = true,
  className,
  overlayOpacity = 50,
  disableRedirectIfLoggedIn = false,
}: AuthContainerProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!disableRedirectIfLoggedIn && user) router.push('/');
  }, [user, router, disableRedirectIfLoggedIn]);

  const accentText = palette === 'emerald' ? 'text-emerald-600' : 'text-sky-600';
  const badgeBg = palette === 'emerald' ? 'bg-emerald-500/90' : 'bg-sky-500/90';

  return (
    <div
      className={cn(
        'min-h-screen relative flex items-center justify-center p-4',
        // nền sáng/tối theo theme
        'bg-[linear-gradient(180deg,#eaf5ff_0%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0b0f1a_100%)]'
      )}
    >
      {/* Home (mobile) */}
      {showHome && (
        <div className="absolute left-4 top-4 z-20 md:hidden">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 dark:bg-white/10 backdrop-blur">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      <Card
        className={cn(
          'w-full max-w-5xl overflow-hidden rounded-3xl border-0 shadow-xl dark:bg-background',
          className
        )}
        role="main"
        aria-label="Authentication"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Scenic panel */}
          <aside className="relative h-56 md:h-[620px]" aria-label="Scenic preview of Hà Tĩnh">
            <Image
              src={heroImageSrc}
              alt={heroAlt}
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlay gradient + opacity control */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r',
                palette === 'emerald'
                  ? 'from-emerald-900/70 via-emerald-700/50 to-emerald-600/40'
                  : 'from-sky-900/70 via-sky-700/50 to-sky-600/40'
              )}
              style={{ opacity: Math.min(Math.max(overlayOpacity, 0), 100) / 100 }}
            />

            {/* Brand + chips */}
            <div className="absolute left-6 right-6 bottom-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              <div className="inline-flex items-center gap-2">
                <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full text-white', badgeBg)}>
                  <Plane className="h-4 w-4" />
                </span>
                <span className="text-lg font-semibold">{brand}</span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Khám phá Hà Tĩnh</h2>
              <p className="text-sm opacity-90 max-w-md">
                Biển – Rừng – Di tích: lưu hành trình, săn ưu đãi, trải nghiệm bản địa.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {places.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT: Form area */}
          <section className="relative bg-white p-6 md:p-10 dark:bg-background" aria-label="Authentication form">
            {showHome && (
              <div className="absolute left-6 top-6 hidden md:block">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full text-white', badgeBg)}>
                    <Home className="h-4 w-4" />
                  </span>
                  <span className="font-medium">Trang chủ</span>
                </Link>
              </div>
            )}

            {/* Deco icon nhỏ góc phải */}
            <Plane className={cn('absolute right-6 top-6 h-5 w-5', accentText)} aria-hidden="true" />

            {/* Content slot (tiêu đề/subtitle nên đặt bên trong children để reuse cho login/register) */}
            <div className="mx-auto mt-2 md:mt-12 w-full max-w-sm">{children}</div>
          </section>
        </div>
      </Card>
    </div>
  );
}
