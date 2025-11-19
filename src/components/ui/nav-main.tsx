"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

// Định nghĩa lại kiểu cho các mục menu
// Lưu ý: Nếu menuSidebarAdmin được định nghĩa với 'as const', 
// bạn nên dùng các kiểu này để đảm bảo NavMain chấp nhận dữ liệu đó.
interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  // Giữ string cho page để linh hoạt, hoặc dùng 'admin' | 'shop'
  page: 'admin' | 'shop' | string 
  items?: readonly {
    title: string
    url: string
  }[]
}

// Cập nhật NavMainProps để chấp nhận 'readonly' array
interface NavMainProps {
  // 🔑 Sửa lỗi: Chỉ định rõ rằng items là một mảng chỉ đọc
  items: readonly MenuItem[] 
  currentPage: 'admin' | 'shop' | string
}

export function NavMain({
  items,
  currentPage,
}: NavMainProps) {
  const pathName = usePathname()

  // Lọc menu dựa trên currentPage
  const filteredItems = items.filter(item => item.page === currentPage)

  // Kiểm tra URL có active không
  const isActive = (path: string) => path === pathName

  // Kiểm tra xem submenu nào có active không
  const isSubItemActive = (subItems?: readonly { title: string; url: string }[]) =>
    subItems?.some((sub) => isActive(sub.url))

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map((item) => { 
          const hasSubmenu = !!item.items?.length
          const submenuActive = isSubItemActive(item.items)

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={submenuActive} 
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {hasSubmenu && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {hasSubmenu && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Dữ liệu item.items đã là readonly do as const lan truyền */}
                      {item.items && item.items.map((subItem) => {
                        const subActive = isActive(subItem.url)
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`
                                hover:bg-blue-500/60 p-4 h-10 
                                ${subActive ? "bg-blue-500/60 text-white" : "hover:text-white"}
                              `}
                            >
                              <a href={subItem.url} >
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}