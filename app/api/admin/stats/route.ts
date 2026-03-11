import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function isAdminAuthed(req: NextRequest): boolean {
  return req.cookies.get('admin_auth')?.value === 'true';
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    { data: null, error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
    { status: 401 },
  );
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const dataPath = path.join(process.cwd(), 'data', 'admin-stats.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const stats = JSON.parse(raw) as unknown;

    return NextResponse.json({ data: stats, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
