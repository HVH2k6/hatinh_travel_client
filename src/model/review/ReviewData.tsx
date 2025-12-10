'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Eye,
  Trash2,
  Search,
  MoreHorizontal,
  Star,
  MessageCircle,
} from 'lucide-react';

// UI Components (Giả sử bạn dùng Shadcn UI)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Import Modal của bạn
// Lưu ý: Đảm bảo đường dẫn import đúng với nơi bạn lưu file modal
import ReviewDetailModal from '@/model/review/ReviewAdmin';

// Server Action Xóa nhanh (Optional)
import { HandleDeleteReview } from '@/action/HandleReview';

export default function ReviewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // State cho Modal
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy filter từ URL
  const page = Number(searchParams.get('page')) || 1;
  const targetType = searchParams.get('type') || 'all';
  const rating = searchParams.get('rating') || 'all';

  // --- FETCH DATA ---
  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = `page=${page}&limit=10`;
      if (targetType !== 'all') query += `&targetType=${targetType}`;
      if (rating !== 'all') query += `&rating=${rating}`;

      // Gọi API getAll mà bạn vừa sửa
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review?${query}`,
        {
          cache: 'no-store',
        }
      );
      const data = await res.json();

      if (data.success) {
        setReviews(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, targetType, rating]);

  // --- HANDLERS ---
  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    params.set('page', '1'); // Reset về trang 1
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const onOpenDetail = (review: any) => {
    // Thêm dòng này để xóa dữ liệu cũ trước khi set cái mới (đề phòng)
    setSelectedReview(null);

    // Set timeout cực ngắn để React kịp render lại cycle mới
    setTimeout(() => {
      setSelectedReview(review);
      setIsModalOpen(true);
    }, 0);
  };
  // Callback khi Modal đóng hoặc xử lý xong (để refresh lại list)
  const onModalSuccess = () => {
    setIsModalOpen(false);
    fetchReviews(); // Load lại dữ liệu mới nhất
  };

  // Xóa nhanh từ bảng
  const onDeleteQuick = async (id: string) => {
    if (!confirm('Xóa đánh giá này?')) return;
    try {
      await HandleDeleteReview(id);
      toast.success('Đã xóa');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='p-6 space-y-6 bg-slate-50 min-h-screen'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-slate-900'>
          Quản lý Đánh giá & Phản hồi
        </h1>
      </div>

      {/* --- BỘ LỌC (FILTERS) --- */}
      <Card>
        <CardContent className='p-4 flex flex-col md:flex-row gap-4 items-end'>
          <div className='flex-1 w-full'>
            <label className='text-xs font-bold text-slate-500 mb-1 block'>
              Tìm kiếm
            </label>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-400' />
              <Input
                placeholder='Tìm theo tên người dùng...'
                className='pl-9'
              />
            </div>
          </div>

          <div className='w-full md:w-[200px]'>
            <label className='text-xs font-bold text-slate-500 mb-1 block'>
              Loại đối tượng
            </label>
            <Select
              value={targetType}
              onValueChange={(v) => handleFilter('type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='Product'>Sản phẩm</SelectItem>
                <SelectItem value='Shop'>Cửa hàng</SelectItem>
                <SelectItem value='Attraction'>Địa điểm du lịch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='w-full md:w-[150px]'>
            <label className='text-xs font-bold text-slate-500 mb-1 block'>
              Đánh giá
            </label>
            <Select
              value={rating}
              onValueChange={(v) => handleFilter('rating', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='5'>5 Sao</SelectItem>
                <SelectItem value='4'>4 Sao</SelectItem>
                <SelectItem value='3'>3 Sao</SelectItem>
                <SelectItem value='2'>2 Sao</SelectItem>
                <SelectItem value='1'>1 Sao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- BẢNG DỮ LIỆU --- */}
      <Card className='overflow-hidden border-0 shadow-sm'>
        <Table>
          <TableHeader className='bg-slate-100'>
            <TableRow>
              <TableHead>Người đánh giá</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className='h-12 w-full' />
                  </TableCell>
                </TableRow>
              ))
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((item) => (
                <TableRow key={item._id} className='hover:bg-slate-50/50'>
                  {/* Cột User */}
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9 border'>
                        <AvatarImage src={item.userId?.avatar} />
                        <AvatarFallback>
                          {item.userId?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium text-sm'>
                          {item.userId?.name}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {item.userId?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột Đối tượng (Sản phẩm/Shop...) */}
                  <TableCell>
                    <div className='flex flex-col'>
                      <Badge
                        variant='outline'
                        className='w-fit mb-1 text-[10px] uppercase bg-white'
                      >
                        {item.targetType}
                      </Badge>
                      <span
                        className='text-sm font-medium truncate max-w-[150px]'
                        title={item.targetId?.name}
                      >
                        {item.targetId?.name || '---'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cột Nội dung Review */}
                  <TableCell>
                    <div className='max-w-[300px]'>
                      <div className='flex items-center gap-1 mb-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < item.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <p className='truncate text-sm text-slate-600'>
                        {item.content}
                      </p>
                      {item.reply && (
                        <div className='flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium'>
                          <MessageCircle className='h-3 w-3' /> Đã trả lời
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Cột Ngày */}
                  <TableCell>
                    <span className='text-sm text-slate-500'>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </TableCell>

                  {/* Cột Hành động */}
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn hành vi mặc định nếu cần
                            onOpenDetail(item);
                          }}
                        >
                          <Eye className='mr-2 h-4 w-4' /> Xem chi tiết & Trả
                          lời
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteQuick(item._id)}
                          className='text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Xóa đánh giá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Phân trang */}
        <div className='p-4 border-t flex justify-between items-center bg-slate-50'>
          <span className='text-xs text-slate-500'>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Trước
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={page === pagination.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>

      {selectedReview && (
        <ReviewDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedReview(null), 300); // Reset dữ liệu về null (delay nhẹ để animation đóng chạy xong cho mượt)
          }}
          review={selectedReview}
          onSuccess={onModalSuccess}
        />
      )}
    </div>
  );
}
