import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
      <NextTopLoader color="#3b82f6" showSpinner={false} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
