interface Address {
    provinceId:string,
    wardId:string,
    districtId:string
    detail?:string

}

export interface IDestination {
name:string,
image:string,
list_image:[string],
description:string,
categoryId:string,
typeId:string,
address:Address,
status:string,
isFree:boolean,
minPrice:number,
maxPrice:number,
createdBy:string,
mapUrl:string,
createdAt:Date,
updatedAt:Date,
slug:string

}