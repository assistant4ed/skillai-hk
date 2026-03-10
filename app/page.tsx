"use client";
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Logo from '../components/Logo';

const HeroBg3D = dynamic(() => import('../components/HeroBg3D'), { ssr: false });

/* ══════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════ */

function R({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={v ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Parallax wrapper */
function Parallax({ children, offset = 50, className = '' }: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* 3D tilt card on hover */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    setRot({ x, y });
  };
  const onLeave = () => setRot({ x: 0, y: 0 });
  return (
    <motion.div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

/* GitHub icon */
function GHIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function ExtIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */

interface Resource { icon: string; title: string; desc: string; github: string; tag: string; color: string; stars: string }

const TOOLS: Resource[] = [
  { icon: '🦞', title: 'OpenClaw', tag: '🔥 AI 框架', desc: '開源 AI 助手框架 — WhatsApp / Telegram / Discord 整合，Skill 開發。', github: 'https://github.com/openclaw/openclaw', color: '#4169E1', stars: '12.5k' },
  { icon: '⌨️', title: 'Claude Code', tag: 'CLI Agent', desc: 'Anthropic 開源 CLI — 讓 AI 直接編輯檔案和構建軟體。', github: 'https://github.com/anthropics/claude-code', color: '#7C3AED', stars: '35k' },
  { icon: '🦙', title: 'Ollama', tag: '本地 LLM', desc: '一行命令在本地運行 Llama 3、Mistral、Gemma 等模型。', github: 'https://github.com/ollama/ollama', color: '#10B981', stars: '120k' },
  { icon: '🤖', title: 'Aider', tag: 'AI 結對編程', desc: '終端機 AI 編程助手 — 直接修改本地程式碼。', github: 'https://github.com/aider-ai/aider', color: '#D97706', stars: '30k' },
  { icon: '🖥️', title: 'Open WebUI', tag: '自建介面', desc: '自架 ChatGPT 風格介面 — 支援多種 AI 模型後端。', github: 'https://github.com/open-webui/open-webui', color: '#EC4899', stars: '80k' },
  { icon: '🧵', title: 'Fabric', tag: 'Prompt 模式', desc: '經過驗證的 AI Prompt 模式庫 — 數百種現成模式。', github: 'https://github.com/danielmiessler/fabric', color: '#FF6B35', stars: '28k' },
];

const FRAMEWORKS: Resource[] = [
  { icon: '🔗', title: 'LangChain', tag: 'LLM 框架', desc: 'LLM 應用框架 — Chain、Agent、Tool、Memory 一站式構建。', github: 'https://github.com/langchain-ai/langchain', color: '#10B981', stars: '105k' },
  { icon: '👥', title: 'CrewAI', tag: '多 Agent', desc: '多代理協作框架 — 定義角色和任務，AI 自動分工。', github: 'https://github.com/crewAIInc/crewAI', color: '#4169E1', stars: '25k' },
  { icon: '🌐', title: 'LiteLLM', tag: '統一閘道', desc: '一套 API 呼叫 100+ 模型 — OpenAI、Claude、Gemini 通用。', github: 'https://github.com/BerriAI/litellm', color: '#7C3AED', stars: '18k' },
  { icon: '🧠', title: 'Mem0', tag: 'AI 記憶', desc: 'AI 長期記憶層 — 個人化對話、跨 Session 記憶。', github: 'https://github.com/mem0ai/mem0', color: '#D97706', stars: '15k' },
  { icon: '🔥', title: 'Firecrawl', tag: 'AI 爬蟲', desc: '專為 LLM 設計的爬蟲 — 自動轉 Markdown 格式。', github: 'https://github.com/mendableai/firecrawl', color: '#FF6B35', stars: '20k' },
  { icon: '🌍', title: 'Browser Use', tag: '瀏覽器 AI', desc: '讓 AI 自動操作瀏覽器 — 自然語言驅動。', github: 'https://github.com/browser-use/browser-use', color: '#EC4899', stars: '55k' },
];

const INFRA: Resource[] = [
  { icon: '▲', title: 'Next.js', tag: 'React 框架', desc: 'Vercel 全端框架 — SSR、SSG、App Router。', github: 'https://github.com/vercel/next.js', color: '#000000', stars: '130k' },
  { icon: '⚡', title: 'Supabase', tag: '開源 BaaS', desc: '開源 Firebase 替代 — Postgres、Auth、Realtime。', github: 'https://github.com/supabase/supabase', color: '#3ECF8E', stars: '78k' },
  { icon: '🔄', title: 'n8n', tag: '工作流', desc: '開源工作流自動化 — 連接 400+ 服務。', github: 'https://github.com/n8n-io/n8n', color: '#FF6B35', stars: '60k' },
  { icon: '🎨', title: 'Tailwind CSS', tag: 'CSS 框架', desc: 'Utility-first CSS — 快速構建現代響應式介面。', github: 'https://github.com/tailwindlabs/tailwindcss', color: '#06B6D4', stars: '85k' },
  { icon: '🧩', title: 'Dify', tag: 'LLM 平台', desc: '開源 LLM 應用平台 — 視覺化構建 AI 工作流。', github: 'https://github.com/langgenius/dify', color: '#7C3AED', stars: '70k' },
  { icon: '📡', title: 'Vercel AI SDK', tag: 'AI 串流', desc: '開源 AI 串流 UI 工具包 — React/Next.js。', github: 'https://github.com/vercel/ai', color: '#4169E1', stars: '12k' },
];

interface RefSite { name: string; url: string; desc: string; tag: string; color: string }

const REF_SITES: RefSite[] = [
  { name: 'Toolify.ai', url: 'https://www.toolify.ai', desc: '28,000+ AI 工具目錄 — 搜尋、篩選、比較所有 AI 工具。', tag: 'AI 目錄', color: '#4169E1' },
  { name: 'AIxploria', url: 'https://www.aixploria.com/en/', desc: '全球最大免費 AI 工具清單 — 5,000+ 工具分類收錄。', tag: 'AI 目錄', color: '#10B981' },
  { name: 'There\'s An AI For That', url: 'https://theresanaiforthat.com', desc: '按用途搜尋 AI 工具 — 每日更新最新 AI 產品。', tag: 'AI 搜尋', color: '#7C3AED' },
  { name: 'Future Tools', url: 'https://www.futuretools.io', desc: '精選 AI 工具集合 — 含影片評測和使用教學。', tag: 'AI 評測', color: '#D97706' },
  { name: 'OpenAlternative', url: 'https://openalternative.co', desc: '開源軟體替代方案目錄 — 找到免費的替代工具。', tag: '開源目錄', color: '#EC4899' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com', desc: '全球最大新產品發現平台 — 每日熱門科技產品。', tag: '產品發現', color: '#FF6B35' },
  { name: 'GitHub Trending', url: 'https://github.com/trending', desc: 'GitHub 每日熱門開源項目 — 追蹤最新技術趨勢。', tag: '開源趨勢', color: '#333333' },
  { name: 'Awesome Lists', url: 'https://github.com/sindresorhus/awesome', desc: '各領域精選資源清單集合 — 社群維護的知識庫。', tag: '資源清單', color: '#3ECF8E' },
  { name: 'Dev.to', url: 'https://dev.to', desc: '開發者社群 — 技術文章、教學、討論。', tag: '開發社群', color: '#06B6D4' },
  { name: 'Skills.sh', url: 'https://skills.sh', desc: 'Vercel 開源 Agent Skills 生態 — AI 代理可重用能力。', tag: 'Agent Skills', color: '#000000' },
];

type Tab = 'resources' | 'openclaw' | 'claudecode' | 'images';
const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'resources', label: '開源資源', emoji: '📦' },
  { id: 'openclaw', label: 'OpenClaw 教學', emoji: '🦞' },
  { id: 'claudecode', label: 'Claude Code + Antigravity', emoji: '⌨️' },
  { id: 'images', label: 'Images 指南', emoji: '🖼️' },
];

/* ══════════════════════════════════════════════════
   RESOURCE CARD
   ══════════════════════════════════════════════════ */

function ResourceCard({ r, i }: { r: Resource; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.5 }}
    >
      <TiltCard>
        <a href={r.github} target="_blank" rel="noopener noreferrer"
          className="group block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300 hover:-translate-y-1 h-full"
          style={{ borderTopColor: r.color, borderTopWidth: '3px' }}>
          <div className="flex items-start gap-3.5">
            <span className="text-2xl mt-0.5 block" style={{ transform: 'translateZ(20px)' }}>{r.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-bold text-[15px] group-hover:text-[#4169E1] transition-colors">{r.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">{r.tag}</span>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{r.desc}</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 group-hover:text-[#4169E1] transition-colors">
                  <GHIcon className="w-3.5 h-3.5" /> GitHub <ExtIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="text-[11px] text-gray-300 font-medium">⭐ {r.stars}</span>
              </div>
            </div>
          </div>
        </a>
      </TiltCard>
    </motion.div>
  );
}

/* Section header for resource columns */
function SectionHead({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <R>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl shadow-sm border border-gray-100">{emoji}</span>
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">{title}</h2>
          <p className="text-sm text-gray-400">{sub}</p>
        </div>
      </div>
    </R>
  );
}

/* ══════════════════════════════════════════════════
   TUTORIAL STEP — beginner-friendly
   ══════════════════════════════════════════════════ */

interface StepProps {
  num: number;
  title: string;
  desc: string;
  link?: { label: string; url: string };
  code?: string;
  tips?: string[];
  color: string;
}

function Step({ num, title, desc, link, code, tips, color }: StepProps) {
  return (
    <R d={num * 0.03}>
      <div className="relative pl-12 pb-10 group">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent group-last:hidden" />
        {/* Step number */}
        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shadow-lg" style={{ background: color }}>
          {num}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <h4 className="font-bold text-base mb-2">{title}</h4>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>

          {code && (
            <pre className="bg-[#0F172A] text-gray-300 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto font-mono mb-3 border border-gray-800">
              <code>{code}</code>
            </pre>
          )}

          {tips && (
            <ul className="space-y-1.5 mb-3">
              {tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                  <span className="text-[#4169E1] font-bold mt-0.5">→</span>{t}
                </li>
              ))}
            </ul>
          )}

          {link && (
            <a href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#4169E1]/10 text-[#4169E1] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4169E1]/20 transition-colors">
              {link.label} <ExtIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </R>
  );
}

/* ══════════════════════════════════════════════════
   TUTORIALS
   ══════════════════════════════════════════════════ */

function OpenClawTutorial() {
  return (
    <div className="max-w-3xl mx-auto">
      <R><div className="text-center mb-10">
        <span className="text-5xl block mb-3">🦞</span>
        <h2 className="text-2xl md:text-3xl font-black mb-2">OpenClaw 新手入門</h2>
        <p className="text-gray-400">4 個簡單步驟，10 分鐘內啟動你的 AI 助手</p>
        <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 text-sm text-[#4169E1] hover:underline font-medium">
          <GHIcon /> 查看原始碼 →
        </a>
      </div></R>

      <Step num={1} title="安裝 OpenClaw" color="#4169E1"
        desc="只需一行命令即可安裝。你需要先安裝 Node.js（如未安裝，點擊下方連結）。"
        code="npm install -g openclaw"
        link={{ label: '下載 Node.js', url: 'https://nodejs.org' }}
      />
      <Step num={2} title="建立你的第一個專案" color="#10B981"
        desc="用一個命令初始化新專案，OpenClaw 會自動建立所有需要的檔案。"
        code={'openclaw init my-assistant\ncd my-assistant'}
        link={{ label: 'OpenClaw 文件', url: 'https://github.com/openclaw/openclaw#readme' }}
      />
      <Step num={3} title="設定你的 AI 模型" color="#7C3AED"
        desc="告訴 OpenClaw 用哪個 AI 模型。你可以使用 Claude、GPT 或免費的本地模型（Ollama）。"
        code={'# 使用 Claude（推薦）\nopenclaw config set api-key YOUR_KEY\nopenclaw config set model claude-sonnet-4-20250514\n\n# 或使用免費本地模型\nollama pull llama3\nopenclaw config set model ollama/llama3'}
        tips={[
          '取得 Claude API Key → anthropic.com',
          '想免費？用 Ollama 跑本地模型',
        ]}
        link={{ label: '取得 Claude API Key', url: 'https://console.anthropic.com' }}
      />
      <Step num={4} title="連接通訊平台並啟動" color="#D97706"
        desc="把 OpenClaw 連到你常用的通訊軟體 — WhatsApp、Telegram 或 Discord。"
        code={'# 連接 Telegram（最簡單）\nopenclaw connect telegram BOT_TOKEN\n\n# 啟動！\nopenclaw start'}
        tips={[
          'Telegram 最容易設定 — 搜尋 @BotFather 建立 Bot',
          'WhatsApp 需要 Business API（適合商業用途）',
          'Discord 適合團隊和社群使用',
        ]}
        link={{ label: '建立 Telegram Bot', url: 'https://t.me/BotFather' }}
      />

      <R><div className="bg-gradient-to-r from-[#4169E1]/5 to-[#7C3AED]/5 rounded-2xl p-6 border border-blue-100 text-center">
        <p className="text-lg font-bold mb-1">完成！你的 AI 助手已經上線了 🎉</p>
        <p className="text-sm text-gray-400">下一步：學習建立自定義 Skill → <a href="https://github.com/openclaw/openclaw/blob/main/docs/skills.md" target="_blank" rel="noopener noreferrer" className="text-[#4169E1] hover:underline">Skill 開發指南 →</a></p>
      </div></R>
    </div>
  );
}

function ClaudeCodeTutorial() {
  return (
    <div className="max-w-3xl mx-auto">
      <R><div className="text-center mb-10">
        <span className="text-5xl block mb-3">⌨️</span>
        <h2 className="text-2xl md:text-3xl font-black mb-2">Claude Code + Antigravity</h2>
        <p className="text-gray-400">AI 編程助手 + 圖像生成工具的完整設定指南</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#7C3AED] hover:underline font-medium"><GHIcon /> Claude Code</a>
          <a href="https://github.com/anthropics/antigravity" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#EC4899] hover:underline font-medium"><GHIcon /> Antigravity</a>
        </div>
      </div></R>

      {/* Claude Code */}
      <R><h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center">CC</span>
        Claude Code 設定
      </h3></R>

      <Step num={1} title="安裝 Claude Code" color="#7C3AED"
        desc="用 npm 全域安裝。安裝後在任何專案資料夾中輸入 claude 即可啟動。"
        code="npm install -g @anthropic-ai/claude-code"
        tips={[
          '需要 Node.js 18 以上版本',
          '支援 macOS、Linux、Windows (WSL2)',
        ]}
        link={{ label: '安裝指南', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' }}
      />
      <Step num={2} title="在你的專案中啟動" color="#4169E1"
        desc="進入你的專案資料夾，輸入 claude 啟動。首次使用會引導你設定 API Key。"
        code={'cd your-project\nclaude\n\n# 常用快捷鍵\n# /help   → 查看所有命令\n# /compact → 節省 Token\n# /cost   → 查看用量'}
        link={{ label: '完整命令列表', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-usage' }}
      />
      <Step num={3} title="建立 CLAUDE.md 設定檔" color="#10B981"
        desc="在專案根目錄放一個 CLAUDE.md 檔案，告訴 Claude 你的專案規則。這樣它會更準確地幫你寫程式。"
        code={'# CLAUDE.md（放在專案根目錄）\n\n## 專案\n這是一個 Next.js 16 + TypeScript + Tailwind 專案。\n\n## 常用命令\n- npm run dev → 啟動開發伺服器\n- npm run build → 正式構建\n\n## 規則\n- 使用繁體中文寫註釋\n- 遵循 Conventional Commits'}
        link={{ label: 'CLAUDE.md 範例', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' }}
      />

      {/* Antigravity */}
      <R><h3 className="text-lg font-bold mb-6 mt-10 flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-[#EC4899] text-white text-xs font-bold flex items-center justify-center">AG</span>
        Antigravity 圖像工具
      </h3></R>

      <Step num={4} title="安裝 Antigravity" color="#EC4899"
        desc="Antigravity 是 AI 圖像生成和處理工具。一行命令安裝，立即可用。"
        code={'npm install -g antigravity\n\n# 設定 API Key\nantigravity config set api-key YOUR_KEY'}
        link={{ label: 'Antigravity GitHub', url: 'https://github.com/anthropics/antigravity' }}
      />
      <Step num={5} title="搭配 Claude Code 使用" color="#D97706"
        desc="在 Claude Code 中直接下指令生成圖片。Claude 會呼叫 Antigravity 處理圖像任務。"
        code={'# 在 Claude Code 對話中直接說：\n# "幫我生成一張產品圖片"\n# "把這張圖片轉成 WebP 格式並壓縮"\n# "批量處理 images 資料夾的所有圖片"'}
        tips={[
          '支援生成、壓縮、格式轉換、批量處理',
          '自動整合到你的 Next.js 專案',
          '配合 Claude 視覺功能做圖片 QA',
        ]}
      />

      <R><div className="bg-gradient-to-r from-[#7C3AED]/5 to-[#EC4899]/5 rounded-2xl p-6 border border-purple-100 text-center">
        <p className="text-lg font-bold mb-1">設定完成！可以開始 AI 編程了 🚀</p>
        <p className="text-sm text-gray-400">試試在 Claude Code 中說 &ldquo;幫我建立一個登入頁面&rdquo;</p>
      </div></R>
    </div>
  );
}

function ImagesTutorial() {
  return (
    <div className="max-w-3xl mx-auto">
      <R><div className="text-center mb-10">
        <span className="text-5xl block mb-3">🖼️</span>
        <h2 className="text-2xl md:text-3xl font-black mb-2">AI 圖像指南</h2>
        <p className="text-gray-400">從生成到優化，圖片處理全攻略</p>
      </div></R>

      <Step num={1} title="選擇圖像生成工具" color="#EC4899"
        desc="根據你的需求選擇合適的開源工具。以下都是免費且可本地運行的。"
        tips={[
          'Stable Diffusion WebUI — 功能最全面',
          'ComfyUI — 節點式工作流，靈活度最高',
          'Fooocus — 最簡單，新手首選',
        ]}
        link={{ label: 'Fooocus（推薦新手）', url: 'https://github.com/lllyasviel/Fooocus' }}
      />
      <Step num={2} title="寫好 Prompt 的公式" color="#4169E1"
        desc="好的圖片 = 好的描述。用這個公式：[主題] + [風格] + [光線] + [品質]"
        code={'# 範例：產品圖\n"Professional product photo, wireless headphone,\nwhite background, studio lighting, 8k quality"\n\n# 範例：網站 Hero 圖\n"Modern tech workspace, holographic interface,\nblue neon glow, cinematic, 4k wallpaper"'}
        tips={[
          '最重要的詞放最前面（權重最高）',
          '加品質詞：detailed, high quality, 8k',
          '指定風格：photorealistic, illustration, pixel art',
          '不要用否定句（用 "clear sky" 而非 "no clouds"）',
        ]}
      />
      <Step num={3} title="壓縮和格式轉換" color="#10B981"
        desc="網站圖片一定要壓縮！用 Sharp 或 Squoosh 處理。WebP 格式比 JPEG 小 30%。"
        code={'# 安裝 Sharp\nnpm install sharp\n\n# 轉 WebP 並壓縮\nconst sharp = require("sharp");\nawait sharp("photo.jpg")\n  .resize(1200)        // 寬度 1200px\n  .webp({ quality: 85 }) // WebP 品質 85%\n  .toFile("photo.webp");'}
        link={{ label: 'Sharp GitHub', url: 'https://github.com/lovell/sharp' }}
      />
      <Step num={4} title="在 Next.js 中使用" color="#D97706"
        desc="用 Next.js 的 Image 組件自動優化圖片載入。加 priority 到首屏圖片。"
        code={'import Image from "next/image";\n\n<Image\n  src="/hero.webp"\n  alt="描述圖片內容"\n  width={1200}\n  height={630}\n  priority          // 首屏圖片必加\n  placeholder="blur" // 模糊佔位效果\n/>'}
        tips={[
          'WebP — 通用首選（所有瀏覽器支援）',
          'SVG — Logo 和圖示（無限縮放）',
          'PNG — 需要透明背景時',
        ]}
        link={{ label: 'Next.js Image 文件', url: 'https://nextjs.org/docs/app/api-reference/components/image' }}
      />
      <Step num={5} title="推薦開源工具包" color="#7C3AED"
        desc="這些工具幫你批量處理和優化圖片。"
        tips={[
          'Sharp — Node.js 高效圖片處理',
          'Squoosh CLI — Google 出品的圖片壓縮',
          'SVGO — SVG 檔案優化（減小 50%+）',
          'Upscayl — AI 圖片放大（開源桌面應用）',
        ]}
        link={{ label: 'Upscayl 下載', url: 'https://github.com/upscayl/upscayl' }}
      />

      <R><div className="bg-gradient-to-r from-[#EC4899]/5 to-[#D97706]/5 rounded-2xl p-6 border border-pink-100 text-center">
        <p className="text-lg font-bold mb-1">圖片優化完成！頁面速度大幅提升 🖼️</p>
        <p className="text-sm text-gray-400">提示：用 <a href="https://pagespeed.web.dev" target="_blank" rel="noopener noreferrer" className="text-[#4169E1] hover:underline">PageSpeed Insights</a> 檢查你的圖片分數</p>
      </div></R>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('resources');
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="bg-[#FAFBFF] text-[#1A1A2E] min-h-screen">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm shadow-gray-100/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/" className="hover:opacity-80 transition"><Logo size="md" /></a>
          <div className="hidden md:flex items-center gap-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'text-[#4169E1] bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
            <span className="w-px h-5 bg-gray-200 mx-2" />
            <a href="/courses" className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">課程</a>
            <a href="/friends" className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">文章</a>
          </div>
          <motion.a href="/courses" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="bg-[#4169E1] text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
            免費試堂
          </motion.a>
        </div>
      </nav>

      {/* ═══ HERO with 3D + scroll parallax ═══ */}
      <section ref={heroRef} className="relative pt-20 pb-6 min-h-[75vh] flex items-center overflow-hidden">
        <HeroBg3D />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-[#FAFBFF] pointer-events-none" />

        <motion.div className="relative max-w-6xl mx-auto px-6 w-full z-10" style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-[#4169E1] px-5 py-2 rounded-full text-xs font-bold mb-6 tracking-wide border border-blue-100 shadow-sm">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-[#4169E1] opacity-75"/><span className="relative h-1.5 w-1.5 rounded-full bg-[#4169E1]"/></span>
              18 個開源工具 · 10 大參考網站 · 完整教學
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              AI 開發
              <span className="bg-gradient-to-r from-[#4169E1] via-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent"> 必備資源庫</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              精選開源工具、新手友善教學、最佳參考網站。<br className="hidden md:block" />
              所有連結直接可用，為非技術背景用戶設計。
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center gap-3 flex-wrap">
              {TABS.map((t) => (
                <motion.button key={t.id} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setTab(t.id); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="bg-white/90 backdrop-blur border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:border-[#4169E1] hover:text-[#4169E1] hover:shadow-blue-100/40 hover:shadow-md transition-all">
                  {t.emoji} {t.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating decorative blocks with parallax */}
        <Parallax offset={30} className="absolute top-32 left-[8%] hidden lg:block">
          <motion.div animate={{ y: [-8, 8, -8], rotate: [0, 12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 bg-[#FF6B35] rounded-xl shadow-lg shadow-orange-200/50 flex items-center justify-center text-white font-bold text-xs opacity-80">AI</motion.div>
        </Parallax>
        <Parallax offset={-20} className="absolute top-48 right-[10%] hidden lg:block">
          <motion.div animate={{ y: [6, -6, 6], rotate: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 bg-[#7C3AED] rounded-lg shadow-lg shadow-purple-200/50 opacity-70" />
        </Parallax>
        <Parallax offset={40} className="absolute bottom-32 left-[15%] hidden lg:block">
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 bg-[#10B981] rounded-md shadow-lg shadow-green-200/50 opacity-60" />
        </Parallax>
      </section>

      {/* ═══ STICKY TAB BAR ═══ */}
      <div id="tabs" className="sticky top-16 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin py-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200
                  ${tab === t.id
                    ? 'bg-[#4169E1] text-white shadow-lg shadow-blue-200/40'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
                <span>{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      <section className="py-14 md:py-20 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-6">

          {tab === 'resources' && (
            <>
              {/* Tools */}
              <div className="mb-16">
                <SectionHead emoji="🛠️" title="Must-Need Tools" sub="AI 開發必備工具 — 全部開源" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {TOOLS.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                </div>
              </div>

              {/* Frameworks */}
              <div className="mb-16">
                <SectionHead emoji="📚" title="Must-Need Frameworks" sub="AI 應用開發框架與函式庫" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {FRAMEWORKS.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                </div>
              </div>

              {/* Infrastructure */}
              <div className="mb-16">
                <SectionHead emoji="🔗" title="Must-Need Infrastructure" sub="部署、自動化和開發基建" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {INFRA.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                </div>
              </div>

              {/* ── Reference Sites ── */}
              <div>
                <SectionHead emoji="🌐" title="10 大參考網站" sub="探索更多 AI 工具和資源的最佳網站" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {REF_SITES.map((site, i) => (
                    <motion.a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      className="group block bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:shadow-blue-50/60 transition-all duration-300 hover:-translate-y-1 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white inline-block mb-2" style={{ background: site.color }}>{site.tag}</span>
                      <h4 className="font-bold text-sm group-hover:text-[#4169E1] transition-colors mb-1">{site.name}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{site.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-300 group-hover:text-[#4169E1] transition-colors mt-2 font-medium">
                        訪問 <ExtIcon className="w-3 h-3" />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'openclaw' && <OpenClawTutorial />}
          {tab === 'claudecode' && <ClaudeCodeTutorial />}
          {tab === 'images' && <ImagesTutorial />}

        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0F172A] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">精選開源 AI 資源，<br/>助你快速上手 AI 開發。</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">開源工具</h4>
              <ul className="space-y-2 text-sm">
                {TOOLS.slice(0, 5).map(t => (
                  <li key={t.title}><a href={t.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{t.title} ↗</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">框架與基建</h4>
              <ul className="space-y-2 text-sm">
                {[...FRAMEWORKS.slice(0, 3), ...INFRA.slice(0, 2)].map(t => (
                  <li key={t.title}><a href={t.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{t.title} ↗</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">SkillAI</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/courses" className="hover:text-white transition">課程</a></li>
                <li><a href="/friends" className="hover:text-white transition">文章</a></li>
                <li><a href="/privacy" className="hover:text-white transition">私隱政策</a></li>
                <li><a href="/terms" className="hover:text-white transition">服務條款</a></li>
                <li><a href="mailto:assistant4ed@gmail.com" className="hover:text-white transition">assistant4ed@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">&copy; 2026 SkillAI.hk &middot; DeFiner Tech Ltd</p>
            <p className="text-xs text-gray-700">Made with ❤️ in Hong Kong</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
