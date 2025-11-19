import { IUser } from './IUser';
import { ICategory } from './ICategory';
import { IDistricts, IProvinces, IWards } from './IAddress';
import { IShop } from './IShop';
interface Address {
  provinceId: IProvinces; // nếu có thể nhận _id thuần: IProvinces | string
  districtId: IDistricts;
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
