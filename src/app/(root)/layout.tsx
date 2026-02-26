import ChatWidget from '@/components/chat/ChatWidget';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { IWards } from '@/interfaces/IAddress';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wards: IWards[] = await fetch(
    `https://hatinh-travel-server.vercel.app/api/address/wards?province_code=42`,
    { cache: 'no-store' } 
  ).then((res) => res.json());

  return (
    // 1. flex flex-col min-h-screen: Đảm bảo container cao ít nhất bằng màn hình
    <div className='flex flex-col min-h-screen'>
      
      <Header wards={wards} />
      
      {/* 2. flex-1: Đẩy footer xuống đáy nếu nội dung ngắn */}
      {/* w-full: Đảm bảo nội dung không bị co lại */}
      <main className='flex-1 w-full container pt-20'>
        {children}
        <ChatWidget />
      </main>

      <Footer />
    </div>
  );
}