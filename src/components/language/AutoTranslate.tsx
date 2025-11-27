'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface AutoTranslateProps {
  children: string | React.ReactNode;
  /** Nếu true, sẽ dịch ngay cả khi children là React Node */
  translateNode?: boolean;
}

/**
 * Component tự động dịch nội dung text
 * Sử dụng: <AutoTranslate>Văn bản cần dịch</AutoTranslate>
 */
export function AutoTranslate({ children, translateNode = false }: AutoTranslateProps) {
  const { lang, translateDynamic } = useLanguage();
  const [translated, setTranslated] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translate = async () => {
      // Nếu không phải string, không dịch (trừ khi bật translateNode)
      if (typeof children !== 'string' && !translateNode) {
        return;
      }

      const text = typeof children === 'string' ? children : '';
      
      if (!text || lang === 'vi') {
        setTranslated(text);
        return;
      }

      setIsTranslating(true);
      try {
        const result = await translateDynamic(text);
        setTranslated(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslated(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [children, lang, translateDynamic, translateNode]);

  // Hiển thị skeleton khi đang dịch (tùy chọn)
  if (isTranslating && lang !== 'vi') {
    return <span className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded">{children}</span>;
  }

  // Nếu là React Node và không dịch, trả về nguyên bản
  if (typeof children !== 'string' && !translateNode) {
    return <>{children}</>;
  }

  return <>{translated || children}</>;
}

/**
 * Hook để dịch text trong component
 */
export function useTranslate() {
  const { lang, translateDynamic } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const translate = async (text: string, key?: string) => {
    if (lang === 'vi') return text;
    
    const cacheKey = key || text;
    if (translations[cacheKey]) return translations[cacheKey];

    const result = await translateDynamic(text);
    setTranslations(prev => ({ ...prev, [cacheKey]: result }));
    return result;
  };

  return { translate, lang };
}

/**
 * Component dịch giá tiền tự động
 */
interface AutoCurrencyProps {
  amount: number;
  className?: string;
}

export function AutoCurrency({ amount, className }: AutoCurrencyProps) {
  const { formatCurrency } = useLanguage();
  
  return <span className={className}>{formatCurrency(amount)}</span>;
}