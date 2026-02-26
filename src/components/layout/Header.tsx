'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { Search, Globe, Check, Loader2, User, X } from 'lucide-react';

import { IWards } from '@/interfaces/IAddress';
import { AuthDropdown } from '@/components/auth/AuthDropdown';
import { useAuthState } from '@/components/auth/checkauth';
import HeaderUserSkeleton from '../auth/Skeleton';
import 'flag-icons/css/flag-icons.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavigationMenuHeader } from '@/components/menu/menu-navgaition-header';
import MenuMobileHeader from '@/components/menu/menu-mobile-header';
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

export default function Header({ wards }: { wards: IWards[] }) {
  const router = useRouter();
  const { user, loading } = useAuthState();
  const { lang, setLang, isLoading } = useLanguage();

  const [q, setQ] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [hasPrefetched, setHasPrefetched] = useState(false);

  const menuData = useMemo<MenuItem[]>(
    () => [
      { title: 'Trang chủ', url: '/', isSubMenu: false },
      {
        title: 'Điểm đến',
        isSubMenu: true,
        children: wards.map((w) => ({
          title: w.name,
          url: `/dia-diem-du-lich/dia-phuong/${w.codename}`,
        })),
      },
      {
        title: 'Đặc sản',
        isSubMenu: true,
        children: wards.map((w) => ({
          title: w.name,
          url: `/dac-san/dia-phuong/${w.codename}`,
        })),
      },
      {
        title: 'Nghệ thuật',
        isSubMenu: true,
        children: wards.map((w) => ({
          title: w.name,
          url: `/van-hoa-nghe-thuat/dia-phuong/${w.codename}`,
        })),
      },
      { title: 'Chợ', url: '/kham-pha-cho', isSubMenu: false },

      {
        title: 'Khác',
        isSubMenu: true,
        children: [
          {
            title: 'Blog',
            url: '/blog',
          },
          {
            title: 'Liên hệ',
            url: '/lien-he',
          },
          {
            title: 'Chính sách',
            url: '/chinh-sach',
          },
          {
            title: 'Audio lịch sử',
            url: '/audio-lich-su',
          },
        ],
      },
    ],
    [wards]
  );

  const placeholders = {
    vi: 'Tìm kiếm địa điểm, đặc sản...',
    en: 'Search places, specialties...',
    zh: '搜索地点、特产...',
  };

  // Prefetch search page khi component mount (load trước)
  useEffect(() => {
    router.prefetch('/tim-kiem');
  }, [router]);

  // Handle input change với prefetch thông minh
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQ(value);

    // Prefetch lại nếu user bắt đầu gõ (backup thêm)
    if (!hasPrefetched && value.length > 0) {
      router.prefetch('/tim-kiem');
      setHasPrefetched(true);
    }
  };

  // Handle search submit
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = q.trim();

    // Validate query
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return;
    }

    // Navigate to search page
    router.push(`/tim-kiem?q=${encodeURIComponent(trimmedQuery)}`);

    // Reset states
    setShowMobileSearch(false);
    setQ('');
  };

  // Close mobile search when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMobileSearch) {
        setShowMobileSearch(false);
      }
    };

    if (showMobileSearch) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when search is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showMobileSearch]);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/90'>
      <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4'>
        {/* --- LEFT: Mobile Menu + Logo + Desktop Nav --- */}
        <div className='flex items-center gap-2 lg:gap-4'>
          <MenuMobileHeader wards={wards} />

          <Link
            href='/'
            aria-label='Trang chủ'
            className='inline-flex items-center gap-2 shrink-0'
          >
            <Image
              src='/logo.png'
              alt='logo'
              width={40}
              height={40}
              priority
              className='size-8 rounded-md object-cover sm:size-10'
            />
          </Link>

          <nav className='hidden lg:block' aria-label='Điều hướng chính'>
            <NavigationMenuHeader menu={menuData} />
          </nav>
        </div>

        {/* --- CENTER: Desktop Search Form --- */}
        <form
          role='search'
          onSubmit={onSearch}
          className='hidden w-full max-w-md items-center gap-2 px-4 lg:flex xl:max-w-xl'
        >
          <div className='relative flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50' />
            <Input
              type='search'
              value={q}
              onChange={handleInputChange}
              placeholder={placeholders[lang]}
              className='h-10 w-full rounded-full bg-slate-100 pl-10 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-500/20'
              minLength={2}
              maxLength={100}
            />
            {q && (
              <button
                type='button'
                onClick={() => setQ('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                aria-label='Xóa tìm kiếm'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </form>

        {/* --- RIGHT: Actions --- */}
        <div className='flex items-center gap-1 sm:gap-2'>
          {/* 1. Mobile Search Trigger */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden text-slate-600'
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label={showMobileSearch ? 'Đóng tìm kiếm' : 'Mở tìm kiếm'}
          >
            {showMobileSearch ? (
              <X className='h-5 w-5' />
            ) : (
              <Search className='h-5 w-5' />
            )}
          </Button>

          {/* 2. Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-slate-600 rounded-full hover:bg-slate-100'
                aria-label='Chọn ngôn ngữ'
              >
                {isLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
                ) : (
                  <Globe className='h-5 w-5' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-[160px]'>
              <DropdownMenuItem
                onClick={() => setLang('vi')}
                className='cursor-pointer py-2'
              >
                <span className='fi fi-vn mr-2 rounded-sm'></span>
                Tiếng Việt
                {lang === 'vi' && (
                  <Check className='ml-auto h-4 w-4 text-blue-600' />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLang('en')}
                className='cursor-pointer py-2'
              >
                <span className='fi fi-us mr-2 rounded-sm'></span>
                English
                {lang === 'en' && (
                  <Check className='ml-auto h-4 w-4 text-blue-600' />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLang('zh')}
                className='cursor-pointer py-2'
              >
                <span className='fi fi-cn mr-2 rounded-sm'></span>
                中文
                {lang === 'zh' && (
                  <Check className='ml-auto h-4 w-4 text-blue-600' />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. Auth Section */}
          {loading ? (
            <HeaderUserSkeleton size='md' withRing />
          ) : user ? (
            <AuthDropdown auth={user} />
          ) : (
            <>
              {/* Desktop Login Button */}
              <Button
                asChild
                variant='default'
                size='sm'
                className='hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm shadow-blue-200'
              >
                <Link href='/tai-khoan/dang-nhap'>Đăng nhập</Link>
              </Button>

              {/* Mobile Login Icon */}
              <Button
                asChild
                variant='ghost'
                size='icon'
                className='sm:hidden text-slate-600'
                aria-label='Đăng nhập'
              >
                <Link href='/tai-khoan/dang-nhap'>
                  <User className='h-5 w-5' />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* --- MOBILE SEARCH BAR (Slide down) --- */}
      {showMobileSearch && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden'
            style={{ top: '64px' }} // 64px = h-16
            onClick={() => setShowMobileSearch(false)}
            aria-hidden='true'
          />

          {/* Search Bar */}
          <div className='absolute top-16 left-0 w-full bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-white/10 p-4 shadow-lg animate-in slide-in-from-top-2 lg:hidden'>
            <form onSubmit={onSearch} className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                type='search'
                autoFocus
                value={q}
                onChange={handleInputChange}
                placeholder={placeholders[lang]}
                className='pl-10 pr-10 h-11 w-full bg-slate-50 dark:bg-slate-800 text-base'
                minLength={2}
                maxLength={100}
              />
              {q && (
                <button
                  type='button'
                  onClick={() => setQ('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  aria-label='Xóa'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </form>

            {/* Helper text */}
            {q.length > 0 && q.length < 2 && (
              <p className='text-xs text-slate-500 mt-2 ml-1'>
                Nhập tối thiểu 2 ký tự để tìm kiếm
              </p>
            )}
          </div>
        </>
      )}
    </header>
  );
}
