'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { HandleDeleteAttraction } from '@/action/HandleAttraction';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { IProduct } from '@/interfaces/IProduct';
import Image from 'next/image';
import { HandleDeleteProduct } from '@/action/HandleProduct';

const nf = new Intl.NumberFormat('vi-VN');

/* ================= Actions ================= */

function ActionsCell({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await HandleDeleteProduct(id);
      console.log(id);
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
        className='text-blue-600 hover:text-blue-800 border-blue-200'
        aria-label='Sửa sản phẩm'
      >
        <Link href={`/quan-ly-cua-hang/san-pham/sua/${id}`}>
          <Pencil className='w-4 h-4' />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='text-red-600 hover:text-red-800 border-red-200'
            aria-label='Xoá'
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
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá địa điểm
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

/* ================= Columns ================= */

export const columns: ColumnDef<
  IProduct & {
    shopName?: string;
  }
>[] = [
  {
    accessorKey: 'image',
    header: 'Hình anh',
    cell: ({ row }) => {
      return (
        <Image src={row.getValue('image') as string} alt="" width={60} height={60}/>
      )
  }
  },
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
    cell: ({ row }) => (
      <div className='font-medium line-clamp-2'>
        {row.getValue('name') as string}
      </div>
    ),
  },
  { accessorKey: 'shopId.name', header: 'Tạo bởi' },

  {
    accessorKey: 'price',
    header: 'Giá',
    cell: ({ row }) => {
      const v = Number(row.getValue('price') ?? 0);
      return v ? `${nf.format(v)} đ` : '0 đ';
    },
  },
{
    accessorKey: 'unitId.symbol',
    header: 'Đơn vị tính',

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
