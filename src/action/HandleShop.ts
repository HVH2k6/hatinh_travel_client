"use server";
import { revalidateTag } from "next/cache";

export async function HandleCreateSellerApplication(data: any) {
  try {
    const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!baseURL) throw new Error("Missing API_URL");

    // ⚠️ Kiểm tra lại path này có đúng với router của bạn không:
    // ví dụ đúng: `${baseURL}/seller-application/seller-applications`
    const url = `${baseURL}/sellerapplication/seller-applications`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    // cố gắng parse JSON, fallback text/null
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      // ignore
    }

    if (!res.ok) {
      const e: any = new Error(
        json?.message || json?.error || "Failed to create seller application"
      );
      e.status = res.status;
      e.body = json;
      throw e;
    }

    revalidateTag("seller-applications");
    return json;
  } catch (err) {
    console.error("🚨 HandleCreateSellerApplication error:", err);
    throw err; // QUAN TRỌNG: giữ nguyên để client bắt được e.status
  }
}
