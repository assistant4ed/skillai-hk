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

interface CoursesFileData {
  courses: unknown[];
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const dataPath = path.join(process.cwd(), 'data', 'courses-full.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const parsed = JSON.parse(raw) as CoursesFileData;
    const courses = parsed.courses ?? [];

    return NextResponse.json({
      data: courses,
      error: null,
      meta: { total: courses.length },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
