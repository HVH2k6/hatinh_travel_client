

import { pagination } from "@/util/constant"

export async function getSellerRegisterShop({ page = pagination.page, limit = pagination.limit }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellerapplication/seller-applications?page=${page}&limit=${limit}`, {
    next: { tags: ['type'] },
  })

  if (!res.ok) throw new Error("Lỗi lấy dữ liệu")

  const json = await res.json()
  console.log("🚀 ~ getAttractions ~ json:", json)

  return {
    data: json.data,
    pagination: json.pagination,
  }
}