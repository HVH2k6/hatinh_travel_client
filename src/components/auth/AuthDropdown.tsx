import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/interfaces/IUser';
import ButtonLogout from './ButonLogout';
import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';
interface AuthProps {
  auth: IUser;
}

export function AuthDropdown({ auth }: AuthProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Avatar className='w-10 h-10'>
          <AvatarImage src={auth.avatar} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        {auth.roleId.name === 'Admin' && (
          <DropdownMenuItem>
            <Link href='/admin'>Admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <ButtonLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
