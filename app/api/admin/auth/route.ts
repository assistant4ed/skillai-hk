import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'skillai2026';

function passwordsMatch(input: string, expected: string): boolean {
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const { password } = body as Record<string, unknown>;

  if (typeof password !== 'string' || !passwordsMatch(password, ADMIN_PASSWORD)) {
    return NextResponse.json(
      { error: { code: 'WRONG_PASSWORD', message: '密碼錯誤' } },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_auth');
  return response;
}
