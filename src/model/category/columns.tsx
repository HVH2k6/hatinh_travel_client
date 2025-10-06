"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/interfaces/ICategory";

function ActionsCell({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    // TODO: Thêm logic xóa nếu cần
  };

  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="text-blue-600 hover:text-blue-800 border-blue-200"
        aria-label="Sửa danh mục"
      >
        <Link href={`/quan-ly/danh-muc/sua/${id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="text-red-600 hover:text-red-800 border-red-200"
        aria-label="Xoá danh mục"
        onClick={onDelete}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

const fmt = (d?: string | Date) =>
  d ? new Date(d).toLocaleString("vi-VN") : "—";

export const columns: ColumnDef<ICategory & { parentName?: string }>[] = [
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name") as string}</div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "parentName",
    header: "Danh mục cha",
    cell: ({ row }) => (
      <span>{(row.getValue("parentName") as string) || "—"}</span>
    ),
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
