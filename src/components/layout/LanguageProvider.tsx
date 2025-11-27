"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Định nghĩa kiểu ngôn ngữ
type Lang = "vi" | "en" | "zh";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook để sử dụng ở Header
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a TranslatorProvider");
  return context;
};

// --- Helpers ---

// Kiểm tra node có nên dịch không
function isTranslatable(node: Node) {
  if (node.nodeType !== Node.TEXT_NODE) return false;
  const content = node.nodeValue?.trim();
  if (!content || content.length < 2 || !isNaN(Number(content))) return false; // Bỏ qua số, rỗng

  const parent = node.parentElement;
  if (!parent) return false;
  
  // Bỏ qua các thẻ kỹ thuật hoặc đã đánh dấu không dịch
  const tag = parent.tagName.toLowerCase();
  if (["script", "style", "noscript", "code", "pre", "textarea", "input"].includes(tag)) return false;
  if (parent.closest("[data-no-translate]")) return false;
  
  return true;
}

// Hàm băm để làm key cache
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h >>> 0);
}

// --- Provider Component ---

export default function TranslatorProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");
  const [isLoading, setIsLoading] = useState(false);

  // Bộ nhớ đệm text gốc: Map<DOMNode, OriginalString>
  // Dùng WeakMap để tự giải phóng bộ nhớ khi Node bị React xóa
  const originalTextMap = useRef<WeakMap<Node, string>>(new WeakMap());
  
  // Cache bản dịch: Map<Hash+Lang, TranslatedString>
  const translationCache = useRef<Map<string, string>>(new Map());

  // Debounce timer để tránh dịch liên tục khi React đang render
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Observer theo dõi thay đổi DOM
  const observerRef = useRef<MutationObserver | null>(null);

  // Load ngôn ngữ từ localStorage khi mới vào
  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Lang;
    if (saved && ["vi", "en", "zh"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  // Hàm thay đổi ngôn ngữ (gọi từ Header)
  const setLang = (newLang: Lang) => {
    if (newLang === lang) return;
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    
    // Nếu về tiếng Việt, khôi phục ngay lập tức
    if (newLang === "vi") {
      revertToOriginal();
    } else {
      // Nếu sang ngôn ngữ khác, kích hoạt dịch toàn trang
      triggerTranslation(newLang);
    }
  };

  // Hàm khôi phục tiếng Việt
  const revertToOriginal = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (originalTextMap.current.has(node)) {
        node.nodeValue = originalTextMap.current.get(node)!;
      }
    }
  };

  // Hàm quét và dịch DOM
  const triggerTranslation = async (targetLang: Lang) => {
    if (targetLang === "vi") return;
    
    setIsLoading(true);

    // 1. Quét tất cả Text Node
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodesToTranslate: Text[] = [];
    const textsToTranslate: string[] = [];

    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (isTranslatable(node)) {
        // Lưu text gốc nếu chưa có
        if (!originalTextMap.current.has(node)) {
          originalTextMap.current.set(node, node.nodeValue!);
        }

        const originalText = originalTextMap.current.get(node)!;
        const cacheKey = hashString(originalText + targetLang);

        // Nếu đã có cache -> dịch luôn
        if (translationCache.current.has(cacheKey)) {
          const translated = translationCache.current.get(cacheKey)!;
          if (node.nodeValue !== translated) {
             node.nodeValue = translated;
          }
        } else {
          // Chưa có cache -> Đưa vào hàng đợi API
          nodesToTranslate.push(node as Text);
          textsToTranslate.push(originalText);
        }
      }
    }

    // 2. Gọi API nếu có text mới (Gom nhóm - Batching)
    if (textsToTranslate.length > 0) {
      try {
        // Chia nhỏ mảng nếu quá dài (ví dụ mỗi lần 50 câu)
        const batchSize = 50;
        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
          const batchTexts = textsToTranslate.slice(i, i + batchSize);
          const batchNodes = nodesToTranslate.slice(i, i + batchSize);

          // Gọi API Proxy (Google Translate)
          const response = await fetch('/api/translate', {
             method: 'POST',
             body: JSON.stringify({ 
                text: batchTexts, // Gửi cả mảng string
                targetLang 
             })
          });
          
          const data = await response.json();
          // Giả sử API trả về { text: ["Dịch 1", "Dịch 2"] }
          // Lưu ý: Bạn cần sửa lại /api/translate để xử lý mảng (Array) thay vì string đơn
          
          const translatedArray = Array.isArray(data.text) ? data.text : [data.text];

          // Áp dụng vào DOM
          batchNodes.forEach((n, index) => {
             const result = translatedArray[index] || batchTexts[index];
             const original = batchTexts[index];
             
             // Lưu cache
             const key = hashString(original + targetLang);
             translationCache.current.set(key, result);
             
             // Gán text
             n.nodeValue = result;
          });
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    }
    
    setIsLoading(false);
  };

  // --- Mutation Observer (Tự động dịch khi React render nội dung mới) ---
  useEffect(() => {
    if (lang === "vi") return;

    const observer = new MutationObserver((mutations) => {
      // Debounce: Chờ 500ms sau khi DOM dừng thay đổi mới bắt đầu dịch
      // Để tránh React render liên tục gây giật lag
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      debounceTimer.current = setTimeout(() => {
        triggerTranslation(lang);
      }, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true // Quan trọng: theo dõi thay đổi text
    });
    
    observerRef.current = observer;

    // Chạy lần đầu
    triggerTranslation(lang);

    return () => {
      observer.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLoading }}>
      {/* Thêm class để CSS biết đang ở ngôn ngữ nào (nếu cần font khác) */}
      <div lang={lang} className={isLoading ? "translating" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}