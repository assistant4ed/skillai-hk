import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'posts.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      return NextResponse.json(data);
    }
    return NextResponse.json({ posts: [], lastUpdated: null });
  } catch {
    return NextResponse.json({ posts: [], lastUpdated: null });
  }
}
