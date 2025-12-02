// app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';

// Map ngôn ngữ - QUAN TRỌNG: Phải dùng zh-CN thay vì zh
const langMap: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN', // ← Fix ở đây: zh-CN thay vì zh
  vi: 'vi'
};

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || targetLang === 'vi') {
      return NextResponse.json({ text: text });
    }

    // Lấy language code đúng
    const targetCode = langMap[targetLang] || targetLang;

    // Hỗ trợ dịch mảng (Batch)
    if (Array.isArray(text)) {
       const results = await Promise.all(
          text.map((t: string) => {
            if (!t || t.trim().length < 2) return Promise.resolve(t);
            
            return translate(t, { to: targetCode })
              .then((res: any) => res.text)
              .catch((err: any) => {
                console.error('Translation failed:', err);
                return t; // Fallback về text gốc
              });
          })
       );
       return NextResponse.json({ text: results });
    }

    // Dịch đơn lẻ
    const res: any = await translate(text, { to: targetCode });
    return NextResponse.json({ text: res.text });

  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json({ 
      text: Array.isArray((await req.json()).text) ? (await req.json()).text : '',
      error: error.message 
    }, { status: 500 });
  }
}