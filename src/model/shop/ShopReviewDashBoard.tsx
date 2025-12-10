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
  AlertCircle
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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

export default function SellerReview() {
  const params = useParams();
  const shopId = params.id as string;

  // --- STATE ---
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, replied
  
  // State trả lời nhanh
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH DATA ---
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Gọi API lấy review của Shop này
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review?targetId=${shopId}&targetType=Shop&limit=100`, {
        cache: 'no-store'
      });
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
    if (!replyContent.trim()) return toast.warn('Vui lòng nhập nội dung phản hồi');
    
    setIsSubmitting(true);
    try {
      // Gọi Server Action (đã check role Seller ở backend)
      await HandleUpdateReview({ reply: replyContent }, reviewId);
      
      toast.success('Đã gửi phản hồi thành công');
      setReplyingId(null);
      setReplyContent('');
      fetchReviews(); // Refresh lại list
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FILTER LOGIC ---
  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.reply;
    if (filter === 'replied') return !!r.reply;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="h-6 w-6 text-purple-600" />
            Đánh giá từ khách hàng
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Xem và phản hồi ý kiến của khách hàng để nâng cao uy tín cửa hàng.
          </p>
        </div>
        
        {/* Filter Dropdown */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Lọc đánh giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đánh giá</SelectItem>
            <SelectItem value="pending">Chưa trả lời ⚠️</SelectItem>
            <SelectItem value="replied">Đã trả lời ✅</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        {loading ? (
           [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
        ) : filteredReviews.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Chưa có đánh giá nào phù hợp.</p>
           </div>
        ) : (
           filteredReviews.map((review) => (
            <Card key={review._id} className={`border-0 shadow-sm transition-all duration-300 ${!review.reply ? 'ring-2 ring-orange-100 bg-orange-50/30' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar Khách */}
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={review.userId?.avatar} />
                    <AvatarFallback>{review.userId?.name?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    {/* Header: Tên khách + Sao + Thời gian */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">{review.userId?.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                           <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                              ))}
                           </div>
                           <span>•</span>
                           <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      {review.reply ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                           <CheckCircle2 className="h-3 w-3" /> Đã phản hồi
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 flex items-center gap-1">
                           <AlertCircle className="h-3 w-3" /> Chờ trả lời
                        </Badge>
                      )}
                    </div>

                    {/* Nội dung Review */}
                    <p className="text-slate-700 text-sm leading-relaxed bg-white/50 p-3 rounded-lg border border-transparent hover:border-slate-100">
                      {review.content}
                    </p>

                    {/* KHU VỰC PHẢN HỒI */}
                    <div className="pt-2">
                      {/* Case 1: Đã có phản hồi -> Hiển thị */}
                      {review.reply ? (
                        <div className="ml-4 pl-4 border-l-2 border-purple-200 bg-purple-50/50 p-3 rounded-r-lg">
                           <div className="flex items-center gap-2 mb-1">
                              <CornerDownRight className="h-4 w-4 text-purple-500" />
                              <span className="text-xs font-bold text-purple-700">Phản hồi từ Cửa hàng</span>
                           </div>
                           <p className="text-sm text-slate-600">{review.reply.content}</p>
                        </div>
                      ) : (
                        /* Case 2: Chưa phản hồi -> Hiển thị nút/form */
                        <div className="ml-4 mt-3">
                           {replyingId === review._id ? (
                              <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                 <label className="text-xs font-bold text-purple-600 uppercase">Trả lời khách hàng</label>
                                 <Textarea 
                                    placeholder="Cảm ơn bạn đã ủng hộ shop..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="min-h-[80px] focus:border-purple-500"
                                    autoFocus
                                 />
                                 <div className="flex justify-end gap-2">
                                    <Button 
                                       size="sm" variant="ghost" 
                                       onClick={() => { setReplyingId(null); setReplyContent(''); }}
                                    >Hủy</Button>
                                    <Button 
                                       size="sm" 
                                       className="bg-purple-600 hover:bg-purple-700"
                                       onClick={() => handleReplySubmit(review._id)}
                                       disabled={isSubmitting}
                                    >
                                       {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                                    </Button>
                                 </div>
                              </div>
                           ) : (
                              <Button 
                                 size="sm" 
                                 variant="outline"
                                 className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                 onClick={() => setReplyingId(review._id)}
                              >
                                 <MessageCircle className="h-4 w-4 mr-2" /> Trả lời đánh giá này
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