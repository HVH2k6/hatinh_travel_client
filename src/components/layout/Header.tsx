'use client';

import Link from 'next/link';

import { IDistricts } from '@/interfaces/IAddress';
import { AuthDropdown } from '../auth/AuthDropdown';
import { useCheckAuth } from '../auth/checkauth';
import { Button } from '../ui/button';
import { NavigationMenuHeader } from '../menu/menu-navgaition-header';
import Image from 'next/image';

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
      <div className='container flex justify-between items-center'>
        <Link
          href='/'
          
        >
          <Image src='/logo.png' alt='logo' width={48} height={48} className='object-cover size-12'/>
        </Link>
        <NavigationMenuHeader menu={menuData} />
        {user ? (
          <AuthDropdown auth={user}/>
        ) : (
          <Button variant='outline'>
            <Link href='/tai-khoan/dang-nhap'>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
