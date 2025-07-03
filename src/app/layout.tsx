import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import ToastProvider from '@/components/toast/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body>
        <NextTopLoader color='#3b82f6' showSpinner={false} />
        <ClientLayout>
          <ToastProvider>{children}</ToastProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
