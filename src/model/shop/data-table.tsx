"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyText?: string;
}

// Hàm đệ quy để render các dòng có phân cấp
const renderCategoryRows = <TData, TValue>(
  rows: Row<TData>[],
  parentId: string | null = null,
  level: number = 0
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  rows
    .filter((row) => {
      const rowData = row.original as any;
      // FIX: Nếu không có parentId (undefined), coi như là root level (parentId = null)
      const rowParentId = rowData.parentId === undefined ? null : rowData.parentId;
      return rowParentId === parentId;
    })
    .forEach((row) => {
      result.push(
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell, index) => (
            <TableCell
              key={cell.id}
              className="px-4 py-2 align-top"
              style={{
                paddingLeft: index === 0 ? `${level * 20}px` : undefined,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );

      // Render con
      result.push(...renderCategoryRows(rows, (row.original as any)._id, level + 1));
    });

  return result;
};

export function DataShopTable<TData, TValue>({
  columns,
  data,
  emptyText = "Không có dữ liệu.",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  console.log(">>>>>", data);

  return (
    <div className="overflow-auto rounded-xl border border-border shadow-sm bg-card">
      <Table className="min-w-full text-sm">
        <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-3 text-left font-semibold text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length ? (
            renderCategoryRows(rows)
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}