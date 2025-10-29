import { IUser } from './IUser';
import { ICategory } from './ICategory';
import { IDistricts, IProvinces, IWards } from './IAddress';
import { IShop } from './IShop';

export interface ISellerApplication {
  _id: string;

  userId: IUser| string;

  status: 'pending' | 'approved' | 'rejected';

  shopDraft: {
    name: string;
    categoryId: ICategory | string;
    image?: string;
    address: {
      provinceId: IProvinces | string;
      districtId: IDistricts | string;
      wardId: IWards | string;
      detail?: string;
    };
    contact?: {
      phone?: string;
      facebook?: string;
      zalo?: string;
    };
    documents?: string[];
  };

  reviewedBy?: IUser | string | null;
  reviewedAt?: string | Date | null;
  rejectReason?: string | null;

  shopId?: IShop | string | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
