import Header from "@/components/layout/Header";
import { IDistricts } from "@/interfaces/IAddress";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const districts: IDistricts[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/address/districts?province_code=42`,
    { cache: "no-store" } // hoặc "force-cache" nếu muốn cache
  ).then((res) => res.json())

  return (
    <>
      <Header districts={districts} />
      <div className="container pt-20">{children}</div>
    </>
  );
}
