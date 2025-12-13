'use client';

import { useLanguage } from '@/components/layout/LanguageProvider';
import { cn } from '@/lib/utils'; // Hàm merge class của Shadcn/Tailwind
import React from 'react'; // Bổ sung import React

interface PriceDisplayProps {
  value: number | string; // Chấp nhận cả string đề phòng API trả về string
  unit?: string;         // Đơn vị (ví dụ: "người", "vé", "kg")
  className?: string;    // Class custom cho số tiền
  unitClassName?: string;// Class custom cho đơn vị
  freeText?: string;     // Text hiển thị nếu giá = 0 (Mặc định: "Miễn phí")
}

export default function PriceDisplay({ 
  value, 
  unit, 
  className, 
  unitClassName = "text-sm font-normal text-muted-foreground ml-1",
  freeText = "Miễn phí"
}: PriceDisplayProps) {
  
  const { formatCurrency } = useLanguage();

  // Chuyển đổi an toàn sang số
  const numValue = Number(value);

  // Xử lý trường hợp miễn phí hoặc giá trị không hợp lệ
  if (isNaN(numValue)) return null;
  
  // Nếu giá trị bằng 0, hiển thị freeText. freeText sẽ được dịch bởi MutationObserver.
  if (numValue === 0) return <span className={className}>{freeText}</span>;

  return (
    <span className={cn("font-bold tabular-nums", className)}>
      
      {/* 1. Hiển thị giá đã convert */}
      {/* 💥 GIẢI PHÁP: Sử dụng data-no-translate để loại trừ giá trị tiền tệ khỏi cơ chế dịch DOM */}
      <span data-no-translate={true} className="inline-block">
        {formatCurrency(numValue)}
      </span>

      {/* 2. Hiển thị đơn vị */}
      {/* Đơn vị (unit) KHÔNG có data-no-translate, để nó được dịch sang ngôn ngữ đích */}
      {unit && (
        <span className={cn(unitClassName)}>
          / {unit}
        </span>
      )}
    </span>
  );
}