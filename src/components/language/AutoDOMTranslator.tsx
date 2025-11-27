'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

/**
 * Component tự động dịch toàn bộ text trong DOM
 * Giống Google Translate - không cần wrap component
 */
export function AutoDOMTranslator() {
  const { lang, translateDynamic } = useLanguage();
  const originalTextsRef = useRef<Map<Node, string>>(new Map());
  const isTranslatingRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (lang === 'vi') {
      // Khôi phục văn bản gốc khi chuyển về tiếng Việt
      restoreOriginalTexts();
      return;
    }

    // Dịch toàn bộ page
    translatePage();

    // Theo dõi các thay đổi DOM và tự động dịch nội dung mới
    setupMutationObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lang]);

  /**
   * Khôi phục văn bản gốc tiếng Việt
   */
  const restoreOriginalTexts = () => {
    originalTextsRef.current.forEach((originalText, node) => {
      if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
        node.textContent = originalText;
      }
    });
  };

  /**
   * Kiểm tra xem node có nên được dịch không
   */
  const shouldTranslateNode = (node: Node): boolean => {
    if (node.nodeType !== Node.TEXT_NODE) return false;
    
    const text = node.textContent?.trim();
    if (!text || text.length < 2) return false;

    const parent = node.parentElement;
    if (!parent) return false;

    // Bỏ qua các element không nên dịch
    const skipTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT'];
    if (skipTags.includes(parent.tagName)) return false;

    // Bỏ qua các element có thuộc tính data-no-translate
    if (parent.closest('[data-no-translate]')) return false;

    // Bỏ qua các input, textarea
    if (parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA') return false;

    // Bỏ qua nếu chỉ chứa số, ký tự đặc biệt
    if (/^[\d\s\W]+$/.test(text)) return false;

    return true;
  };

  /**
   * Dịch toàn bộ text nodes trong page
   */
  const translatePage = async () => {
    if (isTranslatingRef.current) return;
    isTranslatingRef.current = true;

    try {
      // Tìm tất cả text nodes
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return shouldTranslateNode(node) 
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const textNodes: Node[] = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      // Lưu văn bản gốc nếu chưa lưu
      textNodes.forEach(node => {
        if (!originalTextsRef.current.has(node) && node.textContent) {
          originalTextsRef.current.set(node, node.textContent);
        }
      });

      // Nhóm các texts để dịch theo batch (tối ưu API calls)
      const batchSize = 10;
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (node) => {
            const originalText = originalTextsRef.current.get(node) || node.textContent || '';
            if (originalText) {
              try {
                const translated = await translateDynamic(originalText);
                if (node.textContent !== null) {
                  node.textContent = translated;
                }
              } catch (error) {
                console.error('Translation error:', error);
              }
            }
          })
        );

        // Delay nhỏ giữa các batch để tránh overload
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      isTranslatingRef.current = false;
    }
  };

  /**
   * Theo dõi các thay đổi DOM và tự động dịch
   */
  const setupMutationObserver = () => {
    observerRef.current = new MutationObserver(async (mutations) => {
      if (lang === 'vi' || isTranslatingRef.current) return;

      const nodesToTranslate: Node[] = [];

      mutations.forEach((mutation) => {
        // Xử lý các nodes mới được thêm vào
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Tìm tất cả text nodes trong element mới
            const walker = document.createTreeWalker(
              element,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (n) => shouldTranslateNode(n) 
                  ? NodeFilter.FILTER_ACCEPT 
                  : NodeFilter.FILTER_REJECT
              }
            );
            
            let textNode;
            while (textNode = walker.nextNode()) {
              nodesToTranslate.push(textNode);
            }
          } else if (shouldTranslateNode(node)) {
            nodesToTranslate.push(node);
          }
        });

        // Xử lý thay đổi nội dung text
        if (mutation.type === 'characterData' && shouldTranslateNode(mutation.target)) {
          nodesToTranslate.push(mutation.target);
        }
      });

      // Dịch các nodes mới
      if (nodesToTranslate.length > 0) {
        isTranslatingRef.current = true;
        
        for (const node of nodesToTranslate) {
          const text = node.textContent?.trim();
          if (text) {
            // Lưu văn bản gốc
            if (!originalTextsRef.current.has(node)) {
              originalTextsRef.current.set(node, text);
            }

            try {
              const translated = await translateDynamic(text);
              if (node.textContent !== null) {
                node.textContent = translated;
              }
            } catch (error) {
              console.error('Translation error:', error);
            }
          }
        }

        isTranslatingRef.current = false;
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  // Component này không render gì cả
  return null;
}