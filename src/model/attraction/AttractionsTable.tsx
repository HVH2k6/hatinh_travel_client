"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DataAttractionTable } from "./data-table";
import { columns } from "./columns";
import type { IAttraction } from "@/interfaces/IAttraction";
import {STATUS} from "@/util/constant";
type Props = {
  data: IAttraction[];
  hasToolbar?: boolean;
};
const list_status = ["ALL", STATUS.ACTIVE, STATUS.PENDING, STATUS.DELETED];
export default function AttractionsTable({ data, hasToolbar = true }: Props) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>(list_status[0]);

  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return data.filter((d) => {
      const okStatus = status === "ALL" ? true : d.status === status;
      const okText =
        !text ||
        d.name?.toLowerCase().includes(text) ||
        (d.categoryId.name ?? "").toLowerCase().includes(text) ||
        (d.typeId.name ?? "").toLowerCase().includes(text);
      return okStatus && okText;
    });
  }, [data, q, status]);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>Danh sách địa điểm</CardTitle>

        {hasToolbar && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên, danh mục, loại hình…"
            />
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="DELETED">Đã xoá</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <DataAttractionTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}
