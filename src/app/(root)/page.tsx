import AttractionList from "@/components/attraction/AttractionList";
import BannerAttraction from "@/components/attraction/Banner";


export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attractions`);
  const data = await response.json();
  

  

  return (
    <div>
      <BannerAttraction></BannerAttraction>
      <div className="mt-10">
        <AttractionList data={data.data || []}/>
      </div>
    
    </div>
  );
}
