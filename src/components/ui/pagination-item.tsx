'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Giả sử bạn đã có Button component

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export default function Pagination({ totalPages, className = '' }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy trang hiện tại từ URL, mặc định là 1
  const currentPage = Number(searchParams.get('page')) || 1;

  // Nếu chỉ có 1 trang hoặc không có trang nào -> Ẩn phân trang
  if (totalPages <= 1) return null;

  // Hàm tạo URL cho trang mới (Giữ nguyên các query params khác như ?q=...)
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  // Logic hiển thị số trang thông minh (VD: 1 2 ... 5 6 7 ... 10)
  // Để đơn giản, ở đây mình render tất cả hoặc giới hạn đơn giản. 
  // Bạn có thể tùy biến logic "..." nếu số trang quá lớn.
  const renderPageNumbers = () => {
    const pages = [];
    // Hiển thị tối đa 5 nút trang xung quanh trang hiện tại để gọn
    const maxVisible = 5; 
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="icon"
          className={`w-10 h-10 ${currentPage === i ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className={`flex justify-center items-center gap-2 mt-8 ${className}`}>
      {/* Nút Previous */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="w-10 h-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Danh sách số trang */}
      {renderPageNumbers()}

      {/* Nút Next */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="w-10 h-10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}