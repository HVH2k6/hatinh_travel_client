// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

const PROTECTED: Array<{ prefix: string; roles?: string[] }> = [
  { prefix: '/quan-ly', roles: ['admin', 'seller'] },
  { prefix: '/admin',  roles: ['admin'] },
];

function findRule(pathname: string) {
  return PROTECTED.find((r) => pathname.startsWith(r.prefix));
}

async function fetchMe(accessToken: string) {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.user ?? null;
}

async function renewAccessToken(refreshToken: string) {
  const res = await fetch(`${API_BASE}/user/renew-access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.access_token as string) || null;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const rule = findRule(pathname);
  if (!rule) return NextResponse.next();

  const accessToken  = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // Chưa có token -> login
  if (!accessToken && !refreshToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/tai-khoan/dang-nhap';
    url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
    return NextResponse.redirect(url);
  }

  let user = accessToken ? await fetchMe(accessToken) : null;

  // Thử renew bằng refresh_token nếu accessToken không dùng được
  let newAccessToken: string | null = null;
  if (!user && refreshToken) {
    newAccessToken = await renewAccessToken(refreshToken);
    if (newAccessToken) {
      user = await fetchMe(newAccessToken);
    }
  }

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/tai-khoan/dang-nhap';
    url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`;
    return NextResponse.redirect(url);
  }

  if (rule.roles) {
    const roleName = String(user.roleId?.name || '').toLowerCase();
    const allow = rule.roles.map((r) => r.toLowerCase());
    if (!roleName || !allow.includes(roleName)) {
      const url = req.nextUrl.clone();
      url.pathname = '/403';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  // ✅ Ghi cả httpOnly và cookie đọc được bởi JS để đồng bộ với axios client
  if (newAccessToken) {
    res.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30,
    });
    res.cookies.set('access_token_js', newAccessToken, {
      httpOnly: false,          // cho JS đọc được
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30,
    });
  }

  return res;
}

export const config = {
  matcher: ['/quan-ly/:path*', '/admin/:path*'],
};
