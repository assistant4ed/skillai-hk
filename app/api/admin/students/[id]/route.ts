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

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
  method: string;
}

interface Student {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  avatar: string;
  level: string;
  enrolledAt: string;
  courses: string[];
  progress: Record<string, number>;
  status: string;
  source: string;
  notes: string;
  tags: string[];
  company: string;
  payments: Payment[];
  lastActive: string;
  totalSpent: number;
}

interface StudentsData {
  students: Student[];
}

type PatchableFields = Pick<Student, 'notes' | 'status' | 'tags' | 'phone' | 'company' | 'source'>;

function readStudentsData(): Student[] {
  const dataPath = path.join(process.cwd(), 'data', 'students.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(raw) as StudentsData;
  return parsed.students;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const { id } = await params;
    const students = readStudentsData();
    const student = students.find((s) => s.id === id);

    if (!student) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: `Student ${id} not found` } },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: student, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const { id } = await params;
    const students = readStudentsData();
    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: `Student ${id} not found` } },
        { status: 404 },
      );
    }

    const body = (await req.json()) as Partial<PatchableFields>;

    const ALLOWED_PATCH_FIELDS: Array<keyof PatchableFields> = [
      'notes',
      'status',
      'tags',
      'phone',
      'company',
      'source',
    ];

    const invalidFields = Object.keys(body).filter(
      (key) => !ALLOWED_PATCH_FIELDS.includes(key as keyof PatchableFields),
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'One or more fields cannot be updated via this endpoint',
            details: invalidFields.map((field) => ({
              field,
              issue: 'Field is not patchable',
            })),
          },
        },
        { status: 422 },
      );
    }

    const updated: Student = { ...students[studentIndex], ...body };

    // In production this would persist to a database.
    // For now we return the merged record.
    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
