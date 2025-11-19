'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from './team-switcher';
import { NavMain } from './nav-main';

import { NavUser } from './nav-user';
import { menuSidebarAdmin } from '@/util/constant';
// --- DỮ LIỆU TĨNH ---
const STATIC_USER = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
};
const BASE_TEAM_DATA = [
    {
        name: 'Placeholder', // Tên này sẽ bị ghi đè
        logo: '/logo.png',
    },
];

// --- ĐỊNH NGHĨA PROPS ---
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    currentPage: 'admin' | 'shop' | string; // Xác định page hiện tại
}

export function AppSidebar({ currentPage, ...props }: AppSidebarProps) {
    
    // 1. Logic TÍNH TOÁN DỮ LIỆU TEAM DỰA TRÊN currentPage
    const currentTeamName = 
        currentPage === 'admin' 
            ? 'Trang Quản Trị Hệ Thống' 
            : 'Trang Quản Lý Cửa Hàng';

    // Tạo mảng teams mới với tên đã tính toán
    const currentTeams = BASE_TEAM_DATA.map(team => ({
        ...team,
        name: currentTeamName,
    }));
    
    // 2. Logic TÍNH TOÁN DỮ LIỆU NAV MAIN (sử dụng hằng số đã import)
    const navMainItems = menuSidebarAdmin;

    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                {/* Truyền mảng teams đã được tính toán */}
                <TeamSwitcher teams={currentTeams} /> 
            </SidebarHeader>
            <SidebarContent>
                {/* Truyền currentPage xuống NavMain để NavMain tự động lọc menu */}
                <NavMain items={navMainItems} currentPage={currentPage} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={STATIC_USER} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}