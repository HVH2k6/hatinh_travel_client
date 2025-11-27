import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text) return NextResponse.json({ text: '' });

    // Hỗ trợ dịch mảng (Batch)
    if (Array.isArray(text)) {
       const results = await Promise.all(
          text.map(t => translate(t, { to: targetLang }).then(res => res.text).catch(() => t))
       );
       return NextResponse.json({ text: results });
    }

    const res = await translate(text, { to: targetLang });
    return NextResponse.json({ text: res.text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}