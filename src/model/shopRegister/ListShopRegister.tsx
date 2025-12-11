'use client'; // Component này cần là client component để dùng hooks (nếu cần) hoặc event handlers

import { ISellerApplication } from '@/interfaces/ISellerApplication';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircleIcon, MapPinIcon, UserIcon, InboxIcon } from 'lucide-react';

interface Props {
  data: ISellerApplication[];
}

/**
 * Chuyển đổi trạng thái (status) sang nhãn (label) và biến thể (variant) cho Badge.
 */
const getStatusAppearance = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Chờ duyệt', variant: 'secondary' as const };
    case 'approved':
      return { label: 'Đã duyệt', variant: 'default' as const };
    case 'rejected':
      return { label: 'Đã từ chối', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'outline' as const };
  }
};

/**
 * Định dạng ngày (ví dụ: 02/11/2025)
 * An toàn khi xử lý string, Date, hoặc undefined.
 */
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) {
    return 'Chưa cập nhật'; // Trả về chuỗi dự phòng nếu 'createdAt' là undefined
  }

  // new Date() có thể xử lý cả string và Date object
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function ListShopRegister({ data }: Props) {
  // Trường hợp không có đơn đăng ký nào
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
        <InboxIcon className='h-12 w-12 text-muted-foreground' />
        <h3 className='mt-4 text-xl font-semibold'>
          Không tìm thấy đơn đăng ký
        </h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          Bạn chưa gửi yêu cầu đăng ký shop nào.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {data.map((item) => {
        const { shopDraft, status, createdAt, rejectReason } = item;
        const address = shopDraft.address;
        const location =
          [
            address?.wardId?.name,
            
            address?.provinceId?.name,
          ]
            .filter(Boolean)
            .join(', ') || 'Đang cập nhật';

        const statusInfo = getStatusAppearance(status);
        const formattedDate = formatDate(createdAt);

        return (
          <Card key={item._id} className='overflow-hidden shadow-sm'>
            <CardHeader className='flex flex-row items-start gap-4 space-y-0 p-4'>
              <Avatar className='h-16 w-16 rounded-lg border'>
                <AvatarImage
                  src={shopDraft.image || ''}
                  alt={shopDraft.name}
                  className='object-cover'
                />
                <AvatarFallback className='rounded-lg'>
                  <UserIcon className='h-6 w-6' />
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <CardTitle className='text-xl'>{shopDraft.name}</CardTitle>
                <CardDescription>Gửi ngày: {formattedDate}</CardDescription>
              </div>
              <Badge variant={statusInfo.variant} className='capitalize'>
                {statusInfo.label}
              </Badge>
            </CardHeader>

            <CardContent className='p-4 pt-0'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <MapPinIcon className='h-4 w-4 flex-shrink-0' />
                {/* Đây là địa chỉ đã được map (không có detail) */}

                <span>{location}</span>
              </div>
            </CardContent>

            {/* Hiển thị lý do từ chối nếu có */}
            {status === 'rejected' && rejectReason && (
              <CardFooter className='bg-destructive/10 p-4'>
                <div className='flex items-start gap-2 text-sm text-destructive'>
                  <AlertCircleIcon className='h-4 w-4 flex-shrink-0' />
                  <div>
                    <span className='font-semibold'>Lý do từ chối:</span>
                    <p className='m-0'>{rejectReason}</p>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}
