'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

interface TranslationCache {
  [key: string]: string;
}

/**
 * Component tự động dịch toàn DOM với tối ưu hiệu suất
 * Giống Google Translate
 */
export function AdvancedAutoTranslator() {
  const { lang, translateDynamic } = useLanguage();
  const originalTextsRef = useRef<Map<Node, string>>(new Map());
  const translationCacheRef = useRef<TranslationCache>({});
  const isTranslatingRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const pendingNodesRef = useRef<Set<Node>>(new Set());
  const translationQueueRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (translationQueueRef.current) {
        clearTimeout(translationQueueRef.current);
      }
    };
  }, []);

  // Xử lý khi đổi ngôn ngữ
  useEffect(() => {
    if (lang === 'vi') {
      restoreOriginalTexts();
      return;
    }

    translatePage();
    setupMutationObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lang]);

  /**
   * Khôi phục văn bản gốc
   */
  const restoreOriginalTexts = useCallback(() => {
    originalTextsRef.current.forEach((originalText, node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent !== originalText) {
        node.textContent = originalText;
      }
    });
  }, []);

  /**
   * Kiểm tra node có nên dịch không
   */
  const shouldTranslateNode = useCallback((node: Node): boolean => {
    if (node.nodeType !== Node.TEXT_NODE) return false;
    
    const text = node.textContent?.trim();
    if (!text || text.length < 2) return false;

    const parent = node.parentElement;
    if (!parent) return false;

    // Danh sách tags không dịch
    const skipTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'SVG'];
    if (skipTags.includes(parent.tagName)) return false;

    // Bỏ qua elements với attribute đặc biệt
    if (parent.closest('[data-no-translate], [translate="no"]')) return false;

    // Bỏ qua input, textarea, contenteditable
    if (parent.tagName === 'INPUT' || 
        parent.tagName === 'TEXTAREA' ||
        parent.isContentEditable) return false;

    // Bỏ qua nếu chỉ chứa số, ký tự đặc biệt, hoặc URLs
    if (/^[\d\s\W]+$/.test(text) || /^https?:\/\//.test(text)) return false;

    return true;
  }, []);

  /**
   * Lấy cache key cho text
   */
  const getCacheKey = useCallback((text: string): string => {
    return `${lang}:${text}`;
  }, [lang]);

  /**
   * Dịch một text node
   */
  const translateNode = useCallback(async (node: Node) => {
    const originalText = node.textContent?.trim();
    if (!originalText) return;

    // Lưu văn bản gốc
    if (!originalTextsRef.current.has(node)) {
      originalTextsRef.current.set(node, originalText);
    }

    // Kiểm tra cache
    const cacheKey = getCacheKey(originalText);
    if (translationCacheRef.current[cacheKey]) {
      node.textContent = translationCacheRef.current[cacheKey];
      return;
    }

    try {
      const translated = await translateDynamic(originalText);
      
      // Lưu vào cache
      translationCacheRef.current[cacheKey] = translated;
      
      // Cập nhật DOM
      if (node.textContent !== null) {
        node.textContent = translated;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  }, [lang, translateDynamic, getCacheKey]);

  /**
   * Xử lý hàng đợi dịch (debounced)
   */
  const processTranslationQueue = useCallback(async () => {
    if (isTranslatingRef.current || pendingNodesRef.current.size === 0) return;
    
    isTranslatingRef.current = true;
    const nodes = Array.from(pendingNodesRef.current);
    pendingNodesRef.current.clear();

    // Dịch theo batch
    const batchSize = 5;
    for (let i = 0; i < nodes.length; i += batchSize) {
      const batch = nodes.slice(i, i + batchSize);
      await Promise.all(batch.map(node => translateNode(node)));
      
      // Delay nhỏ giữa các batch
      if (i + batchSize < nodes.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    isTranslatingRef.current = false;
  }, [translateNode]);

  /**
   * Thêm node vào hàng đợi dịch
   */
  const queueNodeForTranslation = useCallback((node: Node) => {
    pendingNodesRef.current.add(node);

    // Debounce: chờ 100ms trước khi xử lý
    if (translationQueueRef.current) {
      clearTimeout(translationQueueRef.current);
    }

    translationQueueRef.current = setTimeout(() => {
      processTranslationQueue();
    }, 100);
  }, [processTranslationQueue]);

  /**
   * Dịch toàn bộ page
   */
  const translatePage = useCallback(async () => {
    if (isTranslatingRef.current) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => shouldTranslateNode(node) 
          ? NodeFilter.FILTER_ACCEPT 
          : NodeFilter.FILTER_REJECT
      }
    );

    const textNodes: Node[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    // Thêm tất cả vào queue
    textNodes.forEach(node => queueNodeForTranslation(node));
  }, [shouldTranslateNode, queueNodeForTranslation]);

  /**
   * Setup MutationObserver để dịch nội dung mới
   */
  const setupMutationObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations) => {
      if (lang === 'vi') return;

      mutations.forEach((mutation) => {
        // Nodes mới được thêm
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (n) => shouldTranslateNode(n) 
                  ? NodeFilter.FILTER_ACCEPT 
                  : NodeFilter.FILTER_REJECT
              }
            );
            
            let textNode;
            while (textNode = walker.nextNode()) {
              queueNodeForTranslation(textNode);
            }
          } else if (shouldTranslateNode(node)) {
            queueNodeForTranslation(node);
          }
        });

        // Text thay đổi
        if (mutation.type === 'characterData' && shouldTranslateNode(mutation.target)) {
          queueNodeForTranslation(mutation.target);
        }
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }, [lang, shouldTranslateNode, queueNodeForTranslation]);

  return null;
}