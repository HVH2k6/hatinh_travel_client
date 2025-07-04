import { AppSidebar } from "../ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    )
}