import { IDistricts, IProvinces, IWards } from "./IAddress";
import { ICategory } from "./ICategory";
interface Address {
  provinceId: IProvinces; // nếu có thể nhận _id thuần: IProvinces | string
  districtId: IDistricts;
  wardId: IWards;
  detail?: string;
}

export interface IArt{
    _id: string;
    name: string;
    image: string;
    description: string;
    list_image: string[];
    video_url: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    categoryId:ICategory,
    address:Address
}