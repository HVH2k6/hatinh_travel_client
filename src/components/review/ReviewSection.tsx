'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { Star, MoreVertical, Trash2, Edit2, MessageSquare, CornerDownRight } from 'lucide-react';
import Link from 'next/link';

// Import Custom Auth Hook của bạn
import { useAuthState } from '@/components/auth/checkauth'; 

// UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Server Actions
import {
  HandleCreateReview,
  HandleUpdateReview,
  HandleDeleteReview,
} from '@/action/HandleReview';

// --- Validation Schema ---
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(5, 'Nội dung đánh giá quá ngắn (tối thiểu 5 ký tự)'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  targetId: string;
  targetType: 'Attraction' | 'Product' | 'Shop';
}

export default function ReviewSection({ targetId, targetType }: ReviewSectionProps) {
  // 1. Sử dụng Hook Auth của bạn
  const { user, loading: authLoading } = useAuthState();

  // 2. Local State
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [isPending, startTransition] = useTransition();

  // State form tạo mới
  const [rating, setRating] = useState(5);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, content: '' }
  });

  // State chỉnh sửa
  const [editingReview, setEditingReview] = useState<any>(null);

  // --- API: Fetch Reviews ---
  const fetchReviews = async (pageNum = 1) => {
    try {
      setIsFetching(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review?targetId=${targetId}&targetType=${targetType}&page=${pageNum}&limit=5`
      );
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  // --- Action: Create ---
  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return toast.error('Vui lòng đăng nhập để đánh giá');
    
    startTransition(async () => {
      try {
        await HandleCreateReview({
          ...data,
          rating,
          targetId,
          targetType,
        });
        toast.success('Đánh giá thành công!');
        reset();
        setRating(5);
        fetchReviews(1); // Refresh lại list
      } catch (error: any) {
        toast.error(error.message || 'Lỗi khi gửi đánh giá');
      }
    });
  };

  // --- Action: Delete ---
  const onDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;
    
    startTransition(async () => {
      try {
        await HandleDeleteReview(id);
        toast.success('Đã xóa đánh giá');
        fetchReviews(page);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  // --- Action: Update ---
  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const form = e.target as HTMLFormElement;
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
    const ratingVal = Number((form.elements.namedItem('rating') as HTMLInputElement).value);

    startTransition(async () => {
      try {
        await HandleUpdateReview({ content, rating: ratingVal }, editingReview._id);
        toast.success('Cập nhật thành công');
        setEditingReview(null);
        fetchReviews(page);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  // --- Render Skeleton khi đang load auth ---
  if (authLoading) return <div className="py-10 text-center"><Skeleton className="h-40 w-full rounded-3xl" /></div>;

  return (
    <Card className="rounded-3xl shadow-xl border-0 bg-white mt-10 scroll-mt-20" id="reviews">
      {/* Header Thống kê */}
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-3xl pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-orange-600" />
            Đánh giá & Bình luận
          </div>
      
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-8 space-y-8">
        
        {/* === 1. FORM VIẾT ĐÁNH GIÁ === */}
        {user ? (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.avatar || ''} />
                <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Viết đánh giá với tên</p>
                <p className="text-orange-600 font-bold text-sm">{user.username}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Mức độ hài lòng</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="group focus:outline-none transition-transform active:scale-95"
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover:text-yellow-200'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm border">
                  {rating === 5 ? 'Tuyệt vời 😍' : rating === 4 ? 'Rất tốt 😄' : rating === 3 ? 'Bình thường 🙂' : rating === 2 ? 'Tệ 😞' : 'Rất tệ 😡'}
                </span>
              </div>
            </div>

            <div className="relative">
                <Textarea
                {...register('content')}
                placeholder="Chia sẻ trải nghiệm chân thực của bạn về địa điểm này... (Không gian, dịch vụ, giá cả, v.v.)"
                className="bg-white border-gray-200 focus:border-orange-500 min-h-[120px] resize-none rounded-xl text-base p-4 shadow-sm"
                />
                {errors.content && (
                    <p className="text-red-500 text-xs mt-2 font-medium flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        {errors.content.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all"
              >
                {isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-600 mb-4 font-medium">Bạn đã đến đây? Hãy chia sẻ trải nghiệm của mình nhé!</p>
            <Link href="/tai-khoan/dang-nhap">
                <Button className="rounded-full px-8 bg-gray-900 text-white hover:bg-black">
                    Đăng nhập để viết đánh giá
                </Button>
            </Link>
          </div>
        )}

        <Separator className="bg-gray-100" />

        {/* === 2. DANH SÁCH ĐÁNH GIÁ === */}
        <div className="space-y-6">
          {isFetching ? (
             <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                ))}
             </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-8 w-8 text-orange-300" />
                </div>
                <p className="text-gray-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Avatar className="h-11 w-11 mt-1 border border-gray-100 shadow-sm">
                  <AvatarImage src={review.userId?.avatar} />
                  <AvatarFallback className="bg-gray-100 text-gray-500 font-bold">
                    {review.userId?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{review.userId?.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* MENU: Chỉ hiện nếu user hiện tại là chủ bài viết (So sánh _id) */}
                    {user?._id === review.userId?._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100">
                          <DropdownMenuItem onClick={() => setEditingReview(review)} className="cursor-pointer">
                            <Edit2 className="h-3 w-3 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(review._id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                            <Trash2 className="h-3 w-3 mr-2" /> Xóa bỏ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="mt-2 text-gray-700 leading-relaxed text-sm sm:text-base bg-gray-50/50 p-3 rounded-xl rounded-tl-none border border-transparent hover:border-gray-100 transition-colors">
                    {review.content}
                  </div>

                  {/* Reply từ hệ thống (Admin) */}
                  {review.reply && (
                    <div className="ml-4 mt-3 pl-4 border-l-2 border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                             <CornerDownRight className="h-4 w-4 text-orange-400" />
                             <span className="text-xs font-bold text-gray-800 bg-orange-100 px-2 py-0.5 rounded text-orange-700">
                                {targetType === 'Attraction' ? 'Ban quản lý' : 'Người bán'} phản hồi
                             </span>
                        </div>
                        <p className="text-sm text-gray-600 italic">{review.reply.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- 3. PHÂN TRANG --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 pt-6">
             <Button 
               variant="outline" 
               size="sm" 
               disabled={page === 1}
               onClick={() => fetchReviews(page - 1)}
               className="rounded-full px-6 hover:bg-gray-50 border-gray-200"
             >
               Trước
             </Button>
             <span className="flex items-center text-sm font-semibold bg-gray-100 px-4 rounded-full text-gray-600">
                {page} / {totalPages}
             </span>
             <Button 
               variant="outline" 
               size="sm" 
               disabled={page === totalPages}
               onClick={() => fetchReviews(page + 1)}
               className="rounded-full px-6 hover:bg-gray-50 border-gray-200"
             >
               Tiếp theo
             </Button>
          </div>
        )}
      </CardContent>

      {/* --- MODAL EDIT --- */}
      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <form onSubmit={onUpdate} className="space-y-5 py-2">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Đánh giá sao</label>
                <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                        <div key={s} className="relative">
                            <input 
                                type="radio" 
                                name="rating" 
                                value={s} 
                                defaultChecked={editingReview.rating === s}
                                className="peer absolute inset-0 opacity-0 cursor-pointer" 
                            />
                            <Star className={`w-8 h-8 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 text-gray-300 pointer-events-none`} />
                        </div>
                    ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Nội dung</label>
                <Textarea 
                  name="content" 
                  defaultValue={editingReview.content} 
                  className="min-h-[120px] resize-none rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingReview(null)} className="rounded-xl">Hủy bỏ</Button>
                <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl">Lưu thay đổi</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}