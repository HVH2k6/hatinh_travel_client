import { IDistricts, IProvinces, IWards } from './IAddress';
import { ICategory } from './ICategory';
import { IType } from './IType';
import { IUser } from './IUser';

interface Address {
  provinceId: IProvinces;
  districtId: IDistricts;
  wardId: IWards;
  detail?: string;
}

export interface IAttraction {
  _id: string;
  name: string;
  image: string;
  list_image: [string];
  description: string;
  categoryId: ICategory;
  typeId: IType;
  address: Address;
  status: string;
  isFree: boolean;
  minPrice: number;
  maxPrice: number;
  createdBy: IUser;
  mapUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}
