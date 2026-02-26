"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  Star,
  MoreVertical,
  Trash2,
  Edit2,
  MessageSquare,
  CornerDownRight,
} from "lucide-react";
import Link from "next/link";

// 1. Import Hook ngôn ngữ của bạn

import { useAuthState } from "@/components/auth/checkauth";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  HandleCreateReview,
  HandleUpdateReview,
  HandleDeleteReview,
} from "@/action/HandleReview";
import { useLanguage } from "../layout/LanguageProvider";

/* ================= 2. TỪ ĐIỂN ĐA NGÔN NGỮ ================= */
const DICTIONARY = {
  vi: {
    title: "Đánh giá & Bình luận",
    login_required: "Vui lòng đăng nhập để đánh giá",
    write_as: "Viết đánh giá với tên",
    satisfaction_level: "Mức độ hài lòng",
    placeholder:
      "Chia sẻ trải nghiệm chân thực của bạn về địa điểm này... (Không gian, dịch vụ, giá cả, v.v.)",
    submit_btn: "Gửi đánh giá",
    sending: "Đang gửi...",
    login_cta: "Bạn đã đến đây? Hãy chia sẻ trải nghiệm của mình nhé!",
    login_btn: "Đăng nhập để viết đánh giá",
    no_reviews: "Chưa có đánh giá nào. Hãy là người đầu tiên!",
    validation_min: "Nội dung đánh giá quá ngắn (tối thiểu 5 ký tự)",
    success_create: "Đánh giá thành công!",
    success_update: "Cập nhật thành công",
    success_delete: "Đã xóa đánh giá",
    confirm_delete: "Bạn chắc chắn muốn xóa đánh giá này?",
    admin_reply: "Ban quản lý phản hồi",
    seller_reply: "Người bán phản hồi",
    edit: "Chỉnh sửa",
    delete: "Xóa bỏ",
    cancel: "Hủy bỏ",
    save: "Lưu thay đổi",
    prev: "Trước",
    next: "Tiếp theo",
    rating_levels: [
      "Rất tệ 😡",
      "Tệ 😞",
      "Bình thường 🙂",
      "Rất tốt 😄",
      "Tuyệt vời 😍",
    ],
    error_general: "Có lỗi xảy ra",
  },
  en: {
    title: "Reviews & Comments",
    login_required: "Please login to review",
    write_as: "Review as",
    satisfaction_level: "Satisfaction Level",
    placeholder:
      "Share your honest experience about this place... (Space, service, price, etc.)",
    submit_btn: "Submit Review",
    sending: "Sending...",
    login_cta: "Have you been here? Share your experience!",
    login_btn: "Login to write a review",
    no_reviews: "No reviews yet. Be the first one!",
    validation_min: "Review content is too short (min 5 characters)",
    success_create: "Review submitted successfully!",
    success_update: "Updated successfully",
    success_delete: "Review deleted",
    confirm_delete: "Are you sure you want to delete this review?",
    admin_reply: "Admin response",
    seller_reply: "Seller response",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save Changes",
    prev: "Prev",
    next: "Next",
    rating_levels: [
      "Very Bad 😡",
      "Bad 😞",
      "Normal 🙂",
      "Very Good 😄",
      "Excellent 😍",
    ],
    error_general: "An error occurred",
  },
  zh: { // Thêm tiếng Trung nếu cần (theo type Lang của bạn)
    title: "评论",
    login_required: "请登录以发表评论",
    write_as: "以此身份评论",
    satisfaction_level: "满意度",
    placeholder: "分享您的真实体验...",
    submit_btn: "提交评论",
    sending: "发送中...",
    login_cta: "您来过这里吗？分享您的体验吧！",
    login_btn: "登录以发表评论",
    no_reviews: "暂无评论。成为第一个评论的人！",
    validation_min: "评论内容太短（最少5个字）",
    success_create: "评论提交成功！",
    success_update: "更新成功",
    success_delete: "评论已删除",
    confirm_delete: "您确定要删除此评论吗？",
    admin_reply: "管理员回复",
    seller_reply: "卖家回复",
    edit: "编辑",
    delete: "删除",
    cancel: "取消",
    save: "保存更改",
    prev: "上一页",
    next: "下一页",
    rating_levels: ["非常差 😡", "差 😞", "一般 🙂", "很好 😄", "非常好 😍"],
    error_general: "发生错误",
  }
};

interface ReviewSectionProps {
  targetId: string;
  targetType: "Attraction" | "Product" | "Shop";
}

