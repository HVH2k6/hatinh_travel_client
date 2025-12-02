'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import AuthProvider from '@/components/auth/AuthWrapper';


import TranslatorProvider from './LanguageProvider';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <TranslatorProvider>
        
        <AuthProvider>{children}</AuthProvider>
      </TranslatorProvider>
    </Provider>
  );
}
