"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '../../components/Logo';

/* ══════════════════════════════════════════════════
   QUIZ DATA
   ══════════════════════════════════════════════════ */

interface QuizOption { label: string; emoji: string; points: number }
interface QuizQuestion { id: number; question: string; sub: string; options: QuizOption[] }

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1, question: '你用過 AI 工具嗎？', sub: '例如 ChatGPT、Claude、Midjourney',
    options: [
      { label: '完全沒用過', emoji: '🌱', points: 0 },
      { label: '偶爾用 ChatGPT 聊天', emoji: '💬', points: 1 },
      { label: '每天工作都在用', emoji: '⚡', points: 2 },
      { label: '我會寫 Prompt 和串接 API', emoji: '🔧', points: 3 },
    ],
  },
  {
    id: 2, question: '你會寫程式嗎？', sub: '任何語言都算',
    options: [
      { label: '完全不會', emoji: '📝', points: 0 },
      { label: '學過一點但不熟', emoji: '📖', points: 1 },
      { label: '可以獨立寫簡單程式', emoji: '💻', points: 2 },
      { label: '專業開發者', emoji: '🧑‍💻', points: 3 },
    ],
  },
  {
    id: 3, question: '你最想達成什麼目標？', sub: '選最接近的一個',
    options: [
      { label: '用 AI 提升工作效率', emoji: '🚀', points: 0 },
      { label: '學會用 AI 做數據分析和自動化', emoji: '📊', points: 1 },
      { label: '開發 AI 應用或 Agent 系統', emoji: '🤖', points: 2 },
      { label: '用 AI 技術創業', emoji: '💎', points: 4 },
    ],
  },
  {
    id: 4, question: '你知道什麼是 RAG 嗎？', sub: 'Retrieval-Augmented Generation',
    options: [
      { label: '第一次聽到', emoji: '❓', points: 0 },
      { label: '聽過但不太懂', emoji: '🤔', points: 1 },
      { label: '知道原理但沒做過', emoji: '📚', points: 2 },
      { label: '已經部署過 RAG 系統', emoji: '✅', points: 3 },
    ],
  },
  {
    id: 5, question: '你對 OpenClaw 有興趣嗎？', sub: '2026 最熱門 AI 助手框架',
    options: [
      { label: '沒聽過', emoji: '🆕', points: 0 },
      { label: '有興趣想學', emoji: '👀', points: 5 },
      { label: '已經在用，想深入學', emoji: '🦞', points: 6 },
      { label: '我更想學其他技術', emoji: '➡️', points: 0 },
    ],
  },
];

function getRecommendation(score: number, openclawInterest: boolean): string {
  if (openclawInterest) return 'openclaw';
  if (score >= 10) return 'platinum';
  if (score >= 7) return 'gold';
  if (score >= 4) return 'silver';
  return 'bronze';
}

/* ══════════════════════════════════════════════════
   COURSE DATA
   ══════════════════════════════════════════════════ */

