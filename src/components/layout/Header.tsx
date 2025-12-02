'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search, Globe, Check, Loader2 } from 'lucide-react';

import { IDistricts } from '@/interfaces/IAddress';
import { AuthDropdown } from '@/components/auth/AuthDropdown';
import { useAuthState } from '@/components/auth/checkauth';
import HeaderUserSkeleton from '../auth/Skeleton';
import 'flag-icons/css/flag-icons.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenuHeader } from '@/components/menu/menu-navgaition-header';
import MenuMobileHeader from '@/components/menu/menu-mobile-header';

// Import Hook
import { useLanguage } from '@/components/layout/LanguageProvider';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MenuItem = {
  title: string;
  url?: string;
  isSubMenu: boolean;
  children?: { title: string; url: string }[];
};

export default function Header({ districts }: { districts: IDistricts[] }) {
  const router = useRouter();
  const { user, loading } = useAuthState();
  const [q, setQ] = useState('');

  // Lấy các hàm từ Provider
  const { lang, setLang, isLoading } = useLanguage();

  const menuData = useMemo<MenuItem[]>(
    () => [
      { title: 'Trang chủ', url: '/', isSubMenu: false },
      {
        title: 'Điểm đến',
        isSubMenu: true,
        children: districts.map((d) => ({
          title: d.name,
          url: `/dia-diem/${d.codename}`,
        })),
      },
      {
        title: 'Đặc sản',
        isSubMenu: true,
        children: districts.map((d) => ({
          title: d.name,
          url: `/dac-san/${d.codename}`,
        })),
      },
      {
        title: 'Nghệ thuật',
        isSubMenu: true,
        children: districts.map((d) => ({
          title: d.name,
          url: `/nghe-thuat/${d.codename}`,
        })),
      },
      { title: 'Chợ', url: '/kham-pha-cho', isSubMenu: false },
    ],
    [districts]
  );
  const placeholders = {
    vi: 'Tìm kiếm địa điểm, đặc sản...',
    en: 'Search places, specialties...',
    'zh': '搜索地点、特产...',
  };
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qq = q.trim();
    if (!qq) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(qq)}`);
    setQ('');
  };

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white shadow supports-[backdrop-filter]:bg-slate-50/90 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/70'>
      <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4'>
        {/* Left: logo + nav */}
        <div className='flex items-center gap-3'>
          <MenuMobileHeader districts={districts} />
          <Link
            href='/'
            aria-label='Trang chủ'
            className='inline-flex items-center gap-2'
          >
            <Image
              src='/logo.png'
              alt='logo'
              width={40}
              height={40}
              priority
              className='size-10 rounded-md object-cover'
            />
          </Link>
          <nav className='hidden lg:block' aria-label='Điều hướng chính'>
            <NavigationMenuHeader menu={menuData} />
          </nav>
        </div>

        {/* Center: search */}
        <form
          role='search'
          onSubmit={onSearch}
          className='hidden w-full max-w-xl items-center gap-2 md:flex'
        >
          <div className='relative flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60' />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholders[lang]}
              className='pl-9 bg-slate-50 focus:bg-white'
            />
          </div>
        </form>

        {/* Right: Language + Auth */}
        <div className='flex items-center gap-2 sm:gap-3'>
          {/* Language Switcher */}
          <div className='flex items-center'>
            {isLoading && (
              <Loader2 className='w-4 h-4 mr-2 animate-spin text-blue-600 hidden sm:block' />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-slate-600 hover:bg-slate-100 rounded-full'
                >
                  <Globe className='h-5 w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setLang('vi')}>
                  <span className='fi fi-vn'></span>
                  {lang === 'vi' && <Check className='ml-auto h-4 w-4' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('en')}>
                  <span className='fi fi-us'></span>
                  {lang === 'en' && <Check className='ml-auto h-4 w-4' />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('zh')}>
                  <span className='fi fi-cn'></span>
                  {lang === 'zh' && <Check className='ml-auto h-4 w-4' />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Search */}
          <form onSubmit={onSearch} className='md:hidden'>
            <div className='relative'>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Tìm...'
                className='w-[100px] pl-8 h-9 text-xs'
              />
              <Search className='absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60' />
            </div>
          </form>

          {/* Auth */}
          {loading ? (
            <HeaderUserSkeleton size='md' withRing />
          ) : user ? (
            <AuthDropdown auth={user} />
          ) : (
            <Button
              asChild
              variant='default'
              size='sm'
              className='hidden sm:inline-flex min-w-[96px] bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Link href='/tai-khoan/dang-nhap'>Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
