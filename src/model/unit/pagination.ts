

import { pagination } from "@/util/constant"

export async function getUnit({ page = pagination.page, limit = pagination.limit }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit?page=${page}&limit=${limit}`, {
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