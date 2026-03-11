import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ProgressPayload {
  studentId: string;
  courseLevel: string;
  lessonId: string;
  completed: boolean;
  watchedSeconds: number;
}

function isValidProgressPayload(body: unknown): body is ProgressPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.studentId === 'string' &&
    typeof b.courseLevel === 'string' &&
    typeof b.lessonId === 'string' &&
    typeof b.completed === 'boolean' &&
    typeof b.watchedSeconds === 'number'
  );
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isValidProgressPayload(body)) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid progress payload',
            details: [
              { field: 'studentId', issue: 'Must be a string' },
              { field: 'courseLevel', issue: 'Must be a string' },
              { field: 'lessonId', issue: 'Must be a string' },
              { field: 'completed', issue: 'Must be a boolean' },
              { field: 'watchedSeconds', issue: 'Must be a number' },
            ],
          },
        },
        { status: 400 },
      );
    }

    // In production this would persist to a database.
    // The client mirrors progress to localStorage for offline-first support.
    return NextResponse.json({
      data: {
        success: true,
        studentId: body.studentId,
        courseLevel: body.courseLevel,
        lessonId: body.lessonId,
        completed: body.completed,
        watchedSeconds: body.watchedSeconds,
        savedAt: new Date().toISOString(),
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
