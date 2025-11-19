import { IShop } from './IShop';

interface Shop {
  _id: IShop; // nếu có thể nhận _id thuần: IProvinces | string
  
}
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  contact?: {
    phone?: string;
    facebook?: string;
    zalo?: string;
  };
  shopId: IShop;
  image?: string;
  list_image: string[];
}
