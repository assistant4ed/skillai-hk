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

function readStudentsData(): Student[] {
  const dataPath = path.join(process.cwd(), 'data', 'students.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(raw) as StudentsData;
  return parsed.students;
}

function generateStudentId(students: Student[]): string {
  const maxNum = students.reduce((max, s) => {
    const num = parseInt(s.id.replace('STU-', ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `STU-${String(maxNum + 1).padStart(3, '0')}`;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() ?? '';
    const level = searchParams.get('level') ?? '';
    const status = searchParams.get('status') ?? '';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10)));

    let students = readStudentsData();

    if (search) {
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.nameEn.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.company.toLowerCase().includes(search) ||
          s.id.toLowerCase().includes(search),
      );
    }

    if (level) {
      students = students.filter((s) => s.level === level);
    }

    if (status) {
      students = students.filter((s) => s.status === status);
    }

    const total = students.length;
    const offset = (page - 1) * limit;
    const paginated = students.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      error: null,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: offset + limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const body = (await req.json()) as Partial<Student>;

    if (!body.name || !body.email || !body.level) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Missing required fields',
            details: [
              ...(!body.name ? [{ field: 'name', issue: 'Required' }] : []),
              ...(!body.email ? [{ field: 'email', issue: 'Required' }] : []),
              ...(!body.level ? [{ field: 'level', issue: 'Required' }] : []),
            ],
          },
        },
        { status: 400 },
      );
    }

    const students = readStudentsData();

    const isDuplicateEmail = students.some((s) => s.email === body.email);
    if (isDuplicateEmail) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'CONFLICT',
            message: 'A student with this email already exists',
          },
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString().split('T')[0];
    const newStudent: Student = {
      id: generateStudentId(students),
      name: body.name,
      nameEn: body.nameEn ?? '',
      email: body.email,
      phone: body.phone ?? '',
      avatar: body.nameEn
        ? body.nameEn
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : body.name.slice(0, 2),
      level: body.level,
      enrolledAt: body.enrolledAt ?? now,
      courses: body.courses ?? [body.level],
      progress: body.progress ?? {},
      status: body.status ?? 'pending',
      source: body.source ?? '',
      notes: body.notes ?? '',
      tags: body.tags ?? [],
      company: body.company ?? '',
      payments: body.payments ?? [],
      lastActive: now,
      totalSpent: body.totalSpent ?? 0,
    };

    // In production this would persist to a database.
    // For now we return the constructed record with 201.
    return NextResponse.json(
      { data: newStudent, error: null },
      { status: 201, headers: { Location: `/api/admin/students/${newStudent.id}` } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
