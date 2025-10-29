"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { columns } from "./columns"; // cột bạn đã định nghĩa cho ISellerApplication
import type { ISellerApplication } from "@/interfaces/ISellerApplication";
import { ShopRegisterTable } from "./ShopRegisterTable";


type Props = {
  data: ISellerApplication[];
  hasToolbar?: boolean;
};

export default function SellerApplicationTable({ data, hasToolbar = true }: Props) {
  const [q, setQ] = React.useState("");
const filtered = React.useMemo(() => {
  const text = q.trim().toLowerCase();
  if (!text) return data;

  return data.filter((d) => {
    const user: any = d.userId; // ✅
    const cat: any = d.shopDraft?.categoryId;
    const addr = d.shopDraft?.address;

    const province: any = addr?.provinceId;
    const district: any = addr?.districtId;
    const ward: any = addr?.wardId;

    const haystack = [
      d.shopDraft?.name || "",                                  // ✅ tên shop
      typeof cat === "object" ? (cat?.name || cat?.slug || "") : (cat || ""),
      typeof user === "object" ? (user?.name || user?.username || "") : "",
      typeof user === "object" ? (user?.email || "") : "",
      d.shopDraft?.contact?.phone || "",
      typeof province === "object" ? (province?.name || "") : "",
      typeof district === "object" ? (district?.name || "") : "",
      typeof ward === "object" ? (ward?.name || "") : "",
      addr?.detail || "",
      d.status || "",
    ].join(" ").toLowerCase();

    return haystack.includes(text);
  });
}, [data, q]);
  return (
    <Card className="border shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>Danh sách hồ sơ đăng ký shop</CardTitle>

        {hasToolbar && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên shop, người nộp, danh mục, SĐT, địa chỉ…"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ShopRegisterTable columns={columns} data={filtered} emptyText="Chưa có hồ sơ nào." />
      </CardContent>
    </Card>
  );
}
