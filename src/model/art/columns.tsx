'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

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
} from '@/components/ui/alert-dialog';
import { IFood } from '@/interfaces/IFood';
import { HandleDeleteFood } from '@/action/HandleFood';
import { IArt } from '@/interfaces/IArt';
import { HandleDeleteArt } from '@/action/HandleArt';

// Helper format ngày
const fmt = (d?: string | Date) =>
  d ? new Date(d).toLocaleString('vi-VN') : '—';

// Component Hành động (Sửa/Xóa)
const nf = new Intl.NumberFormat('vi-VN');
function ActionsCell({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await HandleDeleteArt(id); // Gọi action xoá Unit
      toast.success('Xoá nghệ thuật  thành công');
      router.refresh();
    } catch (err: any) {
      toast.error(
        err?.message ||
          err?.response?.data?.message ||
          'Có lỗi xảy ra khi xoá. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex gap-2'>
      <Button
        asChild
        variant='outline'
        size='icon'
        className='text-blue-600 hover:text-blue-800 border-blue-200'
        aria-label='Sửa nghệ thuật'
      >
        {/* Sửa đường dẫn sang trang sửa Unit */}
        <Link href={`/quan-ly/nghe-thuat/sua/${id}`}>
          <Pencil className='w-4 h-4' />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='text-red-600 hover:text-red-800 border-red-200'
            aria-label='Xoá nghệ thuật'
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Trash2 className='w-4 h-4' />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá nghệ thuật
               này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className='bg-red-600 hover:bg-red-700'
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
export const columns: ColumnDef<IArt>[] = [
  {
    accessorKey: 'name',
    header: 'Tên nghệ thuật',
  },
  {
    accessorKey: 'categoryId.name',
    header: 'Danh mục',
  },
  {
    accessorKey: 'video_url',
    header: 'Link',
   
  },
  {
    accessorKey: 'address',
    header: 'Địa chỉ',
    cell: ({ row }) => {
      const address = (row.original as any)?.address;
      return (
        <div className='text-sm max-w-xs'>
          <div>{address?.wardId?.name || ''}</div>
          <div className='text-muted-foreground text-xs'>
            {address?.districtId?.name || ''}, {address?.provinceId?.name || ''}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => (
      <span className='text-sm text-gray-500'>
        {fmt(row.getValue('createdAt') as any)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => {
      const r = row.original as any;
      const id = r?._id ?? r?.id;
      return id ? <ActionsCell id={id} /> : null;
    },
  },
];
