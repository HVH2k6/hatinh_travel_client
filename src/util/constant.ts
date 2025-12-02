import {
  Cake,
  FileType,
  Map,
  Scale,
  ShoppingBag,
  SquareMenu,
  SquareTerminal,
} from 'lucide-react';

export const STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  DELETED: 'deleted',
};
export const STATUS_SHOP = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  DELETED: 'DELETED',
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
    title: 'Cửa hàng',
    url: '#',
    icon: ShoppingBag,
    page: 'admin',

    items: [
      {
        title: 'Danh sách cửa hàng',
        url: '/quan-ly/cua-hang',
      },
      {
        title: 'Duyệt đơn mở cửa hàng',
        url: '/quan-ly/cua-hang/duyet-don',
      },
      {
        title: 'Tạo mới chợ',
        url: '/quan-ly/cua-hang/tao-moi',
      },
    ],
  },
  {
    title: 'Đặc sản',
    url: '#',
    icon: Cake,
    page: 'admin',

    items: [
      {
        title: 'Danh sách đặc sản',
        url: '/quan-ly/dac-san',
      },
   
      {
        title: 'Tạo mới đặc sản',
        url: '/quan-ly/dac-san/tao-moi',
      },
    ],
  },
  {
    title: 'Đơn vị tính',
    url: '#',
    icon: Scale, // Hoặc dùng Ruler (thước) / Container (thùng hàng)
    page: 'admin',

    items: [
      {
        title: 'Danh sách đơn vị',
        url: '/quan-ly/don-vi-tinh',
      },
      {
        title: 'Tạo mới đơn vị',
        url: '/quan-ly/don-vi-tinh/tao-moi',
      },
    ],
  },
  {
    title: 'Cửa hàng',
    url: '#',
    icon: ShoppingBag,
    page: 'shop',
    items: [
      {
        title: 'Danh sách cửa hàng',
        url: '/quan-ly-cua-hang',
      },
    ],
  },
] as const; // 👈 Dòng này là chìa khóa để giải quyết lỗi
