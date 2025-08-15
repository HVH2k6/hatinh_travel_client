'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <Link href={`/`}>
      <SidebarMenuItem className='focus:bg-transparent focus:border-0'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              // className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image
                src={activeTeam.logo || '/logo.png'}
                alt={activeTeam.name}
                width={48}
                height={48}
                className='size-12 object-cover'
              />

              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{activeTeam.name}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
      </Link>
    </SidebarMenu>
  );
}