export default function ReviewSection({
  targetId,
  targetType,
}: ReviewSectionProps) {
  // 3. Lấy ngôn ngữ hiện tại từ Context
  const { lang } = useLanguage();
  
  // Chọn bộ từ điển (fallback về 'vi' nếu ko tìm thấy)
  const t = DICTIONARY[lang] || DICTIONARY.vi;

  // --- Validation Schema Động ---
  // Đưa vào trong component để lấy text t.validation_min mỗi khi render
  const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    content: z.string().min(5, t.validation_min),
  });

  type ReviewFormValues = z.infer<typeof reviewSchema>;

  const { user, loading: authLoading } = useAuthState();

  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, content: "" },
  });

  const [editingReview, setEditingReview] = useState<any>(null);

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

  // Helper lấy text rating
  const getRatingLabel = (star: number) => {
    return t.rating_levels[star - 1] || "";
  };

  // --- Action: Create ---
  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return toast.error(t.login_required);

    startTransition(async () => {
      const result = await HandleCreateReview({
        ...data,
        rating,
        targetId,
        targetType,
      });

      if (!result?.success) {
        toast.error(result?.error || t.error_general);
        return;
      }

      toast.success(t.success_create);
      reset();
      setRating(5);
      fetchReviews(1);
    });
  };

  // --- Action: Delete ---
  const onDelete = async (id: string) => {
    if (!confirm(t.confirm_delete)) return;

    startTransition(async () => {
      try {
        await HandleDeleteReview(id);
        toast.success(t.success_delete);
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
    const content = (
      form.elements.namedItem("content") as HTMLTextAreaElement
    ).value;
    const ratingVal = Number(
      (form.elements.namedItem("rating") as HTMLInputElement).value
    );

    startTransition(async () => {
      try {
        await HandleUpdateReview(
          { content, rating: ratingVal },
          editingReview._id
        );
        toast.success(t.success_update);
        setEditingReview(null);
        fetchReviews(page);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  if (authLoading)
    return (
      <div className="py-10 text-center">
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );

  return (
    <Card
      className="rounded-3xl shadow-xl border-0 bg-white mt-10 scroll-mt-20"
      id="reviews"
    >
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-3xl pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-orange-600" />
            {/* Sử dụng biến t.title thay vì text cứng */}
            {t.title}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-8 space-y-8">
        {/* === 1. FORM VIẾT ĐÁNH GIÁ === */}
        {user ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {t.write_as}
                </p>
                <p className="text-orange-600 font-bold text-sm">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                {t.satisfaction_level}
              </label>
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
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 group-hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm border">
                  {getRatingLabel(rating)}
                </span>
              </div>
            </div>

            <div className="relative">
              <Textarea
                {...register("content")}
                // Placeholder động theo ngôn ngữ
                placeholder={t.placeholder}
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
                {isPending ? t.sending : t.submit_btn}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-600 mb-4 font-medium">{t.login_cta}</p>
            <Link href="/tai-khoan/dang-nhap">
              <Button className="rounded-full px-8 bg-gray-900 text-white hover:bg-black">
                {t.login_btn}
              </Button>
            </Link>
          </div>
        )}

        <Separator className="bg-gray-100" />

        {/* === 2. DANH SÁCH ĐÁNH GIÁ === */}
        <div className="space-y-6">
          {isFetching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
              <p className="text-gray-500 italic">{t.no_reviews}</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <Avatar className="h-11 w-11 mt-1 border border-gray-100 shadow-sm">
                  <AvatarImage src={review.userId?.avatar} />
                  <AvatarFallback className="bg-gray-100 text-gray-500 font-bold">
                    {review.userId?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                        {review.userId?.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={
                                i < review.rating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>

                    {user?._id === review.userId?._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl shadow-lg border-gray-100"
                        >
                          <DropdownMenuItem
                            onClick={() => setEditingReview(review)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="h-3 w-3 mr-2" /> {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(review._id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3 mr-2" /> {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="mt-2 text-gray-700 leading-relaxed text-sm sm:text-base bg-gray-50/50 p-3 rounded-xl rounded-tl-none border border-transparent hover:border-gray-100 transition-colors">
                    {/* Chặn dịch tự động cho nội dung review để tránh dịch sai ý người viết */}
                    <span data-no-translate="true">{review.content}</span>
                  </div>

                  {review.reply && (
                    <div className="ml-4 mt-3 pl-4 border-l-2 border-orange-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CornerDownRight className="h-4 w-4 text-orange-400" />
                        <span className="text-xs font-bold text-gray-800 bg-orange-100 px-2 py-0.5 rounded text-orange-700">
                          {targetType === "Attraction"
                            ? t.admin_reply
                            : t.seller_reply}
                        </span>
                      </div>
                      <p
                        className="text-sm text-gray-600 italic"
                        data-no-translate="true"
                      >
                        {review.reply.content}
                      </p>
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
              {t.prev}
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
              {t.next}
            </Button>
          </div>
        )}
      </CardContent>

      {/* --- MODAL EDIT --- */}
      <Dialog
        open={!!editingReview}
        onOpenChange={(open) => !open && setEditingReview(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.edit}</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <form onSubmit={onUpdate} className="space-y-5 py-2">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {t.satisfaction_level}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="relative">
                      <input
                        type="radio"
                        name="rating"
                        value={s}
                        defaultChecked={editingReview.rating === s}
                        className="peer absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Star
                        className={`w-8 h-8 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 text-gray-300 pointer-events-none`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Nội dung
                </label>
                <Textarea
                  name="content"
                  defaultValue={editingReview.content}
                  className="min-h-[120px] resize-none rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingReview(null)}
                  className="rounded-xl"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 text-white hover:bg-orange-700 rounded-xl"
                >
                  {t.save}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}