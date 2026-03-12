"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '../../components/Logo';

/* ══════════════════════════════════════════════════
   CORPORATE PLAN DATA
   ══════════════════════════════════════════════════ */

interface PlanFeature {
  text: string;
  included: boolean;
}

interface CorporatePlan {
  id: string;
  tier: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  features: PlanFeature[];
  deliverables: string[];
  idealFor: string;
}

const PLANS: CorporatePlan[] = [
  {
    id: 'starter',
    tier: 'Starter',
    title: 'AI 入門培訓',
    subtitle: '讓全公司認識 AI，快速提升效率',
    icon: '🚀',
    color: '#4169E1',
    bg: '#EBF0FF',
    border: '#93B4FF',
    price: '聯絡我們報價',
    priceNote: '5-30 人團隊',
    features: [
      { text: 'AI 基礎概念與應用場景介紹', included: true },
      { text: 'ChatGPT / Claude 實戰工作坊', included: true },
      { text: 'Prompt Engineering 基礎訓練', included: true },
      { text: '4 小時互動式培訓（可分 2 節）', included: true },
      { text: '培訓教材與 Prompt 模板庫', included: true },
      { text: '30 天線上支援', included: true },
      { text: '自訂 AI 工作流設計', included: false },
      { text: 'API 串接與自動化部署', included: false },
      { text: '專屬客戶經理', included: false },
    ],
    deliverables: ['AI 應用即時產出', 'Prompt 模板套件', 'AI 效率評估報告', '參加者認證'],
    idealFor: '想讓團隊快速上手 AI 工具、提升日常工作效率的中小企業',
  },
  {
    id: 'professional',
    tier: 'Professional',
    title: 'AI 深度應用班',
    subtitle: '部門級 AI 整合，打造智能工作流',
    icon: '⚡',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FCD34D',
    price: '聯絡我們報價',
    priceNote: '10-50 人團隊',
    popular: true,
    features: [
      { text: 'AI 基礎概念與應用場景介紹', included: true },
      { text: 'ChatGPT / Claude 實戰工作坊', included: true },
      { text: 'Prompt Engineering 進階訓練', included: true },
      { text: '12 小時深度培訓（分 4-6 節）', included: true },
      { text: '培訓教材與 Prompt 模板庫', included: true },
      { text: '90 天線上支援', included: true },
      { text: '自訂 AI 工作流設計', included: true },
      { text: 'n8n / Make 自動化實戰', included: true },
      { text: '專屬客戶經理', included: false },
    ],
    deliverables: ['部門 AI 工作流藍圖', '自動化流程 x3', 'AI 效率評估報告', 'ROI 分析報告', '專業認證'],
    idealFor: '想在市場部、客服部、HR 等部門深度整合 AI 的成長型企業',
  },
  {
    id: 'enterprise',
    tier: 'Enterprise',
    title: 'AI 全方位轉型',
    subtitle: '企業級 AI 策略顧問 + 技術實施',
    icon: '🏢',
    color: '#7C3AED',
    bg: '#EDE9FE',
    border: '#C4B5FD',
    price: '度身定制',
    priceNote: '50+ 人企業',
    features: [
      { text: 'AI 基礎概念與應用場景介紹', included: true },
      { text: 'ChatGPT / Claude 實戰工作坊', included: true },
      { text: 'Prompt Engineering 進階訓練', included: true },
      { text: '40+ 小時定制培訓計劃', included: true },
      { text: '培訓教材與 Prompt 模板庫', included: true },
      { text: '12 個月持續支援', included: true },
      { text: '自訂 AI 工作流設計', included: true },
      { text: 'API 串接與自動化部署', included: true },
      { text: '專屬客戶經理', included: true },
    ],
    deliverables: ['AI 轉型路線圖', '全公司工作流改造', '自訂 AI Agent 開發', 'KPI 追蹤儀表板', '管理層月度報告', '企業認證'],
    idealFor: '需要全面 AI 數位轉型策略、涵蓋多部門的大型企業',
  },
];

/* ══════════════════════════════════════════════════
   TRAINING MODULES
   ══════════════════════════════════════════════════ */

interface TrainingModule {
  icon: string;
  title: string;
  desc: string;
  topics: string[];
  level: string;
}

