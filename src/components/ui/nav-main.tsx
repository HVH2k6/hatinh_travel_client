"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathName = usePathname()

  // Kiểm tra URL có active không
  const isActive = (path: string) => path === pathName

  // Kiểm tra xem submenu nào có active không
  const isSubItemActive = (subItems?: { title: string; url: string }[]) =>
    subItems?.some((sub) => isActive(sub.url))

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubmenu = !!item.items?.length
          const parentActive = isActive(item.url)
          const submenuActive = isSubItemActive(item.items)
          const menuItemActive = parentActive || submenuActive

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={submenuActive}
              className="group/collapsible"
            >
              <SidebarMenuItem
              
              >
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
                      {item.items && item.items.map((subItem) => {
                        const subActive = isActive(subItem.url)
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={`hover:bg-blue-500/60 p-4 h-10 ${subActive && "bg-blue-500/60 text-white"}`}
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
