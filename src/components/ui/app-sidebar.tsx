import {
  Calendar,
  Database,
  Home,
  Inbox,
  Locate,
  Salad,
  Search,
  Settings,
  ShoppingBasket,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Tổng quan',
    url: '',
    icon: Database,
    isAdmin: true,
  },
  {
    title: 'Địa điểm du lịch',
    url: '/manage/destination',
    icon: Locate,
    isAdmin: true,
  },
  {
    title: 'Đặc sản địa phương',
    url: '/manage/local-specialty',
    icon: Salad,
    isAdmin: true,
  },
  {
    title: 'Sản phẩm địa phương',
    url: '/manage/product',
    icon: ShoppingBasket,
    isAdmin: false,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
