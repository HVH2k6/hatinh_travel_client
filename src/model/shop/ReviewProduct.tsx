'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Star,
  MessageCircle,
  Store,
  CornerDownRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Server Action
import { HandleUpdateReview } from '@/action/HandleReview';

export default function ProductReview() {
  const params = useParams();
  const shopId = params.id as string;

  // --- STATE ---
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Reply State
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH DATA ---
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review?targetId=${shopId}&targetType=Product&limit=100`,
        {
          cache: 'no-store',
        }
      );
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchReviews();
  }, [shopId]);

  // --- HANDLE REPLY ---
  const handleReplySubmit = async (reviewId: string) => {
    if (!replyContent.trim())
      return toast.warn('Vui lòng nhập nội dung phản hồi');

    setIsSubmitting(true);
    try {
      await HandleUpdateReview({ reply: replyContent }, reviewId);

      toast.success('Đã gửi phản hồi thành công');
      setReplyingId(null);
      setReplyContent('');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FILTER LOGIC ---
  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.reply;
    if (filter === 'replied') return !!r.reply;
    return true;
  });

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-8 min-h-screen bg-slate-50'>
      {/* HEADER SECTION */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 flex items-center gap-2'>
            <Store className='h-6 w-6 text-purple-600' />
            Đánh giá Cửa hàng
          </h1>
          <p className='text-slate-500 text-sm mt-1'>
            Quản lý phản hồi khách hàng để nâng cao chất lượng dịch vụ.
          </p>
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className='w-[180px] bg-slate-50 border-slate-200'>
            <SelectValue placeholder='Lọc trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả đánh giá</SelectItem>
            <SelectItem value='pending'>Chưa trả lời ⚠️</SelectItem>
            <SelectItem value='replied'>Đã trả lời ✅</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* REVIEWS LIST */}
      <div className='space-y-4'>
        {loading ? (
          // Loading Skeleton
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white p-6 rounded-xl border border-slate-100 space-y-3'
            >
              <div className='flex gap-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-16 w-full' />
                </div>
              </div>
            </div>
          ))
        ) : filteredReviews.length === 0 ? (
          // Empty State
          <div className='text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200'>
            <MessageCircle className='h-12 w-12 text-slate-300 mx-auto mb-3' />
            <p className='text-slate-500 font-medium'>
              Chưa có đánh giá nào phù hợp.
            </p>
          </div>
        ) : (
          // List Reviews
          filteredReviews.map((review) => (
            <Card
              key={review._id}
              className={`border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md ${
                !review.reply
                  ? 'border-l-4 border-l-orange-400 bg-orange-50/10'
                  : 'bg-white'
              }`}
            >
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  {/* Avatar */}
                  <Avatar className='h-11 w-11 border border-slate-100'>
                    <AvatarImage src={review.userId?.avatar} />
                    <AvatarFallback className='bg-slate-100 text-slate-500 font-bold'>
                      {review.userId?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className='flex-1 space-y-3'>
                    {/* Header: Name + Rating + Status */}
                    <div className='flex justify-between items-start'>
                      <div>
                        <h4 className='font-bold text-slate-900 text-base'>
                          {review.userId?.name}
                        </h4>
                        <div className='flex items-center gap-2 text-xs text-slate-500 mt-1'>
                          <div className='flex text-yellow-400'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={
                                  i < review.rating ? 'currentColor' : 'none'
                                }
                              />
                            ))}
                          </div>
                          <span className='text-slate-300'>•</span>
                          <span>
                            {new Date(review.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                        </div>
                      </div>

                      {review.reply ? (
                        <Badge
                          variant='outline'
                          className='bg-green-50 text-green-700 border-green-200 gap-1 px-3 py-1'
                        >
                          <CheckCircle2 className='h-3 w-3' /> Đã trả lời
                        </Badge>
                      ) : (
                        <Badge
                          variant='secondary'
                          className='bg-orange-100 text-orange-700 gap-1 px-3 py-1 hover:bg-orange-200'
                        >
                          <AlertCircle className='h-3 w-3' /> Cần trả lời
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <p className='text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100'>
                      {review.content}
                    </p>

                    {/* Reply Area */}
                    <div className='pt-1'>
                      {review.reply ? (
                        // Case 1: Đã trả lời
                        <div className='ml-4 pl-4 border-l-2 border-purple-200'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md'>
                              Phản hồi của Shop
                            </span>
                            <span className='text-[10px] text-slate-400'>
                              {new Date(
                                review.reply.createdAt
                              ).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className='text-sm text-slate-600 italic'>
                            {review.reply.content}
                          </p>
                        </div>
                      ) : (
                        // Case 2: Chưa trả lời -> Form Reply Inline
                        <div className='mt-2'>
                          {replyingId === review._id ? (
                            <div className='bg-white p-4 rounded-xl border border-purple-100 shadow-sm animate-in fade-in zoom-in-95 duration-200'>
                              <div className='flex items-center justify-between mb-2'>
                                <label className='text-xs font-bold text-purple-600 uppercase'>
                                  Trả lời đánh giá này
                                </label>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-6 w-6'
                                  onClick={() => setReplyingId(null)}
                                >
                                  ×
                                </Button>
                              </div>
                              <Textarea
                                placeholder='Nhập câu trả lời của bạn...'
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                                className='min-h-[100px] focus:border-purple-500 mb-3 bg-slate-50/50'
                                autoFocus
                              />
                              <div className='flex justify-end gap-2'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => {
                                    setReplyingId(null);
                                    setReplyContent('');
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  size='sm'
                                  className='bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200'
                                  onClick={() => handleReplySubmit(review._id)}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? 'Đang gửi...'
                                    : 'Gửi phản hồi'}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                              onClick={() => setReplyingId(review._id)}
                            >
                              <MessageCircle className='h-4 w-4 mr-2' /> Trả lời
                              ngay
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
