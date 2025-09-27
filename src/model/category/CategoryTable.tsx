"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataAttractionTable } from "./data-table";
import { columns } from "./columns";
import type { ICategory } from "@/interfaces/ICategory";

type Props = {
  data: ICategory[];
  hasToolbar?: boolean;
};

export default function CategoryTable({ data, hasToolbar = true }: Props) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return data.filter((d) => {
      const parentMatch = (d as any).parentName?.toLowerCase?.().includes(text);
      return (
        !text ||
        d.name.toLowerCase().includes(text) ||
        d.slug?.toLowerCase?.().includes(text) ||
        parentMatch
      );
    });
  }, [data, q]);

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
        <DataAttractionTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}
