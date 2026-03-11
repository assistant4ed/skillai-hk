export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'refunded';
  method: string;
  course?: string;
}

export interface CourseProgress {
  name?: string;
  progress: number;
  completedDate?: string | null;
}

export interface Student {
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  phone?: string;
  avatar: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'openclaw';
  enrolledAt?: string;
  enrolledDate?: string;
  courses?: string[];
  progress?: Record<string, number> | number;
  status: 'active' | 'pending' | 'inactive' | 'refunded';
  source?: string;
  notes?: string;
  tags?: string[];
  company?: string;
  payments?: Payment[];
  lastActive?: string;
  totalSpent?: number;
}

export interface Slide {
  slideNum: number;
  title: string;
  content: string;
  bulletPoints: string[];
  notes: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'ppt' | 'quiz' | 'assignment';
  duration: string;
  status?: 'published' | 'draft' | 'upcoming';
  videoUrl?: string | null;
  views?: number;
  description?: string;
  pptSlides?: Slide[];
  slides?: Slide[];
  resources?: string[];
}

export interface Module {
  id: string;
  title: string;
  week?: number;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  level?: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  description?: string;
  color: string;
  icon?: string;
  price: number;
  totalStudents: number;
  completionRate?: number;
  revenue?: number;
  status?: 'published' | 'draft';
  duration?: string;
  totalLessons?: number;
  rating?: number;
  modules: Module[];
}

export interface Video {
  id: string;
  title: string;
  course: string;
  module?: string;
  status: 'planning' | 'scripting' | 'recording' | 'editing' | 'review' | 'published';
  assignedTo?: string;
  script?: string;
  duration?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  pptFile?: string | null;
  notes?: string;
  reviewers?: string[];
  tags?: string[];
  youtubeUrl?: string;
  views?: number;
  thumbnailUrl?: string;
}

export const LEVEL_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#D97706',
  platinum: '#7C3AED',
  openclaw: '#4169E1',
};

export const LEVEL_LABELS: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  openclaw: 'OpenClaw',
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: '活躍', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  pending: { label: '待確認', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  inactive: { label: '非活躍', color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  refunded: { label: '已退款', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};
