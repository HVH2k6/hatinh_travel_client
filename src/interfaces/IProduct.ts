import { IShop } from './IShop';
import { IUnit } from './IUnit';

interface Shop {
  _id: IShop; // nếu có thể nhận _id thuần: IProvinces | string
  
}
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  unitId:IUnit
  description: string;
  shopId: IShop;
  image?: string;
  list_image: string[];
}
