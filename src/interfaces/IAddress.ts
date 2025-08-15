export interface IProvinces {
  _id: string;
  name: string;
  code: number;
  codename: string;
  division_type: string;
  
}
export interface IDistricts {
  _id: string;
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
}
export interface IWards {
 _id: string;
 code: number;
 name: string;
 codename: string;
 division_type: string;
 district_code: number;
}