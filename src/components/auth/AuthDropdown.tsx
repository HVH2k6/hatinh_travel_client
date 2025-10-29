'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import ButtonLogout from './ButonLogout';
import { IUser } from '@/interfaces/IUser';

export function AuthDropdown({ auth }: { auth: IUser }) {
  const initials =
    (auth?.username || auth?.email || 'U')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className="rounded-full outline-none focus:ring-2 focus:ring-primary/40 ring-offset-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={auth?.avatar || ''} alt={auth?.username || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6} className="w-48">
         {auth?.roleId?.name === 'User' && (
          <DropdownMenuItem asChild>
            <Link href="/dang-ky-ban-hang">Đăng ký bán hàng</Link>
          </DropdownMenuItem>
        )}
        {auth?.roleId?.name === 'Admin' && (
          <DropdownMenuItem asChild>
            <Link href="/quan-ly/tong-quan">Quản lý</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex items-center">
          <ButtonLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
