"use client";
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '../../../components/Logo';

interface ContentBlock {
  type: string;
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  code?: string;
  language?: string;
  author?: string;
  link?: string;
  platform?: string;
  videoId?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  type: string;
  date: string;
  readTime?: string;
  tags: string[];
  heroImage?: string;
  content: ContentBlock[];
}

/* ── Content Renderers ── */
function RenderBlock({ block, index }: { block: ContentBlock; index: number }) {
  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: index * 0.03 }
  };

  switch (block.type) {
    case 'heading':
      return (
        <motion.h2 {...fade} style={{
          fontSize: 24, fontWeight: 800, color: '#111',
          marginTop: 36, marginBottom: 16, lineHeight: 1.3,
        }}>
          {block.text}
        </motion.h2>
      );

    case 'subheading':
      return (
        <motion.h3 {...fade} style={{
          fontSize: 19, fontWeight: 700, color: '#333',
          marginTop: 24, marginBottom: 10, lineHeight: 1.4,
        }}>
          {block.text}
        </motion.h3>
      );

    case 'paragraph':
      return (
        <motion.p {...fade} style={{
          fontSize: 16, lineHeight: 1.85, color: '#444',
          marginBottom: 18,
        }}>
          {block.text}
        </motion.p>
      );

    case 'list':
      return (
        <motion.ul {...fade} style={{
          paddingLeft: 24, marginBottom: 20,
          listStyleType: 'none',
        }}>
          {block.items?.map((item, i) => (
            <li key={i} style={{
              fontSize: 15, lineHeight: 1.8, color: '#444',
              marginBottom: 6, paddingLeft: 8,
              borderLeft: '3px solid #4169E1',
            }}>
              {item}
            </li>
          ))}
        </motion.ul>
      );

    case 'image':
      return (
        <motion.figure {...fade} style={{ margin: '28px 0', textAlign: 'center' }}>
          <img
            src={block.src}
            alt={block.alt || ''}
            style={{
              maxWidth: '100%', borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          />
          {block.caption && (
            <figcaption style={{ fontSize: 13, color: '#999', marginTop: 8 }}>
              {block.caption}
            </figcaption>
          )}
        </motion.figure>
      );

    case 'video':
      if (block.platform === 'youtube' && block.videoId) {
        return (
          <motion.div {...fade} style={{ margin: '28px 0' }}>
            <div style={{
              position: 'relative', paddingBottom: '56.25%',
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${block.videoId}`}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%', border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.caption && (
              <p style={{ fontSize: 13, color: '#999', marginTop: 8, textAlign: 'center' }}>
                {block.caption}
              </p>
            )}
          </motion.div>
        );
      }
      return null;

    case 'code':
      return (
        <motion.div {...fade} style={{ margin: '20px 0' }}>
          <pre style={{
            background: '#1a1a2e', color: '#e0e0e0',
            padding: '16px 20px', borderRadius: 10,
            fontSize: 14, lineHeight: 1.6,
            overflowX: 'auto',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}>
            <code>{block.code}</code>
          </pre>
        </motion.div>
      );

    case 'quote':
      return (
        <motion.blockquote {...fade} style={{
          margin: '28px 0', padding: '20px 24px',
          borderLeft: '4px solid #4169E1',
          background: '#F8F9FF', borderRadius: '0 12px 12px 0',
        }}>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: '#333', lineHeight: 1.7, marginBottom: 8 }}>
            {block.text}
          </p>
          {block.author && (
            <cite style={{ fontSize: 14, color: '#888' }}>{block.author}</cite>
          )}
        </motion.blockquote>
      );

    case 'cta':
      return (
        <motion.div {...fade} style={{ margin: '32px 0', textAlign: 'center' }}>
          <Link href={block.link || '/courses'} style={{
            display: 'inline-block', padding: '14px 36px',
            background: '#4169E1', color: '#fff',
            borderRadius: 10, fontWeight: 600, fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(65,105,225,0.3)',
            transition: 'transform 0.2s',
          }}>
            {block.text}
          </Link>
        </motion.div>
      );

    default:
      return null;
  }
}

/* ── Article Page ── */
export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 32 }}>🤖</motion.div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', gap: 16 }}>
        <span style={{ fontSize: 48 }}>😔</span>
        <h1 style={{ fontSize: 24, color: '#333' }}>搵唔到呢篇文章</h1>
        <Link href="/friends" style={{ color: '#4169E1', textDecoration: 'none', fontWeight: 600 }}>← 返去文章列表</Link>
      </div>
    );
  }

  const typeConfig: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
    article: { emoji: '📝', label: '文章', color: '#3B82F6', bg: '#EFF6FF' },
    video: { emoji: '🎬', label: '影片', color: '#EF4444', bg: '#FEF2F2' },
    tip: { emoji: '💡', label: '快速技巧', color: '#F59E0B', bg: '#FFFBEB' },
    news: { emoji: '📰', label: '最新資訊', color: '#8B5CF6', bg: '#F5F3FF' },
  };
  const tc = typeConfig[article.type] || typeConfig.article;

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

      {/* Hero Image */}
      {article.heroImage && (
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <img
            src={article.heroImage}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '40px 24px 24px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: tc.bg, color: tc.color,
            }}>
              {tc.emoji} {tc.label}
            </span>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: '#111', lineHeight: 1.3, marginBottom: 16 }}
        >
          {article.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 16, fontSize: 14, color: '#888', marginBottom: 8, flexWrap: 'wrap' }}
        >
          <span>📅 {article.date}</span>
          {article.readTime && <span>⏱ {article.readTime}</span>}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}
        >
          {article.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 12,
              background: '#F3F4F6', color: '#6B7280',
            }}>
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{ height: 1, background: '#eee', marginBottom: 32 }} />

        {/* Content Blocks */}
        {article.content.map((block, i) => (
          <RenderBlock key={i} block={block} index={i} />
        ))}

        {/* Bottom Nav */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Link href="/friends" style={{
            display: 'inline-block', padding: '12px 28px',
            background: '#f5f5f5', color: '#333',
            borderRadius: 10, fontWeight: 600, fontSize: 15,
            textDecoration: 'none',
          }}>
            ← 返去文章列表
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', fontSize: 13, color: '#999', background: '#fff', borderTop: '1px solid #eee' }}>
        © 2026 SkillAI.hk · DeFiner Tech Ltd
      </footer>
    </div>
  );
}
