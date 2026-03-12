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

/* ── Stock images for articles without images ── */
const stockImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', // AI chip
  'https://images.unsplash.com/photo-1684487747720-1ba29cda82c8?w=800&q=80', // AI robot
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80', // code
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', // robot hand
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', // AI brain
];

function getStockImage(id: string, index: number = 0): string {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return stockImages[(hash + index) % stockImages.length];
}

/* ── Content Block Renderer ── */
function Block({ block, articleId, blockIndex }: { block: ContentBlock; articleId: string; blockIndex: number }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#111',
          marginTop: 32, marginBottom: 12, lineHeight: 1.35,
          borderBottom: '2px solid #4169E1', paddingBottom: 8, display: 'inline-block',
        }}>
          {block.text}
        </h2>
      );

    case 'subheading':
      return (
        <h3 style={{
          fontSize: 18, fontWeight: 700, color: '#222',
          marginTop: 20, marginBottom: 8, lineHeight: 1.4,
        }}>
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p style={{
          fontSize: 16, lineHeight: 1.9, color: '#333',
          marginBottom: 16, letterSpacing: 0.2,
        }}>
          {block.text}
        </p>
      );

    case 'list':
      return (
        <ul style={{ padding: 0, margin: '16px 0', listStyle: 'none' }}>
          {block.items?.map((item, i) => (
            <li key={i} style={{
              fontSize: 15, lineHeight: 1.7, color: '#333',
              padding: '8px 16px', marginBottom: 4,
              background: i % 2 === 0 ? '#f8f9ff' : '#fff',
              borderRadius: 8, borderLeft: '3px solid #4169E1',
            }}>
              {item}
            </li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <figure style={{ margin: '24px 0', textAlign: 'center' }}>
          <img
            src={block.src || getStockImage(articleId, blockIndex)}
            alt={block.alt || block.caption || 'AI illustration'}
            width={800}
            height={450}
            loading="lazy"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          />
          {block.caption && <figcaption style={{ fontSize: 13, color: '#888', marginTop: 8 }}>{block.caption}</figcaption>}
        </figure>
      );

    case 'video':
      if (block.platform === 'youtube' && block.videoId) {
        return (
          <div style={{ margin: '24px 0' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${block.videoId}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={block.caption || 'Video'}
              />
            </div>
            {block.caption && <p style={{ fontSize: 13, color: '#888', marginTop: 8, textAlign: 'center' }}>{block.caption}</p>}
          </div>
        );
      }
      return null;

    case 'code':
      return (
        <pre style={{
          background: '#1a1a2e', color: '#e8e8e8',
          padding: '14px 18px', borderRadius: 10,
          fontSize: 13.5, lineHeight: 1.6, overflowX: 'auto',
          margin: '16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          <code>{block.code}</code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote style={{
          margin: '24px 0', padding: '16px 20px',
          borderLeft: '4px solid #4169E1',
          background: '#f8f9ff', borderRadius: '0 10px 10px 0',
        }}>
          <p style={{ fontSize: 16, fontStyle: 'italic', color: '#333', lineHeight: 1.7, margin: 0 }}>{block.text}</p>
          {block.author && <cite style={{ fontSize: 13, color: '#888', display: 'block', marginTop: 8 }}>{block.author}</cite>}
        </blockquote>
      );

    case 'cta':
      return (
        <div style={{ margin: '28px 0', textAlign: 'center' }}>
          <Link href={block.link || '/courses'} style={{
            display: 'inline-block', padding: '12px 32px',
            background: '#4169E1', color: '#fff',
            borderRadius: 10, fontWeight: 600, fontSize: 15,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(65,105,225,0.25)',
          }}>
            {block.text}
          </Link>
        </div>
      );

    default:
      return null;
  }
}

/* ── Main Article Page ── */
export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setArticle(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 32 }}>🤖</motion.div>
    </div>
  );

  if (!article) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <span style={{ fontSize: 48 }}>😔</span>
      <h1 style={{ fontSize: 22, color: '#333' }}>搵唔到呢篇文章</h1>
      <Link href="/friends" style={{ color: '#4169E1', fontWeight: 600 }}>← 返去文章列表</Link>
    </div>
  );

  const typeMap: Record<string, { emoji: string; label: string; color: string }> = {
    article: { emoji: '📝', label: '文章', color: '#3B82F6' },
    video: { emoji: '🎬', label: '影片', color: '#EF4444' },
    tip: { emoji: '💡', label: '技巧', color: '#F59E0B' },
    news: { emoji: '📰', label: '資訊', color: '#8B5CF6' },
  };
  const tc = typeMap[article.type] || typeMap.article;

  // Insert stock images between content blocks if article lacks images
  const hasImages = article.content.some(b => b.type === 'image' || b.type === 'video');
  let contentWithImages = [...article.content];
  if (!hasImages && contentWithImages.length > 4) {
    // Insert a stock image after the 3rd block
    contentWithImages.splice(3, 0, {
      type: 'image',
      src: getStockImage(article.id, 0),
      alt: article.title,
      caption: '',
    });
    // And another before the last 3 blocks if long enough
    if (contentWithImages.length > 8) {
      contentWithImages.splice(Math.floor(contentWithImages.length * 0.7), 0, {
        type: 'image',
        src: getStockImage(article.id, 1),
        alt: article.title,
        caption: '',
      });
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', background: '#fff', borderBottom: '1px solid #eee',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size="sm" showText={false} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>SkillAI.hk</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16, fontSize: 14 }}>
          <Link href="/courses" style={{ color: '#666', textDecoration: 'none' }}>課程</Link>
          <Link href="/friends" style={{ color: '#4169E1', fontWeight: 600, textDecoration: 'none' }}>AI 動態</Link>
        </nav>
      </header>

      {/* Hero */}
      <div style={{
        position: 'relative', height: 240, overflow: 'hidden',
        background: `linear-gradient(135deg, #1a1a2e, #16213e)`,
      }}>
        <img
          src={article.heroImage || getStockImage(article.id)}
          alt={article.title}
          width={1200}
          height={240}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '60px 24px 20px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        }}>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 16,
            fontSize: 12, fontWeight: 600, color: '#fff',
            background: tc.color, marginBottom: 8,
          }}>
            {tc.emoji} {tc.label}
          </span>
        </div>
      </div>

      {/* Article */}
      <article itemScope itemType="https://schema.org/Article" style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 60px' }}>
        <meta itemProp="author" content="SkillAI.hk" />
        <meta itemProp="datePublished" content={article.date} />

        <motion.h1
          itemProp="headline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#111', lineHeight: 1.35, marginBottom: 12 }}
        >
          {article.title}
        </motion.h1>

        {/* Meta bar */}
        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#888', marginBottom: 6, flexWrap: 'wrap' }}>
          <span>📅 {article.date}</span>
          {article.readTime && <span>⏱ {article.readTime}</span>}
          <span>✍️ SkillAI 編輯部</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 24 }}>
          {article.tags.map(tag => (
            <span key={tag} style={{ padding: '2px 8px', borderRadius: 5, fontSize: 11, background: '#eef', color: '#4169E1', fontWeight: 500 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Excerpt */}
        <p itemProp="description" style={{
          fontSize: 17, lineHeight: 1.7, color: '#555',
          padding: '14px 18px', background: '#f0f4ff', borderRadius: 10,
          marginBottom: 28, fontWeight: 500, borderLeft: '4px solid #4169E1',
        }}>
          {article.excerpt}
        </p>

        {/* Content */}
        <div itemProp="articleBody">
          {contentWithImages.map((block, i) => (
            <Block key={i} block={block} articleId={article.id} blockIndex={i} />
          ))}
        </div>

        {/* Share + Nav */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/friends" style={{
            padding: '10px 24px', background: '#f5f5f5', color: '#333',
            borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none',
          }}>
            ← 更多文章
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' https://skillai.hk/friends/' + article.id)}`}
               target="_blank" rel="noopener noreferrer"
               style={{ padding: '10px 16px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              📲 分享
            </a>
          </div>
        </div>
      </article>

      <footer style={{ textAlign: 'center', padding: '20px', fontSize: 12, color: '#999', background: '#fff', borderTop: '1px solid #eee' }}>
        © 2026 <a href="https://skillai.hk" style={{ color: '#4169E1', textDecoration: 'none' }}>SkillAI.hk</a> · DeFiner Tech Ltd
      </footer>
    </div>
  );
}
