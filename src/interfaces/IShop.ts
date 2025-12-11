import { ICategory } from "./ICategory";
import { IUser } from "./IUser";
import { IProvinces, IWards } from "./IAddress";

export interface IShop {
  _id: string;
  name: string;
  slug?: string;
  description?: string;

  image?: string;
  images?: string[];

  categoryId: ICategory ;
  sellerId: IUser ;

  address: {
    provinceId: IProvinces ;
    
    wardId: IWards ;
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