const MODULES: TrainingModule[] = [
  {
    icon: '🎯',
    title: 'AI 效率提升',
    desc: '用 AI 工具大幅提升日常工作效率',
    topics: ['ChatGPT / Claude 進階運用', 'AI 郵件與文件自動處理', 'AI 數據分析即時報告', '會議記錄自動整理'],
    level: 'Starter+',
  },
  {
    icon: '🔧',
    title: 'Prompt 工程',
    desc: '掌握 AI 對話的核心技術',
    topics: ['系統 Prompt 設計框架', 'Few-shot & Chain-of-Thought', '行業專屬 Prompt 模板', 'Prompt 測試與迭代'],
    level: 'Starter+',
  },
  {
    icon: '🤖',
    title: '自動化工作流',
    desc: '用 n8n / Make 打造無代碼自動化',
    topics: ['n8n 拖拽式工作流設計', 'AI 觸發條件設定', '多系統數據串接', '排程與監控'],
    level: 'Professional+',
  },
  {
    icon: '💻',
    title: 'AI 應用開發',
    desc: '用 Claude Code + Cursor 快速開發',
    topics: ['Claude Code AI 編程', 'Cursor 智能開發環境', 'Next.js + Supabase 全端', 'Vercel 雲端部署'],
    level: 'Professional+',
  },
  {
    icon: '🧠',
    title: 'RAG 知識庫',
    desc: '建立企業內部 AI 知識系統',
    topics: ['向量資料庫設計', '文檔切片與 Embedding', '企業知識圖譜建構', '安全權限與合規'],
    level: 'Enterprise',
  },
  {
    icon: '🏗️',
    title: 'AI Agent 系統',
    desc: '多 Agent 編排與企業級部署',
    topics: ['MCP Server 開發', '多 Agent 協作架構', 'OpenClaw 框架整合', '生產級監控與安全'],
    level: 'Enterprise',
  },
];

/* ══════════════════════════════════════════════════
   STATS
   ══════════════════════════════════════════════════ */

const STATS = [
  { value: '50+', label: '企業客戶' },
  { value: '2,000+', label: '培訓學員' },
  { value: '96%', label: '滿意度' },
  { value: '3x', label: '平均效率提升' },
];

/* ══════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════ */

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: FaqItem[] = [
  {
    q: '培訓可以安排在公司內進行嗎？',
    a: '可以。我們提供上門培訓服務，也支援線上直播形式。Enterprise 計劃更包含混合式培訓方案。',
  },
  {
    q: '團隊沒有技術背景，適合參加嗎？',
    a: '完全適合。Starter 計劃專為非技術背景團隊設計，從零開始教授 AI 應用，無需任何程式經驗。',
  },
  {
    q: '培訓內容可以按行業定制嗎？',
    a: '可以。Professional 和 Enterprise 計劃均支援按行業（金融、零售、法律、教育等）定制培訓內容和案例。',
  },
  {
    q: '有什麼後續支援？',
    a: '所有計劃均包含培訓後線上支援期。Enterprise 計劃更提供 12 個月持續顧問服務，確保 AI 落地成功。',
  },
  {
    q: '如何評估培訓效果？',
    a: '我們提供培訓前後的 AI 效率評估報告，量化團隊能力提升。Enterprise 計劃包含月度 KPI 追蹤。',
  },
  {
    q: '一個團隊最少需要多少人？',
    a: 'Starter 計劃最少 5 人，Professional 計劃最少 10 人。少於 5 人也可安排，歡迎聯繫我們討論。',
  },
];

/* ══════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════ */

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left group"
            aria-expanded={open === i}
          >
            <span className="text-base font-semibold text-[#1A1A2E] group-hover:text-[#4169E1] transition pr-4">
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */

