import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
        <AppSidebar currentPage="shop" />
        <main className="">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    )
}