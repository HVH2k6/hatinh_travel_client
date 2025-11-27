// Định nghĩa kiểu dữ liệu cho loại đơn vị (giống enum bên backend)
// Giúp VS Code gợi ý code (Intellisense) chính xác hơn
export type UnitType = 'weight' | 'volume' | 'count' | 'length' | 'area' | 'other';

export interface IUnit {
  _id: string;
  
  name: string;    // Ví dụ: Kilogam
  symbol: string;  // Ví dụ: kg
  
  type: UnitType;  // Phân loại
  order: number;   // Thứ tự hiển thị (0, 1, 2...)
  
  isActive: boolean; // Trạng thái
  
  createdAt: string; // JSON trả về từ API thường là string ISO
  updatedAt: string;
}