export default function CoursesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plansRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-[#FAFBFF] text-[#1A1A2E] min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/" className="hover:opacity-80 transition"><Logo size="md" /></a>
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-400">
            <a href="/" className="hover:text-[#4169E1] transition">資源</a>
            <a href="/courses" className="text-[#4169E1] font-bold">課程</a>
            <a href="/friends" className="hover:text-[#4169E1] transition">更多資源</a>
          </div>
          <motion.a href="/friends" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="hidden md:inline-flex bg-[#4169E1] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
            免費資源
          </motion.a>
        </div>
      </nav>

      {/* Hero */}
      <main id="main-content">
      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-[#4169E1]/10 text-[#4169E1] px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-[#4169E1]/20">
              🏢 企業 AI 培訓方案 · 度身定制 · 即時見效
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              企業 AI
              <span className="bg-gradient-to-r from-[#4169E1] to-[#7C3AED] bg-clip-text text-transparent"> 培訓方案</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              為你的團隊量身打造 AI 培訓計劃。從基礎入門到全面數位轉型，助企業掌握 AI 競爭優勢。
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => plansRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#4169E1] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
                查看培訓方案 ↓
              </motion.button>
              <motion.a href="https://wa.me/85267552667" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                className="bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200/40 transition">
                💬 WhatsApp 諮詢
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-3xl font-black text-[#4169E1] mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section ref={plansRef} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">選擇適合的培訓方案</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              三個級別，覆蓋從 AI 入門到企業全面轉型。所有方案均可按行業和需求定制。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative group">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10"
                    style={{ background: plan.color }}>
                    ⭐ 最受歡迎
                  </div>
                )}

                <div className={`bg-white rounded-2xl overflow-hidden border-2 hover:shadow-xl transition-all group-hover:-translate-y-1 h-full flex flex-col
                  ${selectedPlan === plan.id ? 'ring-4 shadow-xl' : ''}`}
                  style={{
                    borderColor: selectedPlan === plan.id ? plan.color : '#f3f4f6',
                    boxShadow: selectedPlan === plan.id ? `0 0 0 4px ${plan.color}33` : undefined,
                  }}>

                  <div className="h-1.5" style={{ background: plan.color }} />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">{plan.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: plan.bg, color: plan.color }}>
                        {plan.tier}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{plan.subtitle}</p>

                    {/* Price */}
                    <div className="mb-5 p-4 rounded-xl" style={{ background: plan.bg }}>
                      <div className="text-lg font-bold" style={{ color: plan.color }}>{plan.price}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{plan.priceNote}</div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-5 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          {f.included ? (
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mt-0.5 text-gray-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={f.included ? 'text-gray-600' : 'text-gray-300'}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Deliverables */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                      <p className="text-xs font-bold text-gray-500 mb-2">交付成果</p>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.deliverables.map((d, j) => (
                          <span key={j} className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ideal For */}
                    <p className="text-xs text-gray-400 mb-5">
                      <span className="font-bold text-gray-500">適合：</span>{plan.idealFor}
                    </p>

                    {/* CTA */}
                    <motion.a
                      href={`https://wa.me/85267552667?text=${encodeURIComponent(`你好！我想了解「${plan.title}」企業培訓方案`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-xl text-sm font-bold text-center block transition-all hover:brightness-95 text-white"
                      style={{ background: plan.color }}
                    >
                      立即諮詢 →
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">培訓模組一覽</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              可按企業需求自由組合模組，打造最適合的培訓計劃
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-[#FAFBFF] rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{m.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#4169E1]">{m.level}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{m.desc}</p>
                <ul className="space-y-1.5">
                  {m.topics.map((t, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="text-[#4169E1]">•</span>{t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">合作流程</h2>
            <p className="text-gray-400 text-base">從需求分析到培訓落地，全程專人跟進</p>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: '需求分析', desc: '深入了解企業現況、目標和團隊背景，制定定制方案', icon: '📋' },
              { step: '02', title: '方案設計', desc: '根據行業特性和團隊需求，設計培訓課程和時間表', icon: '🎨' },
              { step: '03', title: '培訓實施', desc: '專業講師上門或線上授課，結合實戰案例和互動練習', icon: '🎓' },
              { step: '04', title: '效果評估', desc: '培訓後效果追蹤，提供數據化評估報告和改善建議', icon: '📊' },
              { step: '05', title: '持續支援', desc: '培訓後線上答疑、資源更新，確保 AI 工具持續落地', icon: '🤝' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded-full">Step {item.step}</span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Courses Link */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100 text-center">
            <h3 className="text-xl font-bold mb-2">個人學員？</h3>
            <p className="text-sm text-gray-400 mb-5">
              我們也提供個人 AI 技能課程，從零基礎到專業開發者。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { id: 'bronze', label: 'AI 效率實戰班', icon: '🏅' },
                { id: 'silver', label: 'AI 應用開發班', icon: '🥈' },
                { id: 'gold', label: 'AI 系統架構師班', icon: '🥇' },
                { id: 'openclaw', label: 'OpenClaw 課程', icon: '🦞' },
                { id: 'platinum', label: 'AI 創業實戰班', icon: '💎' },
              ].map(c => (
                <Link key={c.id} href={`/courses/${c.id}`}>
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#4169E1] hover:text-[#4169E1] transition cursor-pointer shadow-sm">
                    {c.icon} {c.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3">常見問題</h2>
            <p className="text-gray-400 text-base">關於企業 AI 培訓的常見疑問</p>
          </div>
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-[#4169E1]/5 to-[#7C3AED]/5 rounded-3xl p-10 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-black mb-3">準備好提升團隊 AI 能力？</h2>
            <p className="text-gray-400 mb-6">免費諮詢，了解最適合你企業的 AI 培訓方案</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <motion.a href="https://wa.me/85267552667" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200/40 transition">
                💬 WhatsApp 諮詢
              </motion.a>
              <motion.a href="mailto:assistant4ed@gmail.com"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold text-sm hover:border-[#4169E1] hover:text-[#4169E1] transition">
                📧 電郵查詢
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">&copy; 2026 SkillAI.hk &middot; DeFiner Tech Ltd</p>
            <div className="flex gap-4 text-xs">
              <a href="/privacy" className="hover:text-white transition">私隱政策</a>
              <a href="/terms" className="hover:text-white transition">服務條款</a>
              <a href="/" className="hover:text-white transition">返回首頁</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
