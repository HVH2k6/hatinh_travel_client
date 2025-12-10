import AttractionList from "@/model/attraction/AttractionList";

export default async function page() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attractions?limit=24`,
    { cache: 'no-store' }
  );
  const data = await response.json();

  return (
    <div>
      <AttractionList data={data.data} />
    </div>
  );
}
