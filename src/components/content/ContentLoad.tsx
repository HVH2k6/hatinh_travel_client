'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpandableDescriptionProps {
  content: string;
  maxHeight?: number; // px
  className?: string;
}

export default function ExpandableDescription({
  content,
  maxHeight = 300,
  className = '',
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShouldShowButton(contentHeight > maxHeight);
    }
  }, [content, maxHeight]);

  return (
    <div className="relative">
      {/* Content Container */}
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${className}`}
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
        }}
      >
        <article
          className="prose prose-lg max-w-none dark:prose-invert 
                     prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4
                     prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                     prose-li:text-gray-700 prose-li:mb-2
                     prose-strong:text-gray-900 prose-strong:font-semibold
                     prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                     prose-img:rounded-xl prose-img:shadow-lg
                     prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{
            __html: content || '',
          }}
        />
      </div>

      {/* Gradient Overlay when collapsed */}
      {!isExpanded && shouldShowButton && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      )}

      {/* Expand/Collapse Button */}
      {shouldShowButton && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="group relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 bg-white hover:bg-purple-50 text-purple-700 font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                  Thu gọn nội dung
                  <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                  Xem thêm nội dung
                  <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                </>
              )}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}