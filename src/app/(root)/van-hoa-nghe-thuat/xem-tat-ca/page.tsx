import ListArt from "@/model/art/ListArt";
import AttractionList from "@/model/attraction/AttractionList";
import ListFood from "@/model/food/ListFood";

export default async function page() {
   const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/art?limit=4`,
    { cache: 'no-store' }
  );
  const data = await res.json();

  return (
    <div>
      <ListArt art={data.data} />
    </div>
  );
}
