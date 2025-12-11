import { IUser } from './IUser';
import { ICategory } from './ICategory';

import { IShop } from './IShop';
import { IProvinces, IWards } from './IAddress';
interface Address {
  provinceId: IProvinces; // nếu có thể nhận _id thuần: IProvinces | string
  
  wardId: IWards;
  detail?: string;
}

export interface ISellerApplication {
  _id: string;

  userId: IUser;

  status: 'pending' | 'approved' | 'rejected';

  shopDraft: {
    name: string;
    categoryId: ICategory ;
    image?: string;
    address: Address;
    contact?: {
      phone?: string;
      facebook?: string;
      zalo?: string;
    };
    documents?: string[];
  };

  reviewedBy?: IUser;
  reviewedAt?: string | Date | null;
  rejectReason?: string | null;

  shopId?: IShop | string | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
