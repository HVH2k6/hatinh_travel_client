import CreateAttraction from "@/model/attraction/CreateAttraction";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Tạo địa điểm du lịch',
  description: 'Trang tạo địa điểm du lịch',
};
export default function CreateAttractionPage() {
    return (
        <div className="">
            <CreateAttraction />
        </div>
    );
}




