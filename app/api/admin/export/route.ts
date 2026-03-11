import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function isAdminAuthed(req: NextRequest): boolean {
  return req.cookies.get('admin_auth')?.value === 'true';
}

const CSV_CONTENT_TYPE = 'text/csv; charset=utf-8';

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
  level: string;
  enrolledAt: string;
  status: string;
  company: string;
  source: string;
  totalSpent: number;
  payments: Payment[];
  lastActive: string;
}

interface StudentsData {
  students: Student[];
}

interface RevenueByMonth {
  month: string;
  revenue: number;
  newStudents: number;
  churnedStudents: number;
}

interface AdminStats {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalStudents: number;
    activeStudents: number;
  };
  revenueByMonth: RevenueByMonth[];
  revenueByLevel: Record<string, number>;
}

function escapeCsvField(value: string | number | null | undefined): string {
  const str = String(value ?? '');
  const needsQuoting = str.includes(',') || str.includes('"') || str.includes('\n');
  if (!needsQuoting) return str;
  return `"${str.replace(/"/g, '""')}"`;
}

function buildStudentsCsv(students: Student[]): string {
  const header = 'ID,Name,Name (EN),Email,Phone,Level,Status,Company,Source,Enrolled Date,Last Active,Total Spent (HKD)';
  const rows = students.map((s) =>
    [
      s.id,
      s.name,
      s.nameEn,
      s.email,
      s.phone,
      s.level,
      s.status,
      s.company,
      s.source,
      s.enrolledAt,
      s.lastActive,
      s.totalSpent,
    ]
      .map(escapeCsvField)
      .join(','),
  );
  return [header, ...rows].join('\n');
}

function buildRevenueCsv(stats: AdminStats): string {
  const overview = [
    'Metric,Value',
    `Total Revenue (HKD),${stats.overview.totalRevenue}`,
    `Monthly Revenue (HKD),${stats.overview.monthlyRevenue}`,
    `Total Students,${stats.overview.totalStudents}`,
    `Active Students,${stats.overview.activeStudents}`,
    '',
  ].join('\n');

  const monthlyHeader = 'Month,Revenue (HKD),New Students,Churned Students';
  const monthlyRows = stats.revenueByMonth
    .map((m) => [m.month, m.revenue, m.newStudents, m.churnedStudents].map(escapeCsvField).join(','))
    .join('\n');

  const levelHeader = '\nLevel,Revenue (HKD)';
  const levelRows = Object.entries(stats.revenueByLevel)
    .map(([level, revenue]) => `${escapeCsvField(level)},${escapeCsvField(revenue)}`)
    .join('\n');

  return [overview, monthlyHeader, monthlyRows, levelHeader, levelRows].join('\n');
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json(
      { data: null, error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' } },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type || !['students', 'revenue'].includes(type)) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_FAILED',
            message: "Query param 'type' must be 'students' or 'revenue'",
          },
        },
        { status: 400 },
      );
    }

    if (type === 'students') {
      const dataPath = path.join(process.cwd(), 'data', 'students.json');
      const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as StudentsData;
      const csv = buildStudentsCsv(parsed.students);

      return new Response(csv, {
        headers: {
          'Content-Type': CSV_CONTENT_TYPE,
          'Content-Disposition': 'attachment; filename="students.csv"',
        },
      });
    }

    // type === 'revenue'
    const statsPath = path.join(process.cwd(), 'data', 'admin-stats.json');
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8')) as AdminStats;
    const csv = buildRevenueCsv(stats);

    return new Response(csv, {
      headers: {
        'Content-Type': CSV_CONTENT_TYPE,
        'Content-Disposition': 'attachment; filename="revenue.csv"',
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
