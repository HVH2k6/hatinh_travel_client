"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { columns } from "./columns";
import type { ICategory } from "@/interfaces/ICategory";
import { DataCategoryTable } from "./data-table";

type Props = {
  data: ICategory[]; // Dữ liệu từ API
  hasToolbar?: boolean;
};

export default function CategoryTable({ data, hasToolbar = true }: Props) {
  const [q, setQ] = React.useState("");

  // ✅ Thêm parentName vào từng danh mục
  const categoriesWithParentName = React.useMemo(() => {
    return data.map((item) => {
      const parent = data.find((p) => p._id === item.parentId);
      return {
        ...item,
        parentName: parent?.name || undefined,
      };
    });
  }, [data]);

  // ✅ Lọc theo từ khoá
  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return categoriesWithParentName.filter((d) => {
      const parentMatch = d.parentName?.toLowerCase().includes(text);
      return (
        !text ||
        d.name.toLowerCase().includes(text) ||
        d.slug?.toLowerCase().includes(text) ||
        parentMatch
      );
    });
  }, [categoriesWithParentName, q]);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>Danh sách danh mục</CardTitle>
        {hasToolbar && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên, slug, hoặc danh mục cha…"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <DataCategoryTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}
