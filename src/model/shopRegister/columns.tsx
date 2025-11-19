"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'; // 👈 IMPORT THƯ VIỆN ĐỌC COOKIE
import type { ISellerApplication } from "@/interfaces/ISellerApplication";
// LOẠI BỎ: import { cookies } from 'next/headers'

const API = process.env.NEXT_PUBLIC_API_URL;

const fmt = (d?: string | Date) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

function StatusBadge({ status }: { status: ISellerApplication["status"] }) {
// ... (StatusBadge logic remains the same)
  const map: Record<
    ISellerApplication["status"],
    { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }
  > = {
    pending: { label: "Chờ duyệt", variant: "secondary" },
    approved: { label: "Đã duyệt", variant: "default" },
    rejected: { label: "Từ chối", variant: "destructive" },
  };
  const { label, variant } = map[status] || { label: status, variant: "outline" };
  return <Badge variant={variant}>{label}</Badge>;
}

function ActionsCell({ app }: { app: ISellerApplication }) {
  const router = useRouter();
  const id = app._id;
  const shopId =
    (app.shopId as any)?._id ||
    (typeof app.shopId === "string" ? app.shopId : undefined);

  const [openReject, setOpenReject] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [loading, setLoading] = React.useState<"approve" | "reject" | null>(null);

  // Hàm lấy token từ Cookie
  const getAuthToken = () => {
    // Tên cookie thường là 'access_token' hoặc 'token', bạn hãy thay thế cho đúng
    const token = Cookies.get('access_token'); 
    if (!token) {
        toast.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }
    return token;
  };

  const approve = async () => {
    try {
      setLoading("approve");
      const token = getAuthToken(); // 👈 LẤY TOKEN TỪ COOKIE
      if (!token) return;

      const res = await fetch(`${API}/sellerapplication/seller-applications/${id}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // SỬ DỤNG TOKEN
        },
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "Duyệt hồ sơ thất bại");
      }
      toast.success("Đã duyệt hồ sơ");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi khi duyệt");
    } finally {
      setLoading(null);
    }
  };

  const reject = async () => {
    try {
      setLoading("reject");
      const token = getAuthToken(); // 👈 LẤY TOKEN TỪ COOKIE
      if (!token) return;

      const res = await fetch(`${API}/sellerapplication/seller-applications/${id}/reject`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // SỬ DỤNG TOKEN
        },
        body: JSON.stringify({ reason }),
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "Từ chối hồ sơ thất bại");
      }
      toast.success("Đã từ chối hồ sơ");
      setOpenReject(false);
      setReason("");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi khi từ chối");
    } finally {
      setLoading(null);
    }
  };

  const disabled = app.status !== "pending";
// ... (JSX render remains the same)
  return (
    <div className="flex gap-2">
      {/* Xem chi tiết */}
      <Button
        asChild
        variant="outline"
        size="icon"
        className="text-blue-600 hover:text-blue-800 border-blue-200"
        aria-label="Xem chi tiết"
        title="Xem chi tiết hồ sơ"
      >
        <Link href={`/quan-ly/shop/duyet-don/xem/${id}`}>
          <Eye className="w-4 h-4" />
        </Link>
      </Button>

      {/* Chỉnh shop nếu đã có shopId */}
      {shopId && (
        <Button
          asChild
          variant="outline"
          size="icon"
          className="text-emerald-600 hover:text-emerald-800 border-emerald-200"
          aria-label="Sửa shop"
          title="Sửa cửa hàng đã tạo"
        >
          <Link href={`/quan-ly/cua-hang/sua/${shopId}`}>
            <Pencil className="w-4 h-4" />
          </Link>
        </Button>
      )}

      {/* DUYỆT */}
      <Button
        variant="outline"
        size="icon"
        className="text-emerald-600 hover:text-emerald-800 border-emerald-200"
        aria-label="Duyệt"
        title="Duyệt hồ sơ"
        onClick={approve}
        disabled={disabled || loading === "approve"}
      >
        <Check className={`w-4 h-4 ${loading === "approve" ? "animate-pulse" : ""}`} />
      </Button>

      {/* TỪ CHỐI (mở modal nhập lý do) */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-800 border-red-200"
            aria-label="Từ chối"
            title="Từ chối hồ sơ"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Từ chối hồ sơ</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để người nộp có thể cập nhật hồ sơ.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do từ chối…"
            className="min-h-[120px]"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpenReject(false)}>
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={reject}
              disabled={loading === "reject" || !reason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const columns: ColumnDef<ISellerApplication>[] = [
// ... (columns definition remains the same)
  {
    id: "user",
    header: "Người nộp",
    cell: ({ row }) => {
      const u: any = row.original.userId;
      const displayName =
        u?.name ||
        u?.username ||
        (typeof u?.email === "string" ? u.email.split("@")[0] : "") ||
        "—";
      return (
        <div className="leading-tight">
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground">{u?.email || "—"}</div>
        </div>
      );
    },
  },
  {
    id: "shopName",
    header: "Tên shop",
    cell: ({ row }) => row.original.shopDraft?.name || "—",
  },
  {
    id: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const cat: any = row.original.shopDraft?.categoryId;
      return cat?.name || cat?.slug || "—";
    },
  },
  {
    id: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const a: any = row.original.shopDraft?.address;
      const pv = typeof a?.provinceId === "object" ? a.provinceId?.name : "";
      const dt = typeof a?.districtId === "object" ? a.districtId?.name : "";
      const wd = typeof a?.wardId === "object" ? a.wardId?.name : "";
      const de = a?.detail || "";
      return [de, wd, dt, pv].filter(Boolean).join(", ") || "—";
    },
  },
  {
    id: "phone",
    header: "Liên hệ",
    cell: ({ row }) => row.original.shopDraft?.contact?.phone || "—",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusBadge status={row.getValue("status") as ISellerApplication["status"]} />,
  },
  {
    accessorKey: "createdAt",
    header: "Tạo lúc",
    cell: ({ row }) => fmt(row.getValue("createdAt") as any),
  },
  {
    accessorKey: "reviewedAt",
    header: "Duyệt lúc",
    cell: ({ row }) => fmt(row.getValue("reviewedAt") as any),
  },
  {
    accessorKey: "rejectReason",
    header: "Lý do từ chối",
    cell: ({ row }) => row.getValue("rejectReason") || "—",
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <ActionsCell app={row.original} />,
  },
];