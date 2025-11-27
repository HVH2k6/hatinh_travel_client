
import { mapRawDataToattraction } from "@/helper/formatDestination"
import { pagination } from "@/util/constant"

export async function getAttractions({ page = pagination.page, limit = pagination.limit }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions?page=${page}&limit=${limit}`, {
    next: { tags: ['attractions'] },
  })

  if (!res.ok) throw new Error("Lỗi lấy dữ liệu")

  const json = await res.json()
  // console.log("🚀 ~ getAttractions ~ json:", json)

  return {
    data: mapRawDataToattraction(json.data),
    pagination: json.pagination,
  }
}