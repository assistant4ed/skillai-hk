import type { Metadata } from 'next';

const COURSE_META: Record<string, { title: string; description: string }> = {
  bronze: {
    title: 'Bronze — AI 效率實戰班',
    description: '4 週用 Claude + n8n 建立自動化工作流。零基礎友善，每堂課都有即時可用的產出。',
  },
  silver: {
    title: 'Silver — AI 應用開發班',
    description: '8 週用 Claude Code + Cursor 從零開發 AI 應用。學會用 AI 寫代碼，跳過傳統學習曲線。',
  },
  gold: {
    title: 'Gold — AI 系統架構師班',
    description: '12 週深入 RAG、多 Agent 編排、MCP Server 和生產級部署。設計企業級 AI 系統。',
  },
  openclaw: {
    title: 'OpenClaw — 全方位課程',
    description: '10 週從安裝到企業部署 OpenClaw。Skill 開發、多 Agent 編排、多平台整合一次學完。',
  },
  platinum: {
    title: 'Platinum — AI 創業實戰班',
    description: '16 週把 AI 產品想法變成上線的 SaaS。涵蓋開發、付款、增長到投資人路演。',
  },
};

export function generateStaticParams() {
  return [
    { level: 'bronze' },
    { level: 'silver' },
    { level: 'gold' },
    { level: 'platinum' },
    { level: 'openclaw' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const meta = COURSE_META[level];

  if (!meta) {
    return { title: 'AI 課程' };
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | SkillAI.hk`,
      description: meta.description,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | SkillAI.hk`,
      description: meta.description,
      images: ['/og-image.png'],
    },
  };
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
