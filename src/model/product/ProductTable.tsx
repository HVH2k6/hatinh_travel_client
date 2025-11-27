'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { columns } from './columns';
import type { IAttraction } from '@/interfaces/IAttraction';
import { STATUS } from '@/util/constant';
import { DataProductTable } from './data-table';
import { IProduct } from '@/interfaces/IProduct';
type Props = {
  data: IProduct[];
  hasToolbar?: boolean;
};

export default function ProductTable({ data, hasToolbar = true }: Props) {
  return (
    <Card className='border shadow-sm'>
      <CardHeader className='gap-2'>
        <CardTitle>Danh sách sản phẩm</CardTitle>
      </CardHeader>

      <CardContent>
        <DataProductTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
