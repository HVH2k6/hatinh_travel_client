import { ICategory } from "./ICategory";
import { IUser } from "./IUser";
import { IProvinces, IDistricts, IWards } from "./IAddress";

export interface IShop {
  _id: string;
  name: string;
  slug?: string;
  description?: string;

  image?: string;
  images?: string[];

  categoryId: ICategory | string;
  sellerId: IUser | string;

  address: {
    provinceId: IProvinces | string;
    districtId: IDistricts | string;
    wardId: IWards | string;
    detail?: string;
  };

  contact?: {
    phone: string;
    facebook?: string;
    zalo?: string;
  };

  ratingAvg?: number;
  ratingCount?: number;

  status?: "pending" | "active" | "suspended";
  documents?: string[];
  isDeleted?: boolean;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
