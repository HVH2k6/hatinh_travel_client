import { IDistricts, IProvinces, IWards } from './IAddress';

interface Address {
  provinceId: IProvinces; // nếu có thể nhận _id thuần: IProvinces | string
  districtId: IDistricts;
  wardId: IWards;
  detail?: string;
}
export interface IFood {
  _id: string;
  name: string;
  image: string;
  list_image: string[];
  description: string;
  ingredients: string;
  price: number;

  address: Address;
  slug: string;
  createdAt: Date;
}
