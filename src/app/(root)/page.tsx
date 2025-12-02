import HaTinhTourism from '@/components/info/InfoTravel';

export default async function page() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attractions`,
    { cache: 'no-store' }
  );
  const resFood = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/food?limit=4`, { cache: 'no-store' });
  console.log("🚀 ~ page ~ resFood:", resFood)
  const dataFood = await resFood.json();
  console.log("🚀 ~ page ~ dataFood:", dataFood)
  const data = await response.json();

  return <HaTinhTourism data={data.data} foods={dataFood.data}></HaTinhTourism>;
}
