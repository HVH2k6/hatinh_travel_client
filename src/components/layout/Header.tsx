'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { IDistricts } from '@/interfaces/IAddress';
import { AuthDropdown } from '../auth/AuthDropdown';
import { useCheckAuth } from '../auth/checkauth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { NavigationMenuHeader } from '../menu/menu-navgaition-header';
import MenuMobileHeader from '../menu/menu-mobile-header';
import { Search } from 'lucide-react';

export default function Header({ districts }: { districts: IDistricts[] }) {
  const router = useRouter();
  const user = useCheckAuth();
  const [q, setQ] = useState('');

  const menuData = [
    { title: 'Trang chủ', url: '/', isSubMenu: false },
    {
      title: 'Địa điểm du lịch',
      isSubMenu: true,
      children: districts.map((d) => ({ title: d.name, url: `/dia-diem/${d.codename}` })),
    },
    {
      title: 'Đặc sản địa phương',
      isSubMenu: true,
      children: districts.map((d) => ({ title: d.name, url: `/dac-san/${d.codename}` })),
    },
    { title: 'Khám phá chợ', url: '/kham-pha-cho', isSubMenu: false },
  ];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qq = q.trim();
    if (!qq) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(qq)}`);
    setQ('');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-neutral-900/70">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4">
        {/* Left: logo + mobile menu + desktop nav */}
        <div className="flex items-center gap-3">
          <MenuMobileHeader districts={districts} />

          <Link href="/" aria-label="Trang chủ" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={40} height={40} className="size-10 rounded-md object-cover" />
          
          </Link>

          <div className="hidden lg:block">
            <NavigationMenuHeader menu={menuData as any} />
          </div>
        </div>

        {/* Center: search (desktop) */}
        <form onSubmit={onSearch} className="hidden w-full max-w-xl items-center gap-2 md:flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm địa điểm, đặc sản, chợ…"
              className="pl-9"
              aria-label="Tìm kiếm"
            />
          </div>
          <Button type="submit">Tìm</Button>
        </form>

        {/* Right: auth + search mini (mobile) */}
        <div className="flex items-center gap-2">
          <form onSubmit={onSearch} className="md:hidden">
            <div className="relative">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm…"
                className="w-[150px] pl-8"
                aria-label="Tìm kiếm"
              />
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            </div>
          </form>

          {user ? (
            <AuthDropdown auth={user} />
          ) : (
            <Button asChild variant="outline">
              <Link href="/tai-khoan/dang-nhap">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
