"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { IAttraction } from "@/interfaces/IAttraction"

import { toast } from "react-toastify"
import * as React from "react"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import { HandleDeleteAttraction } from "@/action/HandleAttraction"

function ActionsCell({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const onDelete = async () => {
    const result = await Swal.fire({
      title: "Xác nhận xoá",
      text: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    })

    if (!result.isConfirmed) return

    setIsDeleting(true)
    try {
      await HandleDeleteAttraction(id)
      toast.success("Xóa thành công")
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi xoá. Vui lòng thử lại."
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="text-blue-600 hover:text-blue-800 border-blue-300"
        disabled={isDeleting}
      >
        <Link href={`/manage/attraction/update/${id}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="text-red-600 hover:text-red-800 border-red-300"
        onClick={onDelete}
        disabled={isDeleting}
        title="Xóa địa điểm"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}

export const columns: ColumnDef<IAttraction>[] = [
  { accessorKey: "name", header: "Tên địa điểm" },
  { accessorKey: "categoryName", header: "Danh mục" },
  { accessorKey: "typeName", header: "Loại hình" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColorMap: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        inactive: "bg-red-100 text-red-800",
      }
      const colorClass = statusColorMap[status] || "bg-red-100 text-red-800"
      return <Badge className={`capitalize ${colorClass}`}>{status}</Badge>
    },
  },
  {
    accessorKey: "minPrice",
    header: "Giá tối thiểu",
    cell: ({ row }) => {
      const value = row.getValue("minPrice") as number
      return value ? value.toLocaleString("vi-VN") + " đ" : "0 đ"
    },
  },
  {
    accessorKey: "maxPrice",
    header: "Giá tối đa",
    cell: ({ row }) => {
      const value = row.getValue("maxPrice") as number
      return value ? value.toLocaleString("vi-VN") + " đ" : "0 đ"
    },
  },
  { accessorKey: "createdBy", header: "Tạo bởi" },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const attraction = row.original
      const id = (attraction as any)?._id ?? (attraction as any)?.id
      return <ActionsCell id={id} />
    },
  },
]
