import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IShop } from '@/interfaces/IShop';
import Link from 'next/link';
import { it } from 'node:test';
interface Props {
  data: IShop[];
}
export default function DetailShopMe({ data }: Props) {
  return (
    <div>
      {data.map((item) => (
        <DropdownMenu key={item._id}>
          <DropdownMenuTrigger className='w-60 h-10 border-2 border-gray-300 rounded-lg'>
            {item.name}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
                <Link href={`/quan-ly-cua-hang/sua-cua-hang/${item._id}`}>Sửa cửa hàng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/quan-ly-cua-hang/danh-sach-san-pham/${item._id}`}>Danh sách sản phẩm</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/quan-ly-cua-hang/them-san-pham/${item._id}`}>Tạo mới sản phẩm</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/quan-ly-cua-hang/danh-sach-binh-luan/${item._id}`}>Xem đánh giá của khách</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>Xóa cửa hàng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}
