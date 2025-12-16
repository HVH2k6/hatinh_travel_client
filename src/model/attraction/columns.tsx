"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { IAttraction } from "@/interfaces/IAttraction";
import { HandleDeleteAttraction } from "@/action/HandleAttraction";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const nf = new Intl.NumberFormat("vi-VN");

const STATUS_META: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Hoạt động", className: "bg-green-100 text-green-800" },
  PENDING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
  DELETED: { label: "Đã xoá", className: "bg-red-100 text-red-800" },
};

/* ================= Time utils ================= */

const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toHHmm(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";

  // Chuỗi "HH:mm"
  if (typeof v === "string") {
    if (HHMM_RE.test(v)) return v;
    // Thử parse ISO
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
    return "—";
  }

  // Date object
  if (v instanceof Date && !isNaN(v.getTime())) {
    const hh = String(v.getUTCHours()).padStart(2, "0");
    const mm = String(v.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // number timestamp
  if (typeof v === "number") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
  }

  return "—";
}

/* ================= Actions ================= */

function ActionsCell({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await HandleDeleteAttraction(id);
      toast.success("Xoá thành công");
    } catch (err: any) {
      toast.error(
        err?.message ||
          err?.response?.data?.message ||
          "Có lỗi xảy ra khi xoá. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="text-blue-600 hover:text-blue-800 border-blue-200"
        aria-label="Sửa địa điểm"
      >
        <Link href={`/quan-ly/dia-diem-du-lich/sua/${id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-800 border-red-200"
            aria-label="Xoá địa điểm"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá địa điểm này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= Columns ================= */

export const columns: ColumnDef<IAttraction & {
  categoryName?: string;
  typeName?: string;
}>[] = [
  {
    accessorKey: "name",
    header: "Tên địa điểm",
    cell: ({ row }) => (
      <div className="font-medium line-clamp-2">
        {row.getValue("name") as string}
      </div>
    ),
  },
  { accessorKey: "categoryName", header: "Danh mục" },
  { accessorKey: "typeName", header: "Loại hình" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "DELETED";
      const meta = STATUS_META[status] || STATUS_META.DELETED;
      return <Badge className={`capitalize ${meta.className}`}>{meta.label}</Badge>;
    },
  },
  {
    accessorKey: "minPrice",
    header: "Giá tối thiểu",
    cell: ({ row }) => {
      const v = Number(row.getValue("minPrice") ?? 0);
      return v ? `${nf.format(v)} đ` : "0 đ";
    },
  },

  // // ⏰ Giờ mở/đóng (đã format HH:mm, fallback "—")
  // {
  //   accessorKey: "openTime",
  //   header: "Mở cửa",
  //   cell: ({ row }) => <span>{toHHmm(row.getValue("openTime"))}</span>,
  // },
  // {
  //   accessorKey: "closeTime",
  //   header: "Đóng cửa",
  //   cell: ({ row }) => <span>{toHHmm(row.getValue("closeTime"))}</span>,
  // },

  // (Tuỳ chọn) Nếu muốn gộp 1 cột:
  {
    id: "workingHours",
    header: "Giờ hoạt động",
    cell: ({ row }) => {
      const o = toHHmm(row.original.openTime as any);
      const c = toHHmm(row.original.closeTime as any);
      return <span>{o} — {c}</span>;
    },
  },

  {
    accessorKey: "maxPrice",
    header: "Giá tối đa",
    cell: ({ row }) => {
      const v = Number(row.getValue("maxPrice") ?? 0);
      return v ? `${nf.format(v)} đ` : "0 đ";
    },
  },
  {
    accessorKey: "createdBy",
    header: "Tạo bởi",
    cell: ({ row }) => {
      const v = row.getValue("createdBy") as any;
      return typeof v === "string" ? v : v?.name || v?.email || "—";
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const r = row.original as any;
      const id = r?._id ?? r?.id;
      return id ? <ActionsCell id={id} /> : null;
    },
  },
];
