// 1. Interface Tỉnh
export interface IProvinces {
  _id: string;
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code?: number; // Mới thêm (có thể có hoặc không)
  wards?: IWards[];    // Dành cho trường hợp bạn populate danh sách xã vào tỉnh
}

// 2. Interface Huyện -> ĐÃ XÓA (Delete)

// 3. Interface Xã/Phường
export interface IWards {
  _id: string;
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number; // Quan trọng: Link thẳng tới Tỉnh, thay vì district_code
}