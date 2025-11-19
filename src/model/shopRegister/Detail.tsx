import { ISellerApplication } from '@/interfaces/ISellerApplication';
import {
  FacebookIcon,
  PhoneCallIcon,
  MapPinIcon,
  MessageSquareIcon, // Dùng cho Zalo
  FileTextIcon, // Dùng cho tài liệu
  UserIcon, // Dùng cho ảnh đại diện fallback
  CalendarIcon, // Icon cho ngày tháng
  UserSquareIcon, // Icon cho người dùng
  PackageIcon, // Icon cho danh mục/gói hàng
} from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Giả sử bạn đã cài đặt shadcn/ui
import { Badge } from '@/components/ui/badge'; // Giả sử bạn đã cài đặt shadcn/ui
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'; // Giả sử bạn đã cài đặt shadcn/ui
import { Separator } from '@/components/ui/separator'; // Giả sử bạn đã cài đặt shadcn/ui

interface DetailRegisterProps {
  data: ISellerApplication;
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
      return { label: 'Từ chối', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'outline' as const };
  }
};

/**
 * Component con để hiển thị một trường liên hệ (nếu có giá trị).
 */
const ContactField = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value?: string | null;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-medium break-all">{value}</span>
    </div>
  );
};

/**
 * Component con để hiển thị chi tiết (ví dụ: Người gửi, Danh mục)
 */
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined | null;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
};

export default function DetailRegister({ data }: DetailRegisterProps) {
  const addressData = data.shopDraft.address;
  const location =
    [
      addressData?.wardId?.name,
      addressData?.districtId?.name,
      addressData?.provinceId?.name,
    ]
      .filter(Boolean)
      .join(', ') || 'Chưa cập nhật địa chỉ';

  const status = getStatusAppearance(data.status);
  const { contact } = data.shopDraft;
  const hasContact = contact?.phone || contact?.facebook || contact?.zalo;

 const formattedCreatedAt = data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}) : '';


  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột chính (bên trái) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Thông tin Shop */}
          <Card>
            <CardHeader className="flex flex-col items-start gap-4 sm:flex-row">
              <Avatar className="h-20 w-20 rounded-lg border">
                <AvatarImage
                  src={data.shopDraft.image || ''}
                  alt={data.shopDraft.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  <UserIcon className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{data.shopDraft.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{location}</span>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Tài liệu & Giấy tờ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Giấy tờ & Tài liệu
              </CardTitle>
              <CardDescription>
                Các hình ảnh tài liệu shop đã cung cấp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.shopDraft.documents &&
              data.shopDraft.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {data.shopDraft.documents.map((item, index) => (
                    <a
                      key={index}
                      href={item}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="overflow-hidden rounded-lg border transition-transform hover:scale-105"
                    >
                      <Image
                        src={item}
                        alt={`Tài liệu ${index + 1}`}
                        width={300}
                        height={300}
                        className="aspect-square w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Shop không cung cấp tài liệu.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phụ (bên phải) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card Thông tin Đơn đăng ký */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Đơn đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trạng thái */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </span>
                <Badge variant={status.variant} className="px-3 py-1 text-sm">
                  {status.label}
                </Badge>
              </div>

              <Separator />

              {/* Các chi tiết mới */}
              <div className="space-y-3">
                <DetailItem
                  icon={<UserSquareIcon className="h-4 w-4" />}
                  label="Người gửi:"
                  value={data.userId.username}
                />
                <DetailItem
                  icon={<PackageIcon className="h-4 w-4" />}
                  label="Danh mục:"
                  value={data.shopDraft.categoryId.name}
                />
                <DetailItem
                  icon={<CalendarIcon className="h-4 w-4" />}
                  label="Ngày nộp:"
                  value={formattedCreatedAt}
                />
              </div>
            </CardContent>
          </Card>

          {/* Thông tin liên hệ */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              {hasContact ? (
                <div className="space-y-4">
                  <ContactField
                    icon={<PhoneCallIcon className="h-4 w-4" />}
                    value={contact?.phone}
                  />
                  <ContactField
                    icon={<FacebookIcon className="h-4 w-4" />}
                    value={contact?.facebook}
                  />
                  <ContactField
                    icon={<MessageSquareIcon className="h-4 w-4" />}
                    value={contact?.zalo}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Không có thông tin liên hệ.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


