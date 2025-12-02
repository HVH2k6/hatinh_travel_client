'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Trash2, Send } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { HandleUpdateReview, HandleDeleteReview } from '@/action/HandleReview';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
  onSuccess: () => void;
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
  onSuccess,
}: ReviewDetailModalProps) {
  const [replyContent, setReplyContent] = useState(review.reply?.content || '');
  const [isPending, startTransition] = useTransition();

  // --- ADMIN REPLY ---
  const handleReply = async () => {
    if (!replyContent.trim()) return toast.warn('Vui lòng nhập nội dung trả lời');

    startTransition(async () => {
      try {
        // Gọi Server Action Update (Gửi reply)
        await HandleUpdateReview({ reply: replyContent }, review._id);
        toast.success('Đã gửi phản hồi thành công');
        onSuccess(); // Refresh lại list bên ngoài
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
      }
    });
  };

  // --- ADMIN DELETE ---
  const handleDelete = async () => {
    if (!confirm('Hành động này không thể hoàn tác. Xóa đánh giá?')) return;

    startTransition(async () => {
      try {
        await HandleDeleteReview(review._id);
        toast.success('Đã xóa đánh giá');
        onSuccess();
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>Chi tiết Đánh giá</DialogTitle>
            <Badge variant="secondary" className="uppercase">{review.targetType}</Badge>
          </div>
          <DialogDescription>ID: {review._id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. User Info Section */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={review.userId?.avatar} />
              <AvatarFallback>{review.userId?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
               <h4 className="font-bold text-gray-900">{review.userId?.name}</h4>
               <p className="text-sm text-gray-500">{review.userId?.email}</p>
               <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>Ngày tạo: {new Date(review.createdAt).toLocaleString('vi-VN')}</span>
               </div>
            </div>
            <div className="ml-auto text-right">
               <div className="flex items-center gap-1 justify-end mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
               </div>
               <span className="font-bold text-lg">{review.rating}/5</span>
            </div>
          </div>

          {/* 2. Content Section */}
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-500 uppercase">Nội dung đánh giá</h5>
            <div className="bg-white border p-4 rounded-lg text-gray-800 leading-relaxed shadow-sm">
               {review.content}
            </div>
            
            {/* Images */}
            {review.images?.length > 0 && (
               <div className="grid grid-cols-4 gap-2 mt-2">
                  {review.images.map((img: string, i: number) => (
                     <div key={i} className="relative h-24 rounded-md overflow-hidden border">
                        <Image src={img} alt="review-img" fill className="object-cover" />
                     </div>
                  ))}
               </div>
            )}
          </div>

          <Separator />

          {/* 3. Reply Section */}
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <h5 className="text-sm font-bold text-blue-600 uppercase">Phản hồi từ Quản trị viên</h5>
             </div>
             
             <Textarea 
                placeholder="Nhập câu trả lời của bạn..." 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px] border-blue-100 focus:border-blue-500 bg-blue-50/30"
             />
             <p className="text-xs text-gray-500">
                * Quản trị viên có quyền ghi đè phản hồi của Shop/Seller nếu cần thiết.
             </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isPending}
            className="mr-auto bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Xóa Đánh giá
          </Button>

          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button onClick={handleReply} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
             <Send className="h-4 w-4 mr-2" /> 
             {review.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}