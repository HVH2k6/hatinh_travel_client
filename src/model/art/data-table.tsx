"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


import { columns } from "./columns";
import { IArt } from "@/interfaces/IArt";
import { ArtTable } from "./ArtTable";






type Props = {
  data: IArt[];
  hasToolbar?: boolean;
};

export default function DataArtTable({ data, hasToolbar = true }: Props) {
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
        <CardTitle>Danh sách nghệ thuật </CardTitle>

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
        <ArtTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}
