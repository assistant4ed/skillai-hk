"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '../../components/Logo';

/* ── Post Types ── */
type PostType = 'article' | 'video' | 'tip' | 'news';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  type: PostType;
  date: string;
  readTime?: string;
  videoUrl?: string;
  image?: string;
  tags: string[];
}

/* ── Sample Posts (replace with CMS/MDX later) ── */
const posts: Post[] = [
  {
    id: 'openclaw-enterprise-2026',
    title: '企業點用 OpenClaw 建立 AI 團隊？2026 完整攻略',
    excerpt: 'OpenClaw 已經唔只係個人助手。Runlayer 推出企業版，支援 SOC 2、HIPAA，加上 ToolGuard 安全層。本文分析三種企業部署方案...',
    type: 'article',
    date: '2026-03-01',
    readTime: '8 分鐘',
    tags: ['OpenClaw', '企業 AI', '2026'],
  },
  {
    id: 'ai-image-gen-comparison',
    title: 'AI 圖片生成大比拼：Gemini 3 Pro vs DALL-E 4 vs Midjourney v7',
    excerpt: '實測三大 AI 圖片生成工具，用同一個 prompt 比較效果、速度、價格。邊個最適合你？',
    type: 'article',
    date: '2026-02-28',
    readTime: '5 分鐘',
    tags: ['圖片生成', 'Gemini', 'DALL-E', 'Midjourney'],
  },
  {
    id: 'prompt-engineering-tips',
    title: '5 個即學即用嘅 Prompt 技巧',
    excerpt: '唔使上堂都可以即刻提升你同 AI 嘅溝通效率。呢 5 個技巧我自己每日都用。',
    type: 'tip',
    date: '2026-02-25',
    readTime: '3 分鐘',
    tags: ['Prompt Engineering', '實用技巧'],
  },
  {
    id: 'trump-anthropic-ban',
    title: 'Trump 封殺 Anthropic：AI 軍事化政治博弈點解咁重要？',
    excerpt: '美國政府禁止使用 Anthropic 產品，OpenAI 即刻補位五角大樓。呢場 AI 倫理大戰對我哋有咩影響？',
    type: 'news',
    date: '2026-03-01',
    tags: ['AI 新聞', 'Anthropic', 'OpenAI', '政策'],
  },
  {
    id: 'first-ai-assistant-setup',
    title: '15 分鐘搭建你嘅第一個 AI 助手',
    excerpt: '用 OpenClaw 從零開始，15 分鐘內擁有一個 24/7 在線嘅 AI 個人助手。完整教學影片。',
    type: 'video',
    date: '2026-02-20',
    readTime: '15 分鐘',
    videoUrl: '#',
    tags: ['教學', 'OpenClaw', '入門'],
  },
];

const typeConfig: Record<PostType, { emoji: string; label: string; color: string; bg: string }> = {
  article: { emoji: '📝', label: '文章', color: '#3B82F6', bg: '#EFF6FF' },
  video: { emoji: '🎬', label: '影片', color: '#EF4444', bg: '#FEF2F2' },
  tip: { emoji: '💡', label: '快速技巧', color: '#F59E0B', bg: '#FFFBEB' },
  news: { emoji: '📰', label: '最新資訊', color: '#8B5CF6', bg: '#F5F3FF' },
};

/* ── Reveal Animation ── */
function R({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-30px' });
  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Post Card ── */
function PostCard({ post, index }: { post: Post; index: number }) {
  const tc = typeConfig[post.type];
  return (
    <R d={index * 0.08}>
      <article style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)'; }}
      >
        {/* Type Badge */}
        <div style={{ padding: '20px 20px 0' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: tc.bg, color: tc.color,
          }}>
            {tc.emoji} {tc.label}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '12px 20px 20px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: '#111' }}>
            {post.title}
          </h3>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {post.tags.map(tag => (
              <span key={tag} style={{
                padding: '2px 8px', borderRadius: 6, fontSize: 12,
                background: '#F3F4F6', color: '#6B7280',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#999' }}>
            <span>{post.date}</span>
            {post.readTime && <span>⏱ {post.readTime}</span>}
          </div>
        </div>
      </article>
    </R>
  );
}

/* ── Main Page ── */
export default function AIInsights() {
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px', background: '#fff', borderBottom: '1px solid #eee',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size="sm" showText={false} />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>SkillAI.hk</span>
        </Link>
        <nav style={{ display: 'flex', gap: 20, fontSize: 14 }}>
          <Link href="/courses" style={{ color: '#666', textDecoration: 'none' }}>課程</Link>
          <Link href="/ai-insights" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>AI 動態</Link>
        </nav>
      </header>

      {/* Hero */}
      <section style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #FAFAFA 100%)',
      }}>
        <R>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#111', marginBottom: 12 }}>
            🤖 AI 動態
          </h1>
        </R>
        <R d={0.1}>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            最新 AI 資訊、實用教學、工具評測。
            <br />幫你跟上 AI 時代，唔會被淘汰。
          </p>
        </R>
      </section>

      {/* Filter */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, padding: '0 24px 32px',
        flexWrap: 'wrap',
      }}>
        {(['all', 'article', 'video', 'tip', 'news'] as const).map(t => {
          const active = filter === t;
          const label = t === 'all' ? '全部' : typeConfig[t].label;
          const emoji = t === 'all' ? '🔥' : typeConfig[t].emoji;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 16px', borderRadius: 20, border: 'none',
              fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
              background: active ? '#111' : '#fff',
              color: active ? '#fff' : '#666',
              boxShadow: active ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}>
              {emoji} {label}
            </button>
          );
        })}
      </div>

      {/* Posts Grid */}
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {filtered.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </main>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '48px 24px',
        background: '#111', color: '#fff',
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          想深入學 AI？
        </h2>
        <p style={{ color: '#999', marginBottom: 24, fontSize: 15 }}>
          我哋嘅課程從零基礎到專家級，有系統咁幫你掌握 AI 技能。
        </p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '12px 32px', borderRadius: 10,
          background: '#fff', color: '#111', fontWeight: 600, fontSize: 15,
          textDecoration: 'none',
        }}>
          睇課程 →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', fontSize: 13, color: '#999' }}>
        © 2026 SkillAI.hk · DeFiner Tech Ltd
      </footer>
    </div>
  );
}