const COURSES = [
  {
    id: 'bronze', level: 'Bronze', title: 'AI 效率實戰班', tag: '零基礎友善',
    price: 'HK$2,999', weeks: '4 週', icon: '🏅',
    color: '#CD7F32', bg: '#FDF4E8', border: '#E8D5B7',
    desc: '用 Claude + n8n 建立真正的自動化工作流。每堂課都有即時可用的產出。',
    skills: ['Claude 系統 Prompt 設計', 'n8n 自動化工作流', 'AI 數據分析報告', '多工具串接'],
    outcomes: ['郵件自動分類回覆系統', 'KPI 自動化報告', '個人 AI 工作流', 'AI 效率認證'],
    fit: '非技術背景、想用 AI 實際提升工作效率的職場人士',
  },
  {
    id: 'silver', level: 'Silver', title: 'AI 應用開發班', tag: 'Claude Code + Cursor',
    price: 'HK$7,999', weeks: '8 週', icon: '🥈',
    color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB',
    desc: '用 Claude Code + Cursor 從零開發 AI 應用。用 AI 寫代碼，跳過傳統學習曲線。',
    skills: ['Claude Code 開發', 'Cursor AI 編程', 'Next.js + Supabase', 'Vercel 部署'],
    outcomes: ['AI 研究助手 Agent', '全端 AI 筆記應用', 'Slack AI Bot', '開發者認證'],
    fit: '想從零學開發、用 AI 工具快速建產品的轉型者',
  },
  {
    id: 'gold', level: 'Gold', title: 'AI 系統架構師班', tag: 'RAG + Agent + MCP',
    price: 'HK$15,999', weeks: '12 週', icon: '🥇', popular: true,
    color: '#D97706', bg: '#FEF3C7', border: '#FCD34D',
    desc: '深入 RAG、多 Agent 編排、MCP Server 和生產級部署。設計企業級 AI 系統。',
    skills: ['RAG 知識庫系統', 'MCP Server 開發', '多 Agent 編排', '生產級部署監控'],
    outcomes: ['企業 RAG 知識庫', '多 Agent 研究平台', '生產級 AI SaaS', '架構師認證'],
    fit: '有開發經驗、想成為 AI 系統架構師的工程師',
  },
  {
    id: 'openclaw', level: 'OpenClaw', title: 'OpenClaw 全方位課程', tag: '🔥 2026 最熱門',
    price: 'HK$9,999', weeks: '10 週', icon: '🦞', featured: true,
    color: '#4169E1', bg: '#EBF0FF', border: '#93B4FF',
    desc: '從安裝到企業部署。Skill 開發、多 Agent 編排、多平台整合一次學完。',
    skills: ['自定義 Skill 開發', '多平台部署（WA/TG/DC）', '多 Agent 編排', '企業級安全監控'],
    outcomes: ['多平台 AI 客服', '業務 Skill 套件', '企業 Agent 集群', 'OpenClaw 認證'],
    fit: '想掌握 OpenClaw 框架的開發者和技術愛好者',
  },
  {
    id: 'platinum', level: 'Platinum', title: 'AI 創業實戰班', tag: '從想法到上線產品',
    price: 'HK$29,999', weeks: '16 週', icon: '💎',
    color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD',
    desc: '16 週把 AI 產品想法變成上線的 SaaS。涵蓋開發、付款、增長到投資人路演。',
    skills: ['AI SaaS 全端開發', 'Stripe 付款整合', 'SEO + 增長引擎', '融資與 Pitch Deck'],
    outcomes: ['AI SaaS 產品上線', '投資人 Pitch Deck', '增長實驗報告', '創業領袖認證'],
    fit: '有技術基礎、想用 AI 技術棧創業的創業者',
  },
];

const RESULT_MAP: Record<string, { emoji: string; title: string; desc: string; color: string }> = {
  bronze: { emoji: '🏅', title: 'Bronze — AI 效率實戰班', desc: '4 週用 Claude + n8n 建立自動化工作流，即時提升效率。', color: '#CD7F32' },
  silver: { emoji: '🥈', title: 'Silver — AI 應用開發班', desc: '8 週用 Claude Code + Cursor 從零開發真正的 AI 應用。', color: '#6B7280' },
  gold: { emoji: '🥇', title: 'Gold — AI 系統架構師班', desc: '12 週掌握 RAG、Agent 編排和生產級系統設計。', color: '#D97706' },
  openclaw: { emoji: '🦞', title: 'OpenClaw — 全方位課程', desc: '10 週從安裝到企業部署，成為 OpenClaw 專家。', color: '#4169E1' },
  platinum: { emoji: '💎', title: 'Platinum — AI 創業實戰班', desc: '16 週把 AI 想法變成上線的 SaaS 產品。', color: '#7C3AED' },
};

/* ══════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════ */

function QuizCard({ onComplete }: { onComplete: (result: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (points: number) => {
    const next = [...answers, points];
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const total = next.reduce((a, b) => a + b, 0);
      const openclawInterest = next[4] >= 5;
      onComplete(getRecommendation(total, openclawInterest));
    }
  };

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 p-8 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-400">問題 {step + 1} / {QUESTIONS.length}</span>
        <span className="text-xs text-gray-300">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <motion.div className="h-full bg-[#4169E1] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <h3 className="text-2xl font-black mb-1 text-[#1A1A2E]">{q.question}</h3>
          <p className="text-sm text-gray-400 mb-6">{q.sub}</p>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <motion.button key={i} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(opt.points)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#4169E1] hover:bg-blue-50/50 transition-all text-left group">
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-base font-semibold text-gray-700 group-hover:text-[#4169E1] transition-colors">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition">
          ← 上一題
        </button>
      )}
    </div>
  );
}

