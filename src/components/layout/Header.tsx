'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { IDistricts } from '@/interfaces/IAddress';
import { AuthDropdown } from '@/components/auth/AuthDropdown';
import { useAuthState } from '@/components/auth/checkauth';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenuHeader } from '@/components/menu/menu-navgaition-header';
import MenuMobileHeader from '@/components/menu/menu-mobile-header';
import { Search } from 'lucide-react';
import HeaderUserSkeleton from '../auth/Skeleton';

type MenuItem = {
  title: string;
  url?: string;
  isSubMenu: boolean;
  children?: { title: string; url: string }[];
};

export default function Header({ districts }: { districts: IDistricts[] }) {
  const router = useRouter();
  const { user, loading } = useAuthState(); // ✅ có loading để render skeleton
  const [q, setQ] = useState('');

  const menuData = useMemo<MenuItem[]>(
    () => [
      { title: 'Trang chủ', url: '/', isSubMenu: false },
      {
        title: 'Địa điểm du lịch',
        isSubMenu: true,
        children: districts.map((d) => ({
          title: d.name,
          url: `/dia-diem/${d.codename}`,
        })),
      },
      {
        title: 'Đặc sản địa phương',
        isSubMenu: true,
        children: districts.map((d) => ({
          title: d.name,
          url: `/dac-san/${d.codename}`,
        })),
      },
      { title: 'Khám phá chợ', url: '/kham-pha-cho', isSubMenu: false },
    ],
    [districts]
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qq = q.trim();
    if (!qq) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(qq)}`);
    setQ('');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white shadow supports-[backdrop-filter]:bg-slate-50 dark:border-white/10 dark:bg-neutral-900/70">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4">
        {/* Left: logo + mobile menu + desktop nav */}
        <div className="flex items-center gap-3">
          <MenuMobileHeader districts={districts} />

          <Link href="/" aria-label="Trang chủ" className="inline-flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              priority
              className="size-10 rounded-md object-cover"
            />
          </Link>

          <nav className="hidden lg:block" aria-label="Điều hướng chính">
            <NavigationMenuHeader menu={menuData} />
          </nav>
        </div>

        {/* Center: search (desktop) */}
        <form
          role="search"
          onSubmit={onSearch}
          className="hidden w-full max-w-xl items-center gap-2 md:flex"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm địa điểm, đặc sản, chợ…"
              className="pl-9"
              aria-label="Tìm kiếm"
            />
          </div>
          <Button type="submit" aria-label="Thực hiện tìm kiếm">
            Tìm
          </Button>
        </form>

        {/* Right: auth + search mini (mobile) */}
        <div className="flex items-center gap-2">
          <form role="search" onSubmit={onSearch} className="md:hidden">
            <div className="relative">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm…"
                className="w-[150px] pl-8"
                aria-label="Tìm kiếm nhanh"
              />
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            </div>
          </form>

          {/* ✅ Skeleton avatar trong lúc loading; hạn chế layout shift với min-w cho nút login */}
          {loading ? (
            <HeaderUserSkeleton size="md" withRing />
          ) : user ? (
            <AuthDropdown auth={user} />
          ) : (
            <Button asChild variant="outline" className="min-w-[96px] justify-center">
              <Link href="/tai-khoan/dang-nhap">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
