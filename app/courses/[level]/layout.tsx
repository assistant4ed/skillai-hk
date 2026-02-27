export function generateStaticParams() {
  return [
    { level: 'bronze' },
    { level: 'silver' },
    { level: 'gold' },
    { level: 'platinum' },
    { level: 'openclaw' },
  ];
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
