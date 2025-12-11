import { IAttraction } from "@/interfaces/IAttraction";


export function mapRawDataToattraction(rawData: any[]): IAttraction [] {
    return rawData.map((item) => ({
      _id: item._id,
      name: item.name,
      image: item.image,
      list_image: item.list_image,
      description: item.description,
      categoryId: item.categoryId?._id || '',
      typeId: item.typeId?._id || '',
      address: {
        provinceId: item.address?.provinceId?.name || '',
        
        wardId: item.address?.wardId?.name || '',
        detail: item.address?.detail || '',
      },
      status: item.status,
      isFree: item.isFree,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      createdBy: item.createdBy?.username || '',
      mapUrl: item.mapUrl,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      slug: item.slug,
      openTime: item.openTime,
      closeTime: item.closeTime,
  
      // 👇️ These two can be optionally added if you're also using them in UI
      categoryName: item.categoryId?.name || '',
      typeName: item.typeId?.name || '',
    }));
  }
  