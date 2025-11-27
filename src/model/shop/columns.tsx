'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Pencil, Trash2, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { HandleDeleteCategory } from '@/action/HandleCategory';
import { toast } from 'react-toastify';
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
import { IShop } from '@/interfaces/IShop';
import { HandleDeleteShop } from '@/action/HandleShop';

function ActionsCell({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await HandleDeleteShop(id);
      toast.success('Xoá thành công');
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
        className='text-green-600 hover:text-green-800 border-blue-200'
        aria-label='xem chi tiết'
      >
        <Link href={`/quan-ly/cua-hang/${id}`}>
          <Eye className='w-4 h-4' />
        </Link>
      </Button>

      <Button
        asChild
        variant='outline'
        size='icon'
        className='text-blue-600 hover:text-blue-800 border-blue-200'
        aria-label='Sửa cửa hàng'
      >
        <Link href={`/quan-ly/cua-hang/sua/${id}`}>
          <Pencil className='w-4 h-4' />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='text-red-600 hover:text-red-800 border-red-200'
            aria-label='Xoá cửa hàng'
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
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá cửa hàng
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

const fmt = (d?: string | Date) =>
  d ? new Date(d).toLocaleString('vi-VN') : '—';

export const columns: ColumnDef<IShop & { parentName?: string }>[] = [
  {
    accessorKey: 'name',
    header: 'Tên cửa hàng',
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name') as string}</div>
    ),
  },
  {
    accessorKey: 'categoryId',
    header: 'Danh mục',
    cell: ({ row }) => {
      const category = (row.original as any)?.categoryId;
      return <span className='text-sm'>{category?.name || '—'}</span>;
    },
  },
  {
    accessorKey: 'sellerId',
    header: 'Người bán',
    cell: ({ row }) => {
      const seller = (row.original as any)?.sellerId;
      return (
        <div className='text-sm'>
          <div className='font-medium'>{seller?.username || '—'}</div>
          <div className='text-muted-foreground text-xs'>
            {seller?.email || ''}
          </div>
        </div>
      );
    },
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
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const isActive = status === 'ACTIVE';

      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={isActive ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tạo lúc',
    cell: ({ row }) => (
      <span className='text-sm'>{fmt(row.getValue('createdAt') as any)}</span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Cập nhật',
    cell: ({ row }) => (
      <span className='text-sm'>{fmt(row.getValue('updatedAt') as any)}</span>
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
