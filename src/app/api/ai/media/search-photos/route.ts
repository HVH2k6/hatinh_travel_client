// app/api/media/search-photos/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PEXELS_URL = 'https://api.pexels.com/v1/search';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const query = String(body?.query || '').trim();
    if (!query) return NextResponse.json({ photos: [] });

    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing PEXELS_API_KEY on server' },
        { status: 500 }
      );
    }

    // Optional params
    const perPage = clamp(Number(body?.perPage ?? 4), 1, 12); // Pexels max 80, ta giới hạn UI ở mức vừa
    const page = Math.max(1, Number(body?.page ?? 1));
    const orientation = body?.orientation as 'landscape' | 'portrait' | 'square' | undefined;
    const size = body?.size as 'large' | 'medium' | 'small' | undefined;
    const locale = (body?.locale as string) || 'vi-VN';

    const params = new URLSearchParams({
      query,
      per_page: String(perPage),
      page: String(page),
      locale,
    });
    if (orientation) params.set('orientation', orientation);
    if (size) params.set('size', size);

    const resp = await fetch(`${PEXELS_URL}?${params.toString()}`, {
      headers: { Authorization: apiKey },
      cache: 'no-store',
    });

    if (!resp.ok) {
      const raw = await resp.text();
      return NextResponse.json(
        { error: 'Pexels error', status: resp.status, raw },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const photos =
      data?.photos?.map((p: any) => ({
        // ưu tiên ảnh lớn, fallback hợp lý
        src:
          p?.src?.large ||
          p?.src?.large2x ||
          p?.src?.landscape ||
          p?.src?.medium ||
          p?.src?.original,
        alt: p?.alt || '',
        author: p?.photographer || '',
        link: p?.url || '',
        width: p?.width,
        height: p?.height,
      })) || [];

    return NextResponse.json({ photos, total: data?.total_results ?? 0, page, perPage });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