function QuizResult({ result, onReset }: { result: string; onReset: () => void }) {
  const r = RESULT_MAP[result];
  const course = COURSES.find(c => c.id === result);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border-2 shadow-xl shadow-blue-50/50 p-8 max-w-lg mx-auto text-center"
      style={{ borderColor: r.color }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
        className="text-7xl mb-4">{r.emoji}</motion.div>
      <h3 className="text-2xl font-black mb-2" style={{ color: r.color }}>推薦你報讀</h3>
      <p className="text-xl font-bold text-[#1A1A2E] mb-2">{r.title}</p>
      <p className="text-sm text-gray-500 mb-6">{r.desc}</p>

      {course && (
        <div className="text-left bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-lg font-bold text-gray-400">即將推出</span>
            <span className="text-sm text-gray-400">{course.weeks}</span>
          </div>
          <ul className="space-y-1.5">
            {course.skills.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span style={{ color: r.color }}>✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/courses/${result}`} className="flex-1">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition"
            style={{ background: r.color }}>
            查看課程詳情 →
          </motion.button>
        </Link>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReset}
          className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:border-gray-300 transition">
          重新測試
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */

export default function CoursesPage() {
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const quizRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-[#FAFBFF] text-[#1A1A2E] min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/" className="hover:opacity-80 transition"><Logo size="md" /></a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="/" className="hover:text-[#4169E1] transition">資源</a>
            <a href="/courses" className="text-[#4169E1] font-bold">課程</a>
            <a href="/friends" className="hover:text-[#4169E1] transition">更多資源</a>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => { setShowQuiz(true); setQuizResult(null); quizRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-[#4169E1] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
            技能測試
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-[#4169E1]/10 text-[#4169E1] px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-[#4169E1]/20">
              🎓 5 個級別 · 4-16 週 · 零基礎到創業
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              AI 技能認證
              <span className="bg-gradient-to-r from-[#4169E1] to-[#7C3AED] bg-clip-text text-transparent"> 課程</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-8">
              不確定選哪個？先做 30 秒技能測試，找到最適合你的課程。
            </p>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setShowQuiz(true); setQuizResult(null); setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="bg-[#4169E1] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
              🧪 30 秒技能測試 — 找到你的課程
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" ref={quizRef} className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatePresence>
            {showQuiz && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black mb-2">📋 技能自測卡</h2>
                  <p className="text-sm text-gray-400">回答 5 個問題，找到最適合你的課程</p>
                </div>

                {quizResult ? (
                  <QuizResult result={quizResult} onReset={() => setQuizResult(null)} />
                ) : (
                  <QuizCard onComplete={setQuizResult} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* All Courses */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-2">所有課程</h2>
            <p className="text-sm text-gray-400">由 DeFiner Tech Ltd 營運 · 包含終身內容更新和社群支援</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="relative group">
                {c.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm z-10" style={{ background: c.color }}>⭐ 最受歡迎</div>}
                {c.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4169E1] text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm z-10">🔥 新課程</div>}

                <div className={`bg-white rounded-2xl overflow-hidden border-2 hover:shadow-xl transition-all group-hover:-translate-y-1 h-full flex flex-col
                  ${quizResult === c.id ? 'ring-4 shadow-xl' : ''}`}
                  style={{ borderColor: quizResult === c.id ? c.color : '#f3f4f6', boxShadow: quizResult === c.id ? `0 0 0 4px ${c.color}33` : undefined }}>

                  <div className="h-1.5" style={{ background: c.color }} />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>{c.level}</span>
                      {quizResult === c.id && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 ml-auto">✓ 推薦</span>}
                    </div>

                    <h3 className="text-xl font-bold mb-0.5">{c.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{c.tag}</p>
                    <p className="text-base text-gray-500 mb-4 leading-relaxed flex-1">{c.desc}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-lg font-bold text-gray-400">即將推出</span>
                      <span className="text-xs text-gray-300">/ {c.weeks}</span>
                    </div>

                    {/* Skills */}
                    <ul className="space-y-1.5 mb-4">
                      {c.skills.map((s, j) => (
                        <li key={j} className="flex items-center gap-1.5 text-sm text-gray-600">
                          <span style={{ color: c.color }}>✓</span>{s}
                        </li>
                      ))}
                    </ul>

                    {/* Fit */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-xs text-gray-500"><span className="font-bold text-gray-600">適合：</span>{c.fit}</p>
                    </div>

                    {/* Outcomes */}
                    <div className="grid grid-cols-2 gap-1.5 mb-5">
                      {c.outcomes.map((o, j) => (
                        <div key={j} className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {o}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href={`/courses/${c.id}`}>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-95"
                        style={{ background: c.bg, color: c.color }}>
                        查看詳細大綱 →
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-[#4169E1]/5 to-[#7C3AED]/5 rounded-3xl p-10 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-black mb-3">還是不確定？</h2>
            <p className="text-gray-400 mb-6">WhatsApp 我們，免費一對一課程諮詢</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <motion.a href="https://wa.me/85257961104" target="_blank" rel="noopener noreferrer"
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
