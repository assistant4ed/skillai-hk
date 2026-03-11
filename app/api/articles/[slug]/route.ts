import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!SAFE_SLUG.test(slug)) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  try {
    const articlePath = path.join(process.cwd(), 'data', 'articles', `${slug}.json`);
    if (fs.existsSync(articlePath)) {
      const article = JSON.parse(fs.readFileSync(articlePath, 'utf-8'));
      return NextResponse.json(article);
    }

    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}
