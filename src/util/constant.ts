import {
  FileType,
  Map,
  ShoppingBag,
  SquareMenu,
  SquareTerminal,
} from 'lucide-react';

export const STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  DELETED: 'deleted',
};

export const getProvinces = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/address/province`,
      {
        cache: 'no-store',
      }
    );
    const data = await res.json();
    if (!data) return [];
    return data;
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
    return [];
  }
};
export const pagination = {
  page: 1,
  limit: 10,
};
export const menuSidebarAdmin = [
  {
    title: 'Địa điểm du lịch',
    url: '#',
    icon: Map,
    page: 'admin',

    items: [
      {
        title: 'Danh sách địa điểm',
        url: '/quan-ly/dia-diem-du-lich',
      },
      {
        title: 'Tạo mới địa điểm',
        url: '/quan-ly/dia-diem-du-lich/tao-moi',
      },
    ],
  },
  {
    title: 'Danh mục',
    url: '#',
    icon: SquareMenu,
    page: 'admin',

    items: [
      {
        title: 'Danh sách danh mục',
        url: '/quan-ly/danh-muc',
      },
      {
        title: 'Tạo mới địa điểm',
        url: '/quan-ly/danh-muc/tao-moi',
      },
    ],
  },
  {
    title: 'Loại hình',
    url: '#',
    icon: FileType,
    page: 'admin',

    items: [
      {
        title: 'Danh sách loại hình',
        url: '/quan-ly/loai-hinh',
      },
      {
        title: 'Tạo mới loại hình',
        url: '/quan-ly/loai-hinh/tao-moi',
      },
    ],
  },
  {
    title: 'Chợ',
    url: '#',
    icon: ShoppingBag,
    page: 'admin',

    items: [
      {
        title: 'Danh sách chợ',
        url: '/quan-ly/shop',
      },
      {
        title: 'Duyệt đơn mở shop',
        url: '/quan-ly/shop/duyet-don',
      },
      {
        title: 'Tạo mới chợ',
        url: '/quan-ly/shop/tao-moi',
      },
    ],
  },
    {
    title: 'Danh sách cửa hàng',
    url: '/quan-ly-cua-hang',
    icon: ShoppingBag,
    page: 'shop',

  },
] as const; // 👈 Dòng này là chìa khóa để giải quyết lỗi