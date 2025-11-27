"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { columns } from "./columns";

import {  DataShopTable } from "./data-table";
import { IShop } from "@/interfaces/IShop";

type Props = {
  data: IShop[]; // Dữ liệu từ API
  hasToolbar?: boolean;
};

export default function ShopTable({ data, hasToolbar = true }: Props) {
 console.log("🚀 ~ ShopTable ~ data:", data)
 

  return (
    <Card className="border shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>Danh sách cửa hàng</CardTitle>
     
      </CardHeader>

      <CardContent>
        <DataShopTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
