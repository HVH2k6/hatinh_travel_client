"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import type { IType } from "@/interfaces/IType";
import { HandleDeleteType } from "@/action/HandleType";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fmt = (d?: string | Date) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

function ActionsCell({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await HandleDeleteType(id);
      toast.success("Xoá loại hình thành công");
      router.refresh(); // cập nhật lại bảng
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
        aria-label="Sửa loại hình"
      >
        <Link href={`/quan-ly/loai-hinh/sua/${id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-800 border-red-200"
            aria-label="Xoá loại hình"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá loại hình này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const columns: ColumnDef<IType>[] = [
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name") as string}</div>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const t = (row.getValue("description") as string) || "";
      return <span title={t}>{t ? (t.length > 80 ? t.slice(0, 80) + "…" : t) : "—"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tạo lúc",
    cell: ({ row }) => <span>{fmt(row.getValue("createdAt") as any)}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật",
    cell: ({ row }) => <span>{fmt(row.getValue("updatedAt") as any)}</span>,
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
