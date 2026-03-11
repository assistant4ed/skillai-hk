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

const VALID_STATUSES = ['planning', 'scripting', 'recording', 'editing', 'review', 'published'] as const;
type VideoStatus = (typeof VALID_STATUSES)[number];

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
type VideoPriority = (typeof VALID_PRIORITIES)[number];

interface Video {
  id: string;
  title: string;
  course: string;
  module: string;
  status: VideoStatus;
  assignedTo: string;
  script: string;
  duration: string;
  dueDate: string;
  priority: VideoPriority;
  pptFile: string | null;
  notes: string;
  reviewers: string[];
  tags: string[];
  youtubeUrl?: string;
  views?: number;
  rating?: number;
}

interface VideoQueueStats {
  totalVideos: number;
  byStatus: Record<string, number>;
  urgentCount: number;
  highPriorityCount: number;
  dueSoon: string[];
}

interface VideoQueueData {
  videos: Video[];
  stats: VideoQueueStats;
}

function readVideoData(): VideoQueueData {
  const dataPath = path.join(process.cwd(), 'data', 'video-queue.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as VideoQueueData;
}

function generateVideoId(videos: Video[]): string {
  const maxNum = videos.reduce((max, v) => {
    const num = parseInt(v.id.replace('VID-', ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `VID-${String(maxNum + 1).padStart(3, '0')}`;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauthorized();

  try {
    const { videos, stats } = readVideoData();

    const queue = videos.filter((v) => v.status !== 'published');
    const published = videos.filter((v) => v.status === 'published');

    return NextResponse.json({
      data: { queue, published, stats },
      error: null,
      meta: {
        totalQueue: queue.length,
        totalPublished: published.length,
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
    const body = (await req.json()) as Partial<Video>;

    if (!body.title || !body.course) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Missing required fields',
            details: [
              ...(!body.title ? [{ field: 'title', issue: 'Required' }] : []),
              ...(!body.course ? [{ field: 'course', issue: 'Required' }] : []),
            ],
          },
        },
        { status: 400 },
      );
    }

    const { videos } = readVideoData();

    const newVideo: Video = {
      id: generateVideoId(videos),
      title: body.title,
      course: body.course,
      module: body.module ?? '',
      status: VALID_STATUSES.includes(body.status as VideoStatus) ? (body.status as VideoStatus) : 'planning',
      assignedTo: body.assignedTo ?? '',
      script: body.script ?? '',
      duration: body.duration ?? '',
      dueDate: body.dueDate ?? '',
      priority: VALID_PRIORITIES.includes(body.priority as VideoPriority)
        ? (body.priority as VideoPriority)
        : 'medium',
      pptFile: body.pptFile ?? null,
      notes: body.notes ?? '',
      reviewers: body.reviewers ?? [],
      tags: body.tags ?? [],
      ...(body.youtubeUrl ? { youtubeUrl: body.youtubeUrl } : {}),
    };

    // In production this would persist to a database.
    return NextResponse.json(
      { data: newVideo, error: null },
      { status: 201, headers: { Location: `/api/admin/videos/${newVideo.id}` } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
