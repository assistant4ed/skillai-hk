import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillAI.hk — AI 技能培訓平台',
  description: '系統化 AI 技能培訓：從入門到架構師。2,800+ 學員完成課程，92% 推薦率。提供 Prompt Engineering、AI Agent 開發、OpenClaw 等實戰課程。',
  authors: [{ name: 'SkillAI.hk' }],
  manifest: '/site.webmanifest',
  keywords: ['AI 課程', 'AI 培訓', 'Prompt Engineering', 'AI Agent', 'OpenClaw 課程', 'LangChain', 'ChatGPT 教學', '香港 AI 培訓', 'SkillAI'],
  creator: 'SkillAI.hk',
  publisher: 'SkillAI.hk',
  robots: 'index, follow',
  openGraph: {
    title: 'SkillAI.hk — AI 技能培訓平台',
    description: '系統化 AI 技能培訓，2,800+ 學員信賴。從零基礎到架構師的完整學習路徑。',
    url: 'https://skillai.hk',
    siteName: 'SkillAI.hk',
    locale: 'zh_HK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillAI.hk — AI 技能培訓平台',
    description: '系統化 AI 技能培訓，2,800+ 學員信賴',
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'SkillAI.hk',
          description: 'AI 技能培訓平台',
          url: 'https://skillai.hk',
        })}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
