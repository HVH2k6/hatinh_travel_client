import { Map, SquareMenu, SquareTerminal } from "lucide-react";

export const STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    DELETED: 'deleted',
};

export const getProvinces = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/province`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if(!data) return [];
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
  export const menuSidebarAdmin=[
    {
      title: 'Địa điểm du lịch',
      url: '#',
      icon: Map,
      
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
    }
  ] 