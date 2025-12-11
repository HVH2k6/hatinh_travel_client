import ChatWidget from "@/components/chat/ChatWidget";
import Header from "@/components/layout/Header";
import { IWards } from "@/interfaces/IAddress";



export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const wards: IWards[] = await fetch(
    `https://hatinh-travel-server.vercel.app/api/address/wards?province_code=42`,
    { cache: "no-store" } // hoặc "force-cache" nếu muốn cache
  ).then((res) => res.json())
  console.log("🚀 ~ MainLayout ~ wards:", wards)

  return (
    <>
      <Header wards={wards} />
      <div className="container pt-20">{children}</div>
      <ChatWidget/>
    </>
  );
}
