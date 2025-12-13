"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Lang = "vi" | "en" | "zh";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a TranslatorProvider");
  return context;
};

// --- Helpers ---

function isTranslatable(node: Node) {
  if (node.nodeType !== Node.TEXT_NODE) return false;
  const content = node.nodeValue?.trim();
  if (!content || content.length < 2 || !isNaN(Number(content))) return false;

  const parent = node.parentElement;
  if (!parent) return false;
  
  const tag = parent.tagName.toLowerCase();
  if (["script", "style", "noscript", "code", "pre", "textarea", "input", "select"].includes(tag)) return false;
  
  // 💥 Kiểm tra data-no-translate để loại trừ các giá trị tiền tệ
  if (parent.closest("[data-no-translate]")) return false; 
  
  return true;
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h >>> 0);
}

function formatCurrency(amount: number, lang: Lang): string {
  const currencyConfig = {
    vi: { rate: 1, currency: "VND", locale: "vi-VN", symbol: "₫" },
    en: { rate: 0.000040, currency: "USD", locale: "en-US", symbol: "$" },
    zh: { rate: 0.00029, currency: "CNY", locale: "zh-CN", symbol: "¥" }
  };

  const config = currencyConfig[lang];
  const converted = amount * config.rate;

  // Sử dụng NumberFormat chuẩn để định dạng
  const formatted = new Intl.NumberFormat(config.locale, {
    // 💥 CHỈNH SỬA: Dùng style: 'decimal' và thêm symbol để PriceDisplay có thể tách biệt
    style: 'decimal', 
    minimumFractionDigits: 0,
    maximumFractionDigits: lang === 'vi' ? 0 : 2
  }).format(converted);

  return `${config.symbol}${formatted}`;
}

export default function TranslatorProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");
  const [isLoading, setIsLoading] = useState(false);

  const originalTextMap = useRef<WeakMap<Node, string>>(new WeakMap());
  const translationCache = useRef<Map<string, string>>(new Map());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const isTranslating = useRef(false);

  // Load ngôn ngữ từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Lang;
    if (saved && ["vi", "en", "zh"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const formatCurrencyFn = (amount: number) => {
    return formatCurrency(amount, lang);
  };

  const setLang = (newLang: Lang) => {
    if (newLang === lang) return;
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    
    if (newLang === "vi") {
      revertToOriginal();
      setIsLoading(false);
    } else {
      triggerTranslation(newLang);
    }
  };

  const revertToOriginal = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node: Node | null;
    // Bỏ qua việc revert các node bị đánh dấu không dịch
    while ((node = walker.nextNode())) {
      if (originalTextMap.current.has(node) && node.parentElement?.closest('[data-no-translate]') === null) {
        node.nodeValue = originalTextMap.current.get(node)!;
      }
    }
  };

  const triggerTranslation = async (targetLang: Lang) => {
    if (targetLang === "vi" || isTranslating.current) return;
    
    isTranslating.current = true;
    setIsLoading(true);

    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      const nodesToTranslate: Text[] = [];
      const textsToTranslate: string[] = [];

      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (isTranslatable(node)) {
          if (!originalTextMap.current.has(node)) {
            originalTextMap.current.set(node, node.nodeValue!);
          }

          const originalText = originalTextMap.current.get(node)!;
          const cacheKey = hashString(originalText + targetLang);

          if (translationCache.current.has(cacheKey)) {
            const translated = translationCache.current.get(cacheKey)!;
            if (node.nodeValue !== translated) {
              node.nodeValue = translated;
            }
          } else {
            nodesToTranslate.push(node as Text);
            textsToTranslate.push(originalText);
          }
        }
      }

      if (textsToTranslate.length > 0) {
        const batchSize = 30;
        
        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
          const batchTexts = textsToTranslate.slice(i, i + batchSize);
          const batchNodes = nodesToTranslate.slice(i, i + batchSize);

          try {
            // ... (Phần fetch API dịch đã đúng và không cần sửa) ...
            const response = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                text: batchTexts, 
                targetLang 
              })
            });
            
            if (!response.ok) {
              console.warn(`Translation batch ${i} failed:`, response.status);
              continue;
            }

            const data = await response.json();
            const translatedArray = Array.isArray(data.text) ? data.text : [data.text];

            batchNodes.forEach((n, index) => {
              const result = translatedArray[index] || batchTexts[index];
              const original = batchTexts[index];
              
              const key = hashString(original + targetLang);
              translationCache.current.set(key, result);
              
              if (n.nodeValue !== result) {
                n.nodeValue = result;
              }
            });

            if (i + batchSize < textsToTranslate.length) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } catch (batchError) {
            console.error(`Batch ${i} translation error:`, batchError);
          }
        }
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      isTranslating.current = false;
      setIsLoading(false);
    }
  };

  // Mutation Observer
  useEffect(() => {
    if (lang === "vi") {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const observer = new MutationObserver(() => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      debounceTimer.current = setTimeout(() => {
        if (!isTranslating.current) {
          triggerTranslation(lang);
        }
      }, 800);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    observerRef.current = observer;
    triggerTranslation(lang);

    return () => {
      observer.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLoading, formatCurrency: formatCurrencyFn }}>
      <div lang={lang} className={isLoading ? "translating" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}