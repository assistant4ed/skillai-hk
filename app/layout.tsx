import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://skillai.hk'),
  title: {
    default: 'SkillAI.hk — 香港 AI 技能培訓平台 | AI課程 · Prompt教學 · Agent開發',
    template: '%s | SkillAI.hk',
  },
  description: '香港首個系統化 AI 技能培訓平台。提供 Prompt Engineering、AI Agent 開發、ChatGPT/Claude 實戰課程。零基礎到架構師完整學習路徑，2,800+ 學員完成，92% 推薦率。',
  authors: [{ name: 'SkillAI.hk', url: 'https://skillai.hk' }],
  manifest: '/site.webmanifest',
  keywords: [
    'AI課程', 'AI培訓', '香港AI課程', 'AI教學',
    'Prompt Engineering', 'Prompt Engineering 教學', 'Prompt技巧',
    'AI Agent', 'AI Agent 開發', 'OpenClaw',
    'ChatGPT 教學', 'Claude 教學', 'Gemini 教學',
    'LangChain', 'AI 圖片生成', 'AI 工具',
    '人工智能課程', '機器學習入門',
    'SkillAI', 'skillai.hk',
    '香港 AI 培訓', 'Hong Kong AI training',
  ],
  creator: 'SkillAI.hk',
  publisher: 'DeFiner Tech Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://skillai.hk',
    languages: {
      'zh-HK': 'https://skillai.hk',
      'zh-TW': 'https://skillai.hk',
      'en': 'https://skillai.hk',
    },
  },
  openGraph: {
    title: 'SkillAI.hk — 香港 AI 技能培訓平台',
    description: '系統化 AI 技能培訓，2,800+ 學員信賴。Prompt Engineering · AI Agent · ChatGPT/Claude 實戰課程。',
    url: 'https://skillai.hk',
    siteName: 'SkillAI.hk',
    locale: 'zh_HK',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SkillAI.hk AI 技能培訓平台' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillAI.hk — 香港 AI 技能培訓平台',
    description: '系統化 AI 技能培訓。Prompt Engineering · AI Agent · ChatGPT/Claude 實戰。',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  verification: {
    google: 'pending-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="canonical" href="https://skillai.hk" />
        {/* Google Tag Manager — replace GTM-XXXXXXX with actual ID after setup */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PLACEHOLDER');` }} />
        {/* Google Analytics 4 — replace G-XXXXXXX with actual ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PLACEHOLDER');` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'SkillAI.hk',
          description: '香港首個系統化 AI 技能培訓平台',
          url: 'https://skillai.hk',
          logo: 'https://skillai.hk/logo.svg',
          sameAs: [],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hong Kong',
            addressCountry: 'HK',
          },
          areaServed: {
            '@type': 'GeoCircle',
            geoMidpoint: { '@type': 'GeoCoordinates', latitude: 22.3193, longitude: 114.1694 },
          },
          hasOfferingCatalog: {
            '@type': 'OfferingCatalog',
            name: 'AI 課程',
            itemListElement: [
              { '@type': 'Course', name: 'AI 入門：零基礎開始', description: '適合完全冇 AI 經驗嘅人', provider: { '@type': 'Organization', name: 'SkillAI.hk' } },
              { '@type': 'Course', name: 'Prompt Engineering 實戰', description: '掌握同 AI 溝通嘅核心技巧', provider: { '@type': 'Organization', name: 'SkillAI.hk' } },
              { '@type': 'Course', name: 'AI Agent 開發', description: '用 OpenClaw 建立自動化 AI Agent', provider: { '@type': 'Organization', name: 'SkillAI.hk' } },
            ],
          },
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'SkillAI.hk',
          url: 'https://skillai.hk',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://skillai.hk/friends?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        })}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PLACEHOLDER" height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>
        {children}
      </body>
    </html>
  );
}
