import { IProvinces, IWards } from './IAddress';
import { ICategory } from './ICategory';
import { IType } from './IType';
import { IUser } from './IUser';

type IsoDate = string; // e.g. "2025-07-03T12:54:14.993Z"
type TimeLike = Date | string | null; // Date, ISO string, hoặc "HH:mm"

interface Address {
  provinceId: IProvinces; // nếu có thể nhận _id thuần: IProvinces | string

  wardId: IWards;
  detail?: string;
}

export interface IAttraction {
  _id: string;
  name: string;
  image: string;
  list_image: string[]; // ✅ sửa từ [string] -> string[]
  description: string;
  categoryId: ICategory; // nếu đôi lúc không populate: ICategory | string
  typeId: IType; // nếu đôi lúc không populate: IType | string
  address: Address;
  status: 'ACTIVE' | 'PENDING' | 'DELETED';
  isFree: boolean;
  minPrice: number;
  maxPrice: number;

  /** ⏰ mới thêm */
  openTime?: TimeLike; // Date | ISO string | "HH:mm" | null
  closeTime?: TimeLike; // Date | ISO string | "HH:mm" | null

  createdBy: IUser; // nếu đôi lúc chỉ trả _id: IUser | string | null
  mapUrl?: string;
  createdAt: Date | IsoDate;
  updatedAt: Date | IsoDate;
  slug: string;
}
