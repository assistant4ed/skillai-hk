import { notFound } from 'next/navigation';
import coursesData from '@/data/courses-full.json';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ level: string }>;
}

export default async function LearnLayout({ children, params }: LayoutProps) {
  const { level } = await params;
  const course = (coursesData.courses as Array<{ level: string }>).find(
    (c) => c.level === level,
  );

  if (!course) notFound();

  return <>{children}</>;
}
