import { pagination } from "@/util/constant"

// Cập nhật interface props để chứa page, limit, và id
interface props {
  id: string
  page?: number // Thêm ? vì nó có giá trị mặc định
  limit?: number // Thêm ? vì nó có giá trị mặc định
}

export async function getProduct({ id, page = pagination.page, limit = pagination.limit }: props) {
  
  // Ví dụ 2: Nếu ID là một query parameter (dùng cho tìm kiếm/lọc)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/products/${id}?page=${page}&limit=${limit}`, {
    next: { tags: ['attractions'] },
  })

  if (!res.ok) throw new Error("Lỗi lấy dữ liệu")

  const json = await res.json()
  console.log("🚀 ~ getAttractions ~ json:", json)

  return {
    data: (json.data),
    pagination: json.pagination,
  }
}