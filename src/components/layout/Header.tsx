'use client';

import Link from 'next/link';
import { NavigationMenuDemo } from '../menu/menu-navgaition';
import { IDistricts } from '@/interfaces/IAddress';
import { AuthDropdown } from '../auth/AuthDropdown';
import { useCheckAuth } from '../auth/checkauth';
import { Button } from '../ui/button';

interface HeaderProps {
  districts: IDistricts[];
}

const Header = ({ districts }: HeaderProps) => {
  const user = useCheckAuth();
  const menuData = [
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
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-300 flex items-center'>
      <div className='container flex justify-between'>
        <Link
          href='/'
          className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-3xl font-bold'
        >
          HaTinhTravel
        </Link>
        <NavigationMenuDemo menu={menuData} />
        {user ? (
          <AuthDropdown auth={user}/>
        ) : (
          <Button variant='outline'>
            <Link href='/auth/login'>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
