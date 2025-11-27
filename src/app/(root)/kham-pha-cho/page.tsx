import ListCard from '@/components/shop/Card';


export default async function Page() {
  // Fetch data
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/shops`, {
    cache: 'no-store',
  });
  
  const result = await res.json();
  
  // Giả sử API trả về { message: "...", data: [...] }
  const shopsData = result.data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Danh sách các chợ</h1>
      {/* Truyền prop 'data' vào ListCard */}
      <ListCard data={shopsData} />
    </div>
  );
}