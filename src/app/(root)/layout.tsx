import Header from "@/components/layout/Header";

import { IDistricts } from "@/interfaces/IAddress";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const districts: IDistricts[] = await fetch(
    `https://hatinh-travel-server.vercel.app/api/address/districts?province_code=42`,
    { cache: "no-store" } // hoặc "force-cache" nếu muốn cache
  ).then((res) => res.json())

  return (
    <>
      <Header districts={districts} />
      <div className="container pt-20">{children}</div>
    </>
  );
}
