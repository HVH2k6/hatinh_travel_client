'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Thêm separator cho đẹp
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import ButtonLogout from './ButonLogout';
import { IUser } from '@/interfaces/IUser';
import { User, ShoppingBag, Store, Settings, LogOut } from 'lucide-react'; // Thêm icon

export function AuthDropdown({ auth }: { auth: IUser }) {
  const initials = (auth?.username || auth?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label='User menu'
          className='rounded-full outline-none transition-all hover:ring-2 hover:ring-blue-100 focus:ring-2 focus:ring-blue-500/40'
        >
          <Avatar className='h-9 w-9 border border-slate-200 sm:h-10 sm:w-10'>
            <AvatarImage
              src={auth?.avatar || ''}
              alt={auth?.username || 'User'}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' sideOffset={8} className='w-64 p-2'>
        {/* Header thông tin user */}
        <div className="flex items-center justify-start gap-2 p-2 mb-1">
            <div className="flex flex-col space-y-1 leading-none">
              {auth.username && <p className="font-medium text-sm text-slate-900">{auth.username}</p>}
              <p className="w-[200px] truncate text-xs text-slate-500">{auth.email}</p>
            </div>
        </div>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-slate-50">
          <Link href='/dang-ky-ban-hang/xem-yeu-cau-da-gui' className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-slate-500" />
            <span>Yêu cầu đã gửi</span>
          </Link>
        </DropdownMenuItem>

        {auth.roleId.name !== "User" && (
          <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-slate-50">
            <Link href='/quan-ly-cua-hang/' className="flex items-center gap-2">
              <Store className="h-4 w-4 text-slate-500" />
              <span>Quản lý cửa hàng</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-slate-50">
          <Link href='/dang-ky-ban-hang' className="flex items-center gap-2">
            <Store className="h-4 w-4 text-slate-500" />
            <span>Đăng ký bán hàng</span>
          </Link>
        </DropdownMenuItem>

        {auth?.roleId?.name === 'Admin' && (
          <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-slate-50">
            <Link href='/quan-ly/tong-quan' className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              <span>Quản lý hệ thống</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />

        <DropdownMenuItem className='flex items-center justify-center p-0 pt-1 focus:bg-transparent'>
          <div className="w-full">
            <ButtonLogout />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}