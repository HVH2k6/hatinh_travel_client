export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    parentId: string | null;
}