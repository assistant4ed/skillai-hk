"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Logo from '../components/Logo';
const HeroBg3D = dynamic(() => import('../components/HeroBg3D'), { ssr: false });

/* ── CountUp ── */
function CountUp({ target, suffix = '', dur = 2 }: { target: number; suffix?: string; dur?: number }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!v) return;
    let s: number, f: number;
    const go = (t: number) => { if (!s) s = t; const p = Math.min((t - s) / (dur * 1000), 1); setN(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) f = requestAnimationFrame(go); else setN(target); };
    f = requestAnimationFrame(go);
    return () => cancelAnimationFrame(f);
  }, [v, target, dur]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── Reveal ── */
function R({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-40px' });
  return <div ref={ref} className={className}><motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div></div>;
}

/* ── Course data ── */
const courses = [
  {
    id: 'bronze', level: 'Bronze', title: 'AI 入門實戰班', tag: '零基礎友善', price: 'HK$2,999', weeks: '4 週',
    color: '#CD7F32', bg: '#FDF4E8', icon: '🏅',
    desc: '專為完全零基礎設計。學會用 AI 工具提升日常工作效率，掌握 Prompt Engineering 核心技巧。',
    skills: ['Prompt Engineering', 'ChatGPT / Claude 實操', '職場效率自動化', 'AI 工具整合應用'],
    mods: [
      { w: '第 1 週', t: 'AI 基礎認知', items: ['AI 能做什麼？不能做什麼？', '主流工具深度對比', '帳號設定與安全'] },
      { w: '第 2 週', t: 'Prompt Engineering', items: ['結構化 Prompt 寫法', 'Few-shot / CoT 技巧', '角色扮演與系統指令'] },
      { w: '第 3 週', t: '職場實戰', items: ['AI 寫作與翻譯', '數據整理與分析', '會議紀錄自動化'] },
      { w: '第 4 週', t: '畢業項目', items: ['多輪對話策略', '個人 AI 工作流設計', '作品展示與點評'] },
    ],
  },
  {
    id: 'silver', level: 'Silver', title: 'AI 應用專家班', tag: '從使用者到創造者', price: 'HK$7,999', weeks: '8 週',
    color: '#6B7280', bg: '#F3F4F6', icon: '🥈',
    desc: '深入 AI 應用開發，學會串接 API、建立自動化工作流、用 AI 解決真實商業問題。',
    skills: ['API 開發與串接', '自動化工作流設計', 'AI 數據分析', '商業解決方案'],
    mods: [
      { w: '第 1-2 週', t: 'API 開發基礎', items: ['REST API 與 OpenAI API', 'Python 快速入門', 'Token 管理與成本優化'] },
      { w: '第 3-4 週', t: '自動化工作流', items: ['Zapier / Make 整合', '自動報告生成系統', '客服 AI 助手搭建'] },
      { w: '第 5-6 週', t: '數據分析', items: ['AI 輔助數據清洗', '自然語言查詢數據', '趨勢預測入門'] },
      { w: '第 7-8 週', t: '商業應用 + 畢業', items: ['AI Marketing 策略', 'SEO + AI 內容策略', '完整商業方案（畢業項目）'] },
    ],
  },
  {
    id: 'gold', level: 'Gold', title: 'AI 系統架構師班', tag: '企業級技術', price: 'HK$15,999', weeks: '12 週',
    color: '#D97706', bg: '#FEF3C7', icon: '🥇', popular: true,
    desc: '掌握 AI Agent、RAG、LangChain 等前沿技術，能獨立設計和部署企業級 AI 系統。',
    skills: ['多 Agent 系統設計', 'RAG 知識庫開發', '生產級部署', '性能與成本優化'],
    mods: [
      { w: '第 1-3 週', t: 'LLM 深度理解', items: ['Transformer 原理', '微調 vs Prompt vs RAG', 'Embedding 與向量 DB'] },
      { w: '第 4-6 週', t: 'AI Agent 開發', items: ['LangChain / LangGraph', 'Function Calling & Tools', '記憶系統設計'] },
      { w: '第 7-9 週', t: 'RAG 系統', items: ['文件分割策略', '混合搜索（BM25+Vector）', '企業知識庫實戰'] },
      { w: '第 10-12 週', t: '部署與畢業', items: ['Docker 容器化', 'API 性能優化', '完整系統部署（畢業項目）'] },
    ],
  },
  {
    id: 'openclaw', level: 'OpenClaw', title: 'OpenClaw 全方位課程', tag: '🔥 2026 最熱門', price: 'HK$9,999', weeks: '10 週',
    color: '#4169E1', bg: '#EBF0FF', icon: '🦞', featured: true,
    desc: '深入學習 2026 年最熱門的 AI 助手框架。從日常使用到專業架構師級別的系統設計與部署。',
    skills: ['OpenClaw 部署與配置', '自定義 Skill 開發', '多 Agent 編排', '企業級安全加固'],
    mods: [
      { w: '第 1-2 週', t: '入門與配置', items: ['安裝與基本配置', '連接 WhatsApp / Telegram / Discord', 'Model 選擇與切換策略'] },
      { w: '第 3-4 週', t: '進階日常使用', items: ['Cron 排程自動化', 'Web Search & Fetch', 'Node 設備配對', '語音與圖像功能'] },
      { w: '第 5-7 週', t: 'Skill & Plugin 開發', items: ['SKILL.md 規範', '自定義腳本開發', 'ClawHub 發布', 'Memory Plugin 開發'] },
      { w: '第 8-10 週', t: '架構師級別', items: ['多 Session 管理', 'Sub-agent 編排策略', '安全加固最佳實踐', '企業部署方案（畢業項目）'] },
    ],
  },
  {
    id: 'platinum', level: 'Platinum', title: 'AI 創業實戰班', tag: '技術 × 商業', price: 'HK$29,999', weeks: '16 週',
    color: '#7C3AED', bg: '#EDE9FE', icon: '💎',
    desc: '為有志創業者設計，結合技術能力與商業思維，學會打造、推廣和運營 AI 產品。',
    skills: ['AI 產品 MVP 開發', '商業計劃撰寫', '用戶增長策略', '融資與法律基礎'],
    mods: [
      { w: '第 1-4 週', t: '產品設計', items: ['AI 機會識別', '用戶研究與驗證', 'MVP 快速原型'] },
      { w: '第 5-8 週', t: '技術實現', items: ['全棧 AI 應用', '第三方服務整合', '產品迭代方法論'] },
      { w: '第 9-12 週', t: '商業運營', items: ['定價策略', '用戶獲取與留存', 'B2B vs B2C'] },
      { w: '第 13-16 週', t: '融資與規模化', items: ['Pitch Deck 製作', '投資人溝通', '法律合規與團隊'] },
    ],
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="bg-white text-[#1A1A2E]">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/"><Logo size="md" /></a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            {[['#resources','資源'],['#courses','課程'],['#why','優勢'],['#faq','FAQ'],['#contact','聯絡']].map(([h,l]) => (
              <a key={h} href={h} className="hover:text-[#4169E1] transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hidden lg:block text-xs text-gray-400 hover:text-gray-600 transition">私隱政策</a>
            <motion.a href="#courses" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="bg-[#4169E1] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-200/60 hover:bg-[#3358C8] transition">
              免費試堂
            </motion.a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO with 3D ═══ */}
      <section className="relative pt-24 pb-4 md:pt-32 md:pb-8 min-h-[85vh] flex items-center overflow-hidden">
        {/* 3D Background */}
        <HeroBg3D />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center w-full">
          {/* Left */}
          <div className="z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#4169E1]/10 text-[#4169E1] px-4 py-1.5 rounded-full text-xs font-bold mb-5 tracking-wide border border-[#4169E1]/20">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-[#4169E1] opacity-75"/><span className="relative h-1.5 w-1.5 rounded-full bg-[#4169E1]"/></span>
              2026 最受歡迎 AI 課程
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl md:text-[3.25rem] lg:text-[3.75rem] font-black leading-[1.08] tracking-tight mb-5">
              用 AI 技能
              <br />
              <span className="bg-gradient-to-r from-[#4169E1] to-[#7C3AED] bg-clip-text text-transparent">升級你的職涯</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
              className="text-base md:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              從零基礎到架構師，系統化 AI 技能培訓。
              <br className="hidden md:block" />
              真實項目實戰，業界導師親授，完成即具備即戰力。
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}
              className="flex gap-3">
              <motion.a href="#courses" whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(65,105,225,0.35)' }} whileTap={{ scale: 0.97 }}
                className="bg-[#4169E1] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200/60 hover:bg-[#3358C8] transition">
                瀏覽課程 →
              </motion.a>
              <motion.a href="#why" whileHover={{ scale: 1.02 }}
                className="border-2 border-gray-200 text-gray-600 px-7 py-3.5 rounded-xl font-semibold text-sm hover:border-[#4169E1] hover:text-[#4169E1] transition">
                了解更多
              </motion.a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mt-10 text-sm text-gray-400">
              <div className="flex -space-x-2">
                {['😊','🧑‍💻','👩‍🎓','🧑‍🏫','👨‍💼'].map((e,i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs border-2 border-white">{e}</span>
                ))}
              </div>
              <span>已有 <strong className="text-gray-600">2,800+</strong> 學員完成課程</span>
            </motion.div>
          </div>

          {/* Right — AI-generated full body mascot */}
          <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center md:justify-end z-10">
            <div className="relative">
              {/* Floating decorative blocks */}
              <motion.div animate={{ y: [-8, 8, -8], rotate: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-6 w-10 h-10 bg-[#FF6B35] rounded-xl shadow-lg shadow-orange-200/50 flex items-center justify-center text-white font-bold text-xs z-20">AI</motion.div>
              <motion.div animate={{ y: [6, -6, 6], rotate: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 -right-4 w-8 h-8 bg-[#10B981] rounded-lg shadow-lg shadow-green-200/50 z-20" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 -right-6 w-6 h-6 bg-[#7C3AED] rounded-md shadow-lg shadow-purple-200/50 opacity-80 z-20" />
              <motion.div animate={{ y: [4, -4, 4], x: [-3, 3, -3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 -left-4 w-5 h-5 bg-[#4169E1] rounded-sm shadow-lg shadow-blue-200/50 opacity-60 z-20" />
              {/* Original mascot with float animation */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Image src="/mascot.jpg" alt="SkillAI Mascot" width={340} height={340}
                  className="relative rounded-2xl shadow-2xl shadow-blue-900/15 border-4 border-white/80" priority />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-10 bg-gradient-to-r from-[#F0F4FF] to-[#F5F0FF]">
        <div className="max-w-5xl mx-auto px-6">
          <R>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: 2800, s: '+', l: '學員完成課程', ic: '🎓' },
                { n: 92, s: '%', l: '學員推薦比率', ic: '⭐' },
                { n: 50, s: '+', l: '業界導師', ic: '👨‍🏫' },
                { n: 15, s: '+', l: '實戰項目', ic: '🛠️' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3">
                  <span className="text-3xl">{s.ic}</span>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-[#4169E1]"><CountUp target={s.n} suffix={s.s} /></div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ═══ RESOURCES ═══ */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">資源分享</p></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black text-center mb-3">必備工具・技能・連結</h2></R>
          <R d={0.1}><p className="text-gray-400 text-center max-w-xl mx-auto mb-14">精選 AI 開發必備資源，助你快速上手並持續成長。所有連結均可直接點擊使用。</p></R>

          {/* ── Must-Need Tools ── */}
          <R d={0.12}>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🛠️</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A2E]">Must-Need Tools</h3>
                  <p className="text-sm text-gray-400">AI 開發必備工具</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: '🤖', title: 'Claude', tag: 'AI 助手',
                    desc: 'Anthropic 最強 AI 助手 — 研究、寫作、編碼和複雜推理的首選工具。',
                    url: 'https://claude.ai',
                    color: '#D97706',
                  },
                  {
                    icon: '⌨️', title: 'Claude Code', tag: 'CLI Agent',
                    desc: 'Anthropic 官方 CLI 工具 — 讓 Claude 直接編輯檔案、執行命令、構建軟體。',
                    url: 'https://docs.anthropic.com/en/docs/claude-code/overview',
                    color: '#7C3AED',
                  },
                  {
                    icon: '🦞', title: 'OpenClaw', tag: '🔥 最熱門',
                    desc: '2026 最熱門 AI 助手框架 — 從日常使用到架構師級部署，一站式開源平台。',
                    url: 'https://openclaw.com',
                    color: '#4169E1',
                  },
                  {
                    icon: '💻', title: 'Cursor', tag: 'AI IDE',
                    desc: 'AI 優先的程式碼編輯器 — 基於 VS Code，深度整合 Claude 和 GPT。',
                    url: 'https://cursor.com',
                    color: '#10B981',
                  },
                  {
                    icon: '🧠', title: 'Vercel AI SDK', tag: 'SDK',
                    desc: 'TypeScript 工具包 — 用 React 和 Next.js 構建 AI 串流介面。',
                    url: 'https://sdk.vercel.ai',
                    color: '#EC4899',
                  },
                  {
                    icon: '🔧', title: 'Skills.sh', tag: 'Agent Skills',
                    desc: 'Vercel 開源 Agent Skills 生態 — 為 AI 編碼代理提供可重用能力。',
                    url: 'https://skills.sh',
                    color: '#FF6B35',
                  },
                ].map((tool, i) => (
                  <motion.a key={tool.title} href={tool.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all hover:-translate-y-1 block"
                    style={{ borderTopColor: tool.color, borderTopWidth: '3px' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{tool.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm group-hover:text-[#4169E1] transition-colors">{tool.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">{tool.tag}</span>
                          <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#4169E1] transition-colors ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </R>

          {/* ── Must-Need Skills ── */}
          <R d={0.12}>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">📚</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A2E]">Must-Need Skills</h3>
                  <p className="text-sm text-gray-400">AI 開發核心技能</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: '🎯', title: 'Prompt Engineering', tag: '核心',
                    desc: '掌握 AI 提示詞工程 — Chain-of-Thought、Few-shot、系統提示設計。',
                    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
                    color: '#4169E1',
                  },
                  {
                    icon: '⚡', title: 'Full-Stack Development', tag: '開發',
                    desc: 'Next.js、React、TypeScript、Tailwind CSS — 現代 Web 開發全端技術棧。',
                    url: 'https://nextjs.org/docs',
                    color: '#10B981',
                  },
                  {
                    icon: '🤖', title: 'AI Agent 開發', tag: 'AI/ML',
                    desc: '構建 AI 功能 — 串流回應、Function Calling、RAG Pipeline、多代理編排。',
                    url: 'https://docs.anthropic.com/en/api/getting-started',
                    color: '#7C3AED',
                  },
                  {
                    icon: '🚀', title: 'DevOps & CI/CD', tag: '部署',
                    desc: '自動化部署流程、容器化、基礎設施即程式碼、GitHub Actions。',
                    url: 'https://vercel.com/docs/deployments/overview',
                    color: '#D97706',
                  },
                  {
                    icon: '🎨', title: 'UI/UX 設計', tag: '設計',
                    desc: '以用戶為中心的設計、WCAG 2.2 無障礙、響應式佈局和設計系統。',
                    url: 'https://www.w3.org/WAI/WCAG22/quickref/',
                    color: '#EC4899',
                  },
                  {
                    icon: '🔌', title: 'API 架構設計', tag: '後端',
                    desc: 'RESTful API 設計、GraphQL Schema、認證模式與速率限制。',
                    url: 'https://swagger.io/specification/',
                    color: '#FF6B35',
                  },
                ].map((skill, i) => (
                  <motion.a key={skill.title} href={skill.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all hover:-translate-y-1 block"
                    style={{ borderTopColor: skill.color, borderTopWidth: '3px' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{skill.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm group-hover:text-[#4169E1] transition-colors">{skill.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">{skill.tag}</span>
                          <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#4169E1] transition-colors ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{skill.desc}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </R>

          {/* ── Must-Need Connections ── */}
          <R d={0.12}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">🔗</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A2E]">Must-Need Connections</h3>
                  <p className="text-sm text-gray-400">部署與擴展必備平台</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: '▲', title: 'Vercel', tag: '部署',
                    desc: '零配置部署、擴展和管理 Web 應用 — 前端雲端的最佳選擇。',
                    url: 'https://vercel.com',
                    color: '#000000',
                  },
                  {
                    icon: '☁️', title: 'Cloudflare', tag: 'CDN & 安全',
                    desc: '全球 CDN、DDoS 防護、Workers 邊緣計算和 DNS 管理。',
                    url: 'https://cloudflare.com',
                    color: '#F48120',
                  },
                  {
                    icon: '🐙', title: 'GitHub', tag: '版本控制',
                    desc: '程式碼協作、版本控制、CI/CD with Actions 和開源社群。',
                    url: 'https://github.com',
                    color: '#333333',
                  },
                  {
                    icon: '🛡️', title: 'Anthropic', tag: 'AI 平台',
                    desc: 'Claude 背後的 AI 安全公司 — API 存取、模型文件和研究。',
                    url: 'https://anthropic.com',
                    color: '#D97706',
                  },
                  {
                    icon: '⚡', title: 'Supabase', tag: 'BaaS',
                    desc: '開源 Firebase 替代方案 — Postgres 資料庫、認證、儲存和即時功能。',
                    url: 'https://supabase.com',
                    color: '#3ECF8E',
                  },
                  {
                    icon: '📧', title: 'Resend', tag: '電郵 API',
                    desc: '現代電郵 API — 使用 React Email 模板發送交易型電子郵件。',
                    url: 'https://resend.com',
                    color: '#7C3AED',
                  },
                ].map((conn, i) => (
                  <motion.a key={conn.title} href={conn.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all hover:-translate-y-1 block"
                    style={{ borderTopColor: conn.color, borderTopWidth: '3px' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{conn.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm group-hover:text-[#4169E1] transition-colors">{conn.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">{conn.tag}</span>
                          <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#4169E1] transition-colors ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{conn.desc}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">為什麼選我們</p></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black text-center mb-3">不賣證書，教真本事</h2></R>
          <R d={0.1}><p className="text-gray-400 text-center max-w-xl mx-auto mb-6">每個課程經過業界實戰驗證，導師是正在一線工作的 AI 從業者。</p></R>
          <R d={0.15}><div className="flex justify-center mb-6">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <Image src="/mascot-teach.jpg" alt="Teaching" width={120} height={120} className="drop-shadow-lg rounded-xl" />
            </motion.div>
          </div></R>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { ic: '🎯', t: '100% 實戰導向', d: '每週真實項目練習，畢業即有完整作品集。不背理論、不考試。', accent: '#4169E1' },
              { ic: '👨‍🏫', t: '業界導師親授', d: '所有導師都是一線 AI 從業者，教的是公司真正在用的技術。', accent: '#10B981' },
              { ic: '🔄', t: '月度內容更新', d: 'AI 領域變化極快，課程每月更新，學到的永遠是最新知識。', accent: '#7C3AED' },
              { ic: '💬', t: '小班制 ≤ 30 人', d: '確保每位學員得到足夠關注，加入 2,800+ 學員社群持續交流。', accent: '#D97706' },
              { ic: '🛠️', t: '最新工具實操', d: '使用 OpenClaw、LangChain、Claude API 等業界最新工具。', accent: '#FF6B35' },
              { ic: '📈', t: '職涯支援', d: '簡歷優化、面試輔導、企業推薦。92% 學員表示直接幫助了職涯。', accent: '#EC4899' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all hover:-translate-y-1"
                style={{ borderTopColor: f.accent, borderTopWidth: '3px' }}>
                <span className="text-3xl block mb-3">{f.ic}</span>
                <h3 className="font-bold text-lg mb-1.5">{f.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COURSES ═══ */}
      <section id="courses" className="py-20 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">課程一覽</p></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black text-center mb-3">選擇你的起點</h2></R>
          <R d={0.1}><p className="text-gray-400 text-center max-w-xl mx-auto mb-14">所有課程包含終身內容更新和社群支援。由 DeFiner Tech Ltd 營運。</p></R>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className={`relative bg-white rounded-xl overflow-hidden border-2 hover:shadow-xl transition-all group hover:-translate-y-1
                  ${c.popular ? 'border-[#D97706] ring-2 ring-[#D97706]/20' : c.featured ? 'border-[#4169E1] ring-2 ring-[#4169E1]/20' : 'border-gray-100 hover:border-blue-200'}`}>
                <div className="h-1.5" style={{ background: c.color }} />
                {c.popular && <div className="absolute top-3.5 right-3 bg-[#D97706] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">最受歡迎</div>}
                {c.featured && <div className="absolute top-3.5 right-3 bg-[#4169E1] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">🔥 新課程</div>}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1"><span className="text-2xl">{c.icon}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>{c.level}</span></div>
                  <h3 className="text-lg font-bold mb-0.5">{c.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{c.tag}</p>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{c.desc}</p>
                  <div className="flex items-baseline gap-1.5 mb-4"><span className="text-2xl font-black" style={{ color: c.color }}>{c.price}</span><span className="text-xs text-gray-400">/ {c.weeks}</span></div>
                  <ul className="space-y-1.5 mb-5">{c.skills.map((s, j) => (<li key={j} className="flex items-center gap-1.5 text-xs text-gray-600"><span style={{ color: c.color }}>✓</span>{s}</li>))}</ul>
                  <a href={`#detail-${c.id}`} className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-95" style={{ background: c.bg, color: c.color }}>查看詳細大綱 →</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COURSE DETAILS ═══ */}
      {courses.map((c) => (
        <section key={c.id} id={`detail-${c.id}`} className="py-16 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <R>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.color }}>{c.level} · {c.weeks}</span>
                <h2 className="text-2xl md:text-3xl font-black">{c.title}</h2>
                <span className="text-lg font-black" style={{ color: c.color }}>{c.price}</span>
              </div>
            </R>
            <R d={0.05}><p className="text-gray-500 mb-8 max-w-2xl">{c.desc}</p></R>
            <div className="grid md:grid-cols-2 gap-4">
              {c.mods.map((m, j) => (
                <motion.div key={j} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: j * 0.08 }}
                  className="bg-[#FAFBFF] rounded-xl p-5 border border-gray-100 hover:shadow-md transition hover:border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: c.color }}>{m.w}</span>
                    <h4 className="font-bold">{m.t}</h4>
                  </div>
                  <ul className="space-y-1.5">{m.items.map((item, k) => (<li key={k} className="text-sm text-gray-500 flex items-start gap-1.5"><span className="text-gray-300 mt-0.5">•</span>{item}</li>))}</ul>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-xl font-bold text-white text-sm shadow-lg transition" style={{ background: c.color }}>
                報名 {c.title}
              </motion.button>
            </div>
          </div>
        </section>
      ))}

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">學員心聲</p></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black text-center mb-4">他們這樣說</h2></R>
          <R d={0.1}><div className="flex justify-center mb-6">
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
              <Image src="/mascot-celebrate.jpg" alt="Celebrating" width={100} height={100} className="drop-shadow-lg rounded-xl" />
            </motion.div>
          </div></R>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah L.', role: 'Marketing Manager', course: 'Bronze', text: '完全零基礎入學，四週後已經能用 AI 把每日報告時間從 2 小時壓縮到 15 分鐘。同事都問我偷偷學了什麼。' },
              { name: 'Kevin W.', role: 'Software Engineer', course: 'Gold', text: 'RAG 系統那部分太實用了！課程結束後我直接在公司部署了一個內部知識庫，老闆非常滿意。' },
              { name: 'Amy C.', role: 'Startup Founder', course: 'OpenClaw', text: 'OpenClaw 課程讓我用一個週末就搭建了完整的客服 AI 系統。現在 80% 的客戶查詢都自動處理了。' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#FAFBFF] rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_,j) => <span key={j} className="text-[#F59E0B] text-sm">★</span>)}</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4169E1]/10 flex items-center justify-center text-[#4169E1] font-bold text-xs">{t.name[0]}</div>
                  <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-gray-400">{t.role} · {t.course} 學員</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-20 bg-[#F8FAFF]">
        <div className="max-w-2xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">FAQ</p></R>
          <R d={0.05}><h2 className="text-3xl font-black text-center mb-4">常見問題</h2></R>
          <R d={0.1}><div className="flex justify-center mb-6">
            <motion.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Image src="/mascot-think.jpg" alt="Thinking" width={100} height={100} className="drop-shadow-lg rounded-xl" />
            </motion.div>
          </div></R>
          {[
            { q: '完全沒有技術背景，可以嗎？', a: '當然！Bronze 班就是為零基礎設計。超過 60% 的學員入學時沒有任何技術背景，用大量實操代替枯燥理論。' },
            { q: '完成課程後獲得什麼？', a: 'SkillAI 結業證書 + 完整實戰作品集。更重要的是真正能用的技能——我們注重實際能力，不是一張紙。' },
            { q: '課程會更新嗎？', a: '會！購買後終身內容更新。例如 OpenClaw 課程就是根據 2026 最新趨勢新增的。' },
            { q: '上課形式？', a: '每週 2 次線上直播（各 2 小時）+ 課後練習 + 錄影回放 + Slack 社群即時答疑。' },
            { q: '可以退款嗎？', a: '14 天無理由退款保證，全額退款，沒有任何條件。' },
            { q: 'OpenClaw 課程適合誰？', a: '前半段（入門）適合所有人；後半段（架構師）適合有技術基礎、想深入定制和部署 AI 系統的開發者。' },
          ].map((f, i) => (
            <R key={i} d={i * 0.03}>
              <details className="group mb-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <summary className="flex justify-between items-center p-4 cursor-pointer font-semibold text-sm hover:text-[#4169E1] transition">
                  {f.q}<span className="text-gray-300 group-open:rotate-45 transition-transform ml-4 text-lg flex-shrink-0">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </details>
            </R>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <R><p className="text-sm font-bold text-[#4169E1] tracking-widest uppercase mb-3 text-center">聯絡我們</p></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black text-center mb-12">有任何問題？</h2></R>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <R>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#4169E1]/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">📧</span></div>
                  <div><h3 className="font-bold text-sm mb-1">電子郵件</h3><a href="mailto:assistant4ed@gmail.com" className="text-[#4169E1] text-sm hover:underline">assistant4ed@gmail.com</a><p className="text-xs text-gray-400 mt-1">一般查詢、課程諮詢、合作提案</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">💬</span></div>
                  <div><h3 className="font-bold text-sm mb-1">WhatsApp</h3><a href="https://wa.me/85257961104" className="text-[#10B981] text-sm hover:underline">+852 5796 1104</a><p className="text-xs text-gray-400 mt-1">週一至五 9:00-18:00</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0"><span className="text-lg">🏢</span></div>
                  <div><h3 className="font-bold text-sm mb-1">營運公司</h3><p className="text-sm text-gray-700">DeFiner Tech Ltd</p><p className="text-xs text-gray-400 mt-1">香港註冊科技公司</p></div>
                </div>
              </div>
            </R>
            {/* Contact Form */}
            <R d={0.1}>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('感謝您的訊息！我們會盡快回覆。'); }}>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">姓名</label>
                  <input type="text" required placeholder="你的姓名" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/10 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">電郵</label>
                  <input type="email" required placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/10 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">感興趣的課程</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/10 transition text-gray-500">
                    <option>請選擇</option>
                    <option>Bronze — AI 入門實戰班</option>
                    <option>Silver — AI 應用專家班</option>
                    <option>Gold — AI 系統架構師班</option>
                    <option>OpenClaw — 全方位課程</option>
                    <option>Platinum — AI 創業實戰班</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">訊息</label>
                  <textarea rows={4} required placeholder="你的問題或留言..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/10 transition resize-none" />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#4169E1] text-white py-3 rounded-lg font-bold text-sm shadow-md shadow-blue-200/40 hover:bg-[#3358C8] transition">
                  發送訊息
                </motion.button>
              </form>
            </R>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 bg-gradient-to-br from-[#4169E1] via-[#3358C8] to-[#2F4FC7] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="max-w-2xl mx-auto px-6 text-center text-white relative">
          <R><div className="flex justify-center mb-4">
            <motion.div animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <Image src="/mascot-wave-wb.jpg" alt="Waving" width={120} height={120} className="drop-shadow-lg rounded-xl" />
            </motion.div>
          </div></R>
          <R d={0.05}><h2 className="text-3xl md:text-4xl font-black mb-3">準備好升級了嗎？</h2></R>
          <R d={0.08}><p className="text-blue-100 mb-8">免費試堂，體驗我們的教學。沒有綁定，沒有壓力。</p></R>
          <R d={0.16}>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }} whileTap={{ scale: 0.97 }}
              className="bg-white text-[#4169E1] px-10 py-4 rounded-xl font-black text-lg shadow-xl transition">
              免費試堂 →
            </motion.button>
          </R>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0F172A] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <Logo size="sm" />
              <p className="text-sm text-gray-500 mt-3 max-w-sm leading-relaxed">
                SkillAI.hk 是香港領先的 AI 技能培訓平台，由 DeFiner Tech Ltd 營運。我們致力提供最實用、最前沿的 AI 教育。
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">課程</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#detail-bronze" className="hover:text-white transition">Bronze 入門班</a></li>
                <li><a href="#detail-silver" className="hover:text-white transition">Silver 專家班</a></li>
                <li><a href="#detail-gold" className="hover:text-white transition">Gold 架構師班</a></li>
                <li><a href="#detail-openclaw" className="hover:text-white transition">OpenClaw 課程</a></li>
                <li><a href="#detail-platinum" className="hover:text-white transition">Platinum 創業班</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">資源</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Claude AI ↗</a></li>
                <li><a href="https://openclaw.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">OpenClaw ↗</a></li>
                <li><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Vercel ↗</a></li>
                <li><a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Cloudflare ↗</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">公司</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition">私隱政策</a></li>
                <li><a href="/terms" className="hover:text-white transition">服務條款</a></li>
                <li><a href="#contact" className="hover:text-white transition">聯絡我們</a></li>
                <li><a href="mailto:assistant4ed@gmail.com" className="hover:text-white transition">assistant4ed@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">© 2026 SkillAI.hk · DeFiner Tech Ltd · 保留所有權利</p>
            <p className="text-xs text-gray-700">Made with ❤️ in Hong Kong</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
