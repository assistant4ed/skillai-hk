"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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
  sourceUrl?: string;
  image?: string;
  tags: string[];
  auto?: boolean;
  hasArticle?: boolean;
}

/* ── All Articles ── */
const curatedPosts: Post[] = [
  { id: 'ai-tools-daily-work', title: '2026 年必裝嘅 20 個 AI 工具：工作效率即刻翻倍', excerpt: '由寫 email 到整 PPT、由數據分析到客服自動化，覆蓋你日常工作嘅每個場景。', type: 'article', date: '2026-03-02', readTime: '6 分鐘', tags: ['AI 工具', '生產力', '2026 推薦'] },
  { id: 'chatgpt-vs-claude-vs-gemini', title: '我每日用晒 ChatGPT、Claude、Gemini。講真，大部分人都揀錯咗。', excerpt: '用咗 300 日，花咗 US$600+。呢個係我嘅真實結論。', type: 'article', date: '2026-03-01', readTime: '5 分鐘', tags: ['AI 比較', 'ChatGPT', 'Claude', 'Gemini'] },
  { id: 'openclaw-enterprise-2026', title: '企業點用 OpenClaw 建立 AI 團隊？2026 完整攻略', excerpt: '三種企業部署方案分析，由 10 人團隊到 100+ 人都適用。', type: 'article', date: '2026-03-01', readTime: '8 分鐘', tags: ['OpenClaw', '企業 AI', '2026'] },
  { id: 'trump-anthropic-ban', title: 'Trump 封殺 Anthropic：AI 軍事化政治博弈點解咁重要？', excerpt: '美國政府禁止使用 Anthropic 產品，OpenAI 即刻補位。對我哋有咩影響？', type: 'news', date: '2026-03-01', tags: ['AI 新聞', 'Anthropic', 'OpenAI', '政策'] },
  { id: 'ai-image-gen-comparison', title: 'AI 圖片生成大比拼：Gemini 3 Pro vs DALL-E 4 vs Midjourney v7', excerpt: '實測三大工具，比較效果、速度、價格。', type: 'article', date: '2026-02-28', readTime: '5 分鐘', tags: ['圖片生成', 'Gemini', 'DALL-E', 'Midjourney'] },
  { id: 'ai-automate-small-business', title: '中小企 AI 自動化指南：5 個即用方案幫你慳人手', excerpt: '唔使請 IT，呢 5 個方案即刻幫你慳時間、減成本。', type: 'article', date: '2026-02-27', readTime: '5 分鐘', tags: ['中小企', '自動化', 'AI 方案'] },
  { id: 'learn-ai-zero-to-hero', title: '零基礎學 AI 路線圖：30 日從「AI 係咩」到「日日用 AI」', excerpt: '唔識 coding 都可以學。30 日計劃帶你從零到熟練。', type: 'tip', date: '2026-02-26', readTime: '4 分鐘', tags: ['入門', '學習路線', '零基礎'] },
  { id: 'prompt-engineering-tips', title: '5 個即學即用嘅 Prompt 技巧', excerpt: '即刻提升你同 AI 嘅溝通效率。我自己每日都用。', type: 'tip', date: '2026-02-25', readTime: '3 分鐘', tags: ['Prompt Engineering', '實用技巧'] },
  { id: 'ai-coding-tools-2026', title: '2026 年 10 大 AI Coding 工具', excerpt: 'AI 改變咗寫 code 嘅方式。呢 10 個工具幫你寫更快、debug 更準。', type: 'article', date: '2026-02-24', readTime: '5 分鐘', tags: ['Coding', 'AI 工具', '開發者'] },
  { id: 'ai-video-tools', title: 'AI 影片製作工具大全：一個人做出專業級影片', excerpt: '唔使請攝影師、剪接師。呢啲 AI 工具幫你一個人搞掂。', type: 'article', date: '2026-02-22', readTime: '5 分鐘', tags: ['影片製作', 'AI 工具', 'Content Creation'] },
  { id: 'ai-for-students', title: '學生必睇：8 個 AI 工具幫你讀書考試事半功倍', excerpt: '由整筆記到溫書、寫論文到做 project 嘅秘密武器。', type: 'tip', date: '2026-02-20', readTime: '4 分鐘', tags: ['學生', '學習工具', '考試'] },
  { id: 'first-ai-assistant-setup', title: '15 分鐘搭建你嘅第一個 AI 助手', excerpt: '用 OpenClaw 從零開始，15 分鐘擁有 24/7 AI 助手。', type: 'video', date: '2026-02-20', readTime: '15 分鐘', tags: ['教學', 'OpenClaw', '入門'] },
  { id: 'ai-freelancer-toolkit', title: 'Freelancer 必備 AI 工具包：一個人做到十個人嘅量', excerpt: '設計、寫文、剪片、報價、客服全部用 AI。', type: 'article', date: '2026-02-18', readTime: '5 分鐘', tags: ['Freelancer', '自由工作者', 'AI 工具'] },
  { id: 'ai-data-analysis-no-code', title: '唔識 Code 都可以做數據分析：6 個 No-Code AI 工具', excerpt: '上傳 Excel 就出圖表、問問題就有答案。', type: 'tip', date: '2026-02-16', readTime: '4 分鐘', tags: ['數據分析', 'No-Code', 'Excel'] },
  { id: 'ai-security-privacy-guide', title: '用 AI 前必讀：私隱安全 10 大注意事項', excerpt: '你畀 AI 嘅資料去咗邊？點樣安全咁用 AI？', type: 'article', date: '2026-02-14', readTime: '4 分鐘', tags: ['私隱', '安全', 'AI 使用指南'] },
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
  const cardContent = (
    <article style={{
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      height: '100%',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          background: tc.bg, color: tc.color,
        }}>
          {tc.emoji} {tc.label}
        </span>
        {post.auto && <span style={{ fontSize: 10, color: '#bbb' }}>🤖 自動更新</span>}
      </div>
      <div style={{ padding: '12px 20px 20px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: '#111' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
          {post.excerpt}
        </p>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#999' }}>
          <span>{post.date}</span>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {post.readTime && <span>⏱ {post.readTime}</span>}
            {(post.hasArticle || !post.auto) ? (
              <span style={{ color: '#4169E1' }}>📖 閱讀全文</span>
            ) : post.sourceUrl ? (
              <span style={{ color: '#3B82F6' }}>↗ 閱讀原文</span>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );

  // All posts with article pages link internally, otherwise to source
  const hasArticlePage = !post.auto || post.hasArticle;
  const linkHref = hasArticlePage ? `/friends/${post.id}` : post.sourceUrl;
  const isExternal = !hasArticlePage && !!post.sourceUrl;

  return (
    <R d={index * 0.08}>
      {linkHref ? (
        isExternal ? (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            {cardContent}
          </a>
        ) : (
          <Link href={linkHref} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            {cardContent}
          </Link>
        )
      ) : cardContent}
    </R>
  );
}

/* ── Main Page ── */
export default function Friends() {
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const [allPosts, setAllPosts] = useState<Post[]>(curatedPosts);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load dynamic posts from data file (via API route or static import)
  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.posts) {
          // Merge curated + dynamic, deduplicate
          const seen = new Set<string>();
          const merged: Post[] = [];
          for (const p of [...curatedPosts, ...data.posts]) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          merged.sort((a, b) => b.date.localeCompare(a.date));
          setAllPosts(merged);
          setLastUpdated(data.lastUpdated || '');
        }
      })
      .catch(() => {/* Use curated posts as fallback */});
  }, []);

  const filtered = filter === 'all' ? allPosts : allPosts.filter(p => p.type === filter);

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
          <Link href="/friends" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>AI 動態</Link>
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
          {lastUpdated && (
            <p style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>
              🔄 上次更新: {lastUpdated.substring(0, 16).replace('T', ' ')}
            </p>
          )}
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
          const count = t === 'all' ? allPosts.length : allPosts.filter(p => p.type === t).length;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '8px 16px', borderRadius: 20, border: 'none',
              fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
              background: active ? '#111' : '#fff',
              color: active ? '#fff' : '#666',
              boxShadow: active ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}>
              {emoji} {label} ({count})
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
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#999' }}>
            暫時冇呢個類別嘅內容 🤷‍♂️
          </div>
        )}
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
