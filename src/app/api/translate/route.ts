import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text) return NextResponse.json({ text: '' });

    // Hỗ trợ dịch mảng (Batch)
    if (Array.isArray(text)) {
       const results = await Promise.all(
          text.map((t: any) => 
             translate(t, { to: targetLang })
             .then((res: any) => res.text) // Đã thêm (res: any) để sửa lỗi
             .catch(() => t)
          )
       );
       return NextResponse.json({ text: results });
    }

    // Dịch đơn lẻ
    // Thêm : any vào đây luôn cho chắc ăn
    const res: any = await translate(text, { to: targetLang });
    return NextResponse.json({ text: res.text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}