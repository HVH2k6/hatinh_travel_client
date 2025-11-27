"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


import { columns } from "./columns";
import { IUnit } from "@/interfaces/IUnit";
import { UnitTable } from "./UnitTable";



type Props = {
  data: IUnit[];
  hasToolbar?: boolean;
};

export default function DataUnitTable({ data, hasToolbar = true }: Props) {
  const [q, setQ] = React.useState("");
  

  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return data.filter((d) => {
      
      const okText =
        !text ||
        d.name?.toLowerCase().includes(text) 
      return okText;
    });
  }, [data, q]);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>Danh sách đơn vị</CardTitle>

        {hasToolbar && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên…"
            />
           
          </div>
        )}
      </CardHeader>

      <CardContent>
        <UnitTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}
