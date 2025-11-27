"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IUnit } from "@/interfaces/IUnit";

// ⚠️ Đảm bảo bạn đã import đúng Action xoá Unit
// import { HandleDeleteUnit } from "@/action/HandleUnit"; 

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

// Helper format ngày
const fmt = (d?: string | Date) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

// Helper map Type sang tiếng Việt
const typeMap: Record<string, string> = {
  weight: "Trọng lượng",
  volume: "Thể tích",
  count: "Số lượng",
  length: "Chiều dài",
  area: "Diện tích",
  other: "Khác",
};

// Component Hành động (Sửa/Xóa)
function ActionsCell({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      // await HandleDeleteUnit(id); // Gọi action xoá Unit
      toast.success("Xoá đơn vị tính thành công");
      router.refresh();
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
        aria-label="Sửa đơn vị"
      >
        {/* Sửa đường dẫn sang trang sửa Unit */}
        <Link href={`/quan-ly/don-vi-tinh/sua/${id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-800 border-red-200"
            aria-label="Xoá đơn vị"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá đơn vị tính này?
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

// Định nghĩa Columns
export const columns: ColumnDef<IUnit>[] = [
  {
    accessorKey: "name",
    header: "Tên đơn vị",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("name") as string}</div>,
  },
  {
    accessorKey: "symbol",
    header: "Ký hiệu",
    cell: ({ row }) => (
      <div className="font-mono bg-gray-100 px-2 py-1 rounded w-fit text-sm">
        {row.getValue("symbol") as string}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Phân loại",
    cell: ({ row }) => {
      const typeKey = row.getValue("type") as string;
      // Map từ key tiếng Anh sang tiếng Việt
      return <span>{typeMap[typeKey] || typeKey}</span>;
    },
  },
  {
    accessorKey: "order",
    header: "Thứ tự",
    cell: ({ row }) => <div className="text-center w-10">{row.getValue("order") as number}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          {isActive ? "Hoạt động" : "Đã ẩn"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => <span className="text-sm text-gray-500">{fmt(row.getValue("createdAt") as any)}</span>,
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