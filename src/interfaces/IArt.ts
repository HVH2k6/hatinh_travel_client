import { ICategory } from "./ICategory";

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
    categoryId:ICategory
}