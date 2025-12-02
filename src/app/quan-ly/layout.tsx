import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar currentPage='admin' />
      {/* Thêm w-full để main chiếm hết chiều rộng còn lại cạnh sidebar */}
      <main className='w-full'>
        {/* Trigger nằm riêng ở trên cùng, mặc định nó sẽ ở bên trái (text-left) */}
        <div className='p-4'>
          <SidebarTrigger />
        </div>

        {/* Container chứa children:
            - mx-auto: Căn giữa
            - w-full: Chiếm hết chiều ngang cho phép
            - max-w-7xl: Giới hạn chiều rộng tối đa (để mx-auto có tác dụng khi màn hình to)
            - px-4: Padding 2 bên để không dính sát mép trên màn hình nhỏ
        */}
        <div className='mx-auto w-full max-w-7xl px-4 md:px-8'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}