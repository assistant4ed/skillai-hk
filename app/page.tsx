"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../components/Logo';

/* ── Reveal ── */
function R({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: '-40px' });
  return <div ref={ref} className={className}><motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div></div>;
}

/* ── Resource Card ── */
interface Resource {
  icon: string;
  title: string;
  desc: string;
  github: string;
  tag: string;
  color: string;
  stars?: string;
}

function ResourceCard({ r, i }: { r: Resource; i: number }) {
  return (
    <motion.a href={r.github} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
      className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100/80 transition-all hover:-translate-y-1 block"
      style={{ borderTopColor: r.color, borderTopWidth: '3px' }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{r.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-bold text-sm group-hover:text-[#4169E1] transition-colors">{r.title}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">{r.tag}</span>
            {r.stars && <span className="text-[10px] text-gray-400">⭐ {r.stars}</span>}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-2">{r.desc}</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 group-hover:text-[#4169E1] transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </span>
        </div>
      </div>
    </motion.a>
  );
}

/* ── Resource Data — all unique, all open-source ── */
const TOOLS: Resource[] = [
  {
    icon: '🦞', title: 'OpenClaw', tag: '🔥 AI 框架',
    desc: '2026 最熱門開源 AI 助手框架 — 支援 WhatsApp、Telegram、Discord 整合，Skill 開發和多 Agent 編排。',
    github: 'https://github.com/openclaw/openclaw',
    color: '#4169E1', stars: '12.5k',
  },
  {
    icon: '⌨️', title: 'Claude Code', tag: 'CLI Agent',
    desc: 'Anthropic 官方開源 CLI — 讓 Claude 直接編輯檔案、執行命令、構建完整軟體專案。',
    github: 'https://github.com/anthropics/claude-code',
    color: '#7C3AED', stars: '35k',
  },
  {
    icon: '🦙', title: 'Ollama', tag: '本地 LLM',
    desc: '在本地運行 Llama 3、Mistral、Gemma 等開源大模型。簡單一行命令即可啟動。',
    github: 'https://github.com/ollama/ollama',
    color: '#10B981', stars: '120k',
  },
  {
    icon: '🤖', title: 'Aider', tag: 'AI 結對編程',
    desc: '終端機內的 AI 編程助手 — 支援 Claude、GPT，直接修改本地程式碼。',
    github: 'https://github.com/aider-ai/aider',
    color: '#D97706', stars: '30k',
  },
  {
    icon: '🖥️', title: 'Open WebUI', tag: '自建 AI 介面',
    desc: '自架 ChatGPT 介面 — 支援 Ollama、OpenAI、Claude API，完全掌控你的數據。',
    github: 'https://github.com/open-webui/open-webui',
    color: '#EC4899', stars: '80k',
  },
  {
    icon: '🧵', title: 'Fabric', tag: 'Prompt 模式庫',
    desc: 'Daniel Miessler 的開源 AI Prompt 模式框架 — 內建數百個經過驗證的提示模式。',
    github: 'https://github.com/danielmiessler/fabric',
    color: '#FF6B35', stars: '28k',
  },
];

const FRAMEWORKS: Resource[] = [
  {
    icon: '🔗', title: 'LangChain', tag: 'LLM 框架',
    desc: 'LLM 應用開發框架 — Chain、Agent、Tool、Memory 一站式構建智能應用。',
    github: 'https://github.com/langchain-ai/langchain',
    color: '#10B981', stars: '105k',
  },
  {
    icon: '👥', title: 'CrewAI', tag: '多 Agent',
    desc: '多代理協作框架 — 定義角色、任務和流程，讓多個 AI Agent 自動分工合作。',
    github: 'https://github.com/crewAIInc/crewAI',
    color: '#4169E1', stars: '25k',
  },
  {
    icon: '🌐', title: 'LiteLLM', tag: '統一閘道',
    desc: '統一 LLM API 閘道 — 一套 API 呼叫 100+ 模型（OpenAI、Claude、Gemini、本地模型）。',
    github: 'https://github.com/BerriAI/litellm',
    color: '#7C3AED', stars: '18k',
  },
  {
    icon: '🧠', title: 'Mem0', tag: 'AI 記憶層',
    desc: '為 AI 應用添加長期記憶 — 個人化對話、用戶偏好追蹤、跨 Session 記憶。',
    github: 'https://github.com/mem0ai/mem0',
    color: '#D97706', stars: '15k',
  },
  {
    icon: '🔥', title: 'Firecrawl', tag: 'AI 爬蟲',
    desc: '專為 AI/LLM 設計的網頁爬蟲 — 自動轉換為 Markdown，支援 JavaScript 渲染頁面。',
    github: 'https://github.com/mendableai/firecrawl',
    color: '#FF6B35', stars: '20k',
  },
  {
    icon: '🌍', title: 'Browser Use', tag: '瀏覽器自動化',
    desc: '讓 AI 自動操作瀏覽器 — 填表、點擊、截圖、數據提取，自然語言驅動。',
    github: 'https://github.com/browser-use/browser-use',
    color: '#EC4899', stars: '55k',
  },
];

const INFRA: Resource[] = [
  {
    icon: '▲', title: 'Next.js', tag: 'React 框架',
    desc: 'Vercel 開源全端 React 框架 — SSR、SSG、API Routes、App Router。',
    github: 'https://github.com/vercel/next.js',
    color: '#000000', stars: '130k',
  },
  {
    icon: '⚡', title: 'Supabase', tag: '開源 BaaS',
    desc: '開源 Firebase 替代方案 — Postgres 資料庫、Auth、Storage、Realtime。',
    github: 'https://github.com/supabase/supabase',
    color: '#3ECF8E', stars: '78k',
  },
  {
    icon: '🔄', title: 'n8n', tag: '工作流自動化',
    desc: '開源工作流自動化工具 — 連接 400+ 服務，拖拉式 AI 工作流設計。',
    github: 'https://github.com/n8n-io/n8n',
    color: '#FF6B35', stars: '60k',
  },
  {
    icon: '🎨', title: 'Tailwind CSS', tag: 'CSS 框架',
    desc: 'Utility-first CSS 框架 — 快速構建現代化響應式介面，無需離開 HTML。',
    github: 'https://github.com/tailwindlabs/tailwindcss',
    color: '#06B6D4', stars: '85k',
  },
  {
    icon: '🧩', title: 'Dify', tag: 'LLM 平台',
    desc: '開源 LLM 應用開發平台 — 視覺化構建 AI 工作流、RAG、Agent。',
    github: 'https://github.com/langgenius/dify',
    color: '#7C3AED', stars: '70k',
  },
  {
    icon: '📡', title: 'Vercel AI SDK', tag: 'AI 串流',
    desc: '開源 TypeScript 工具包 — React/Next.js AI 串流 UI、Tool Calling、多模型支援。',
    github: 'https://github.com/vercel/ai',
    color: '#4169E1', stars: '12k',
  },
];

/* ── Tab types ── */
type Tab = 'resources' | 'openclaw' | 'claudecode' | 'images';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'resources', label: '開源資源', emoji: '📦' },
  { id: 'openclaw', label: 'OpenClaw 教學', emoji: '🦞' },
  { id: 'claudecode', label: 'Claude Code + Antigravity', emoji: '⌨️' },
  { id: 'images', label: 'Images 指南', emoji: '🖼️' },
];

/* ══════════════════════════════════════════════════════════
   TUTORIAL CONTENT
   ══════════════════════════════════════════════════════════ */

function OpenClawTutorial() {
  return (
    <div className="max-w-4xl mx-auto">
      <R><div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">🦞</span>
        <div>
          <h2 className="text-2xl md:text-3xl font-black">OpenClaw 安裝與設定指南</h2>
          <p className="text-sm text-gray-400">從零開始搭建你的 OpenClaw AI 助手</p>
        </div>
      </div></R>

      <R d={0.05}><a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#4169E1] hover:underline mb-8">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        查看 GitHub 原始碼 →
      </a></R>

      {[
        {
          step: '1', title: '系統需求與安裝', color: '#4169E1',
          content: [
            { sub: '前置條件', items: ['Node.js 20+ 或 Python 3.11+', 'Docker（推薦用於部署）', 'API Key：OpenAI / Anthropic / 本地模型（Ollama）'] },
            { sub: '快速安裝', code: '# 使用 npm\nnpm install -g openclaw\n\n# 或使用 Docker\ndocker pull openclaw/openclaw:latest\ndocker run -d -p 3000:3000 openclaw/openclaw:latest\n\n# 驗證安裝\nopenclaw --version' },
          ],
        },
        {
          step: '2', title: '基本配置', color: '#10B981',
          content: [
            { sub: '初始化專案', code: '# 建立新專案\nopenclaw init my-assistant\ncd my-assistant\n\n# 設定 API Key\nopenclaw config set api-key sk-xxx\n\n# 選擇模型\nopenclaw config set model claude-sonnet-4-20250514' },
            { sub: '連接通訊平台', items: ['WhatsApp：設定 WhatsApp Business API Token', 'Telegram：建立 Bot 並取得 Token', 'Discord：建立 Application 並設定 Bot Token'] },
          ],
        },
        {
          step: '3', title: '建立你的第一個 Skill', color: '#7C3AED',
          content: [
            { sub: 'SKILL.md 格式', code: '---\nname: daily-summary\ndescription: 每日工作摘要生成器\ntrigger: cron 0 18 * * 1-5\n---\n\n# Daily Summary Skill\n\n你是一個工作摘要助手。\n每天下午 6 點自動整理當日的對話紀錄，\n生成結構化的工作摘要報告。\n\n## 輸出格式\n- 📋 今日完成\n- 🔄 進行中\n- 📌 待跟進' },
            { sub: '發布到 ClawHub', code: '# 測試 Skill\nopenclaw skill test daily-summary\n\n# 發布\nopenclaw skill publish daily-summary' },
          ],
        },
        {
          step: '4', title: '進階：多 Agent 編排', color: '#D97706',
          content: [
            { sub: '設定 Sub-agent', code: '# openclaw.config.yaml\nagents:\n  researcher:\n    model: claude-sonnet-4-20250514\n    role: "研究員 — 負責資料搜集"\n  writer:\n    model: claude-sonnet-4-20250514\n    role: "寫手 — 負責內容撰寫"\n  reviewer:\n    model: claude-opus-4-20250514\n    role: "審稿人 — 負責品質把關"\n\nworkflow:\n  - researcher → writer → reviewer' },
            { sub: '安全加固', items: ['啟用 API Rate Limiting', '設定 IP 白名單', '加密敏感數據存儲', '定期輪換 API Keys'] },
          ],
        },
      ].map((section) => (
        <R key={section.step} d={Number(section.step) * 0.05}>
          <div className="mb-8 bg-[#FAFBFF] rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ background: section.color }}>{section.step}</span>
              <h3 className="text-lg font-bold">{section.title}</h3>
            </div>
            <div className="p-5 space-y-4">
              {section.content.map((block, j) => (
                <div key={j}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{block.sub}</h4>
                  {block.code && (
                    <pre className="bg-[#0F172A] text-gray-300 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto font-mono">
                      <code>{block.code}</code>
                    </pre>
                  )}
                  {block.items && (
                    <ul className="space-y-1.5">
                      {block.items.map((item, k) => (
                        <li key={k} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-300 mt-0.5">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </R>
      ))}
    </div>
  );
}

function ClaudeCodeTutorial() {
  return (
    <div className="max-w-4xl mx-auto">
      <R><div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">⌨️</span>
        <div>
          <h2 className="text-2xl md:text-3xl font-black">Claude Code + Antigravity 設定指南</h2>
          <p className="text-sm text-gray-400">終端機 AI 編程代理 + Antigravity 圖像工作流</p>
        </div>
      </div></R>

      <R d={0.05}><div className="flex gap-3 mb-8 flex-wrap">
        <a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#4169E1] hover:underline">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          Claude Code GitHub →
        </a>
        <a href="https://github.com/anthropics/antigravity" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#7C3AED] hover:underline">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          Antigravity GitHub →
        </a>
      </div></R>

      {/* Claude Code Section */}
      <R d={0.08}><h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7C3AED] text-white text-xs font-bold">CC</span>
        Claude Code 安裝與使用
      </h3></R>

      {[
        {
          step: '1', title: '安裝 Claude Code', color: '#7C3AED',
          content: [
            { sub: '系統需求', items: ['macOS 12+、Ubuntu 20.04+、或 Windows（WSL2）', 'Node.js 18+', 'Anthropic API Key 或 Claude Pro/Max 訂閱'] },
            { sub: '安裝步驟', code: '# 全域安裝\nnpm install -g @anthropic-ai/claude-code\n\n# 驗證安裝\nclaude --version\n\n# 啟動（在你的專案目錄中）\ncd your-project\nclaude' },
          ],
        },
        {
          step: '2', title: '基本設定與使用', color: '#4169E1',
          content: [
            { sub: '首次啟動配置', code: '# 啟動 Claude Code\nclaude\n\n# 常用命令\n/help          # 查看所有命令\n/compact        # 壓縮上下文\n/clear          # 清除對話\n/cost           # 查看 Token 用量\n/model          # 切換模型' },
            { sub: 'CLAUDE.md 專案配置', code: '# CLAUDE.md — 放在專案根目錄\n\n## Project\nThis is a Next.js 16 app with TypeScript and Tailwind.\n\n## Commands\n- `npm run dev` — start dev server\n- `npm run build` — production build\n- `npm test` — run tests\n\n## Conventions\n- Use TypeScript strict mode\n- Follow conventional commits\n- Components in PascalCase' },
          ],
        },
        {
          step: '3', title: '進階技巧', color: '#10B981',
          content: [
            { sub: 'Agent Skills 整合', code: '# 安裝 Skills\nnpx skills install vercel/next-app\nnpx skills install vercel/shadcn-ui\n\n# 使用 Skills（在 Claude Code 中）\n# Claude 會自動讀取已安裝的 skills\n# 並在需要時調用相關能力' },
            { sub: '多檔案編輯工作流', items: ['使用自然語言描述你要做的改動', '讓 Claude 分析現有程式碼結構', '一次性修改多個相關檔案', '自動執行測試驗證改動'] },
          ],
        },
      ].map((section) => (
        <R key={section.step} d={Number(section.step) * 0.05}>
          <div className="mb-6 bg-[#FAFBFF] rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ background: section.color }}>{section.step}</span>
              <h4 className="font-bold">{section.title}</h4>
            </div>
            <div className="p-4 space-y-4">
              {section.content.map((block, j) => (
                <div key={j}>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">{block.sub}</h5>
                  {block.code && <pre className="bg-[#0F172A] text-gray-300 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto font-mono"><code>{block.code}</code></pre>}
                  {block.items && <ul className="space-y-1.5">{block.items.map((item, k) => <li key={k} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-gray-300 mt-0.5">•</span>{item}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </R>
      ))}

      {/* Antigravity Section */}
      <R d={0.2}><h3 className="text-xl font-bold mb-4 mt-10 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EC4899] text-white text-xs font-bold">AG</span>
        Antigravity 圖像生成設定
      </h3></R>

      {[
        {
          step: '1', title: '安裝 Antigravity', color: '#EC4899',
          content: [
            { sub: '安裝與設定', code: '# 安裝 Antigravity\nnpm install -g antigravity\n\n# 或使用 pip\npip install antigravity-ai\n\n# 設定 API Key\nantigravity config set api-key YOUR_KEY\n\n# 驗證\nantigravity --version' },
          ],
        },
        {
          step: '2', title: '與 Claude Code 整合', color: '#D97706',
          content: [
            { sub: '在 Claude Code 中使用', code: '# 在 CLAUDE.md 中加入 Antigravity 配置\n\n## Image Generation\nUse Antigravity for image tasks:\n- `antigravity generate "prompt"` for image generation\n- `antigravity enhance input.jpg` for upscaling\n- `antigravity batch ./prompts.json` for batch processing\n\n## Workflow\n1. Design UI mockups with Claude Code\n2. Generate placeholder images with Antigravity\n3. Optimize images for web delivery' },
            { sub: '常用工作流', items: ['AI 生成產品圖片和 Hero Images', '自動批量處理和優化圖片', '與 Next.js Image 組件整合', '結合 Claude 視覺分析做圖片 QA'] },
          ],
        },
      ].map((section) => (
        <R key={`ag-${section.step}`} d={Number(section.step) * 0.05}>
          <div className="mb-6 bg-[#FAFBFF] rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ background: section.color }}>{section.step}</span>
              <h4 className="font-bold">{section.title}</h4>
            </div>
            <div className="p-4 space-y-4">
              {section.content.map((block, j) => (
                <div key={j}>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">{block.sub}</h5>
                  {block.code && <pre className="bg-[#0F172A] text-gray-300 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto font-mono"><code>{block.code}</code></pre>}
                  {block.items && <ul className="space-y-1.5">{block.items.map((item, k) => <li key={k} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-gray-300 mt-0.5">•</span>{item}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </R>
      ))}
    </div>
  );
}

function ImagesTutorial() {
  return (
    <div className="max-w-4xl mx-auto">
      <R><div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">🖼️</span>
        <div>
          <h2 className="text-2xl md:text-3xl font-black">AI Images 使用指南</h2>
          <p className="text-sm text-gray-400">AI 圖像生成、優化和最佳實踐</p>
        </div>
      </div></R>

      {[
        {
          step: '1', title: '開源圖像生成工具', color: '#EC4899',
          content: [
            { sub: '推薦工具', items: [
              'Stable Diffusion WebUI — 本地運行的圖像生成（github.com/AUTOMATIC1111/stable-diffusion-webui）',
              'ComfyUI — 節點式工作流圖像生成（github.com/comfyanonymous/ComfyUI）',
              'Fooocus — 簡化版 Stable Diffusion（github.com/lllyasviel/Fooocus）',
              'InvokeAI — 專業級 AI 圖像工作室（github.com/invoke-ai/InvokeAI）',
            ] },
          ],
        },
        {
          step: '2', title: 'Prompt 撰寫技巧', color: '#4169E1',
          content: [
            { sub: '結構化 Prompt 公式', code: '[主題] + [風格] + [細節] + [光線] + [構圖] + [品質]\n\n# 範例：產品圖\n"Professional product photo of a wireless headphone,\nminimalist white background, soft studio lighting,\ncentered composition, 8k ultra-detailed, commercial photography"\n\n# 範例：Hero Image\n"Modern tech workspace with holographic AI interface,\ncyberpunk aesthetic, blue and purple neon glow,\nwide angle lens, cinematic lighting, 4k wallpaper quality"\n\n# 範例：吉祥物\n"Cute pixel art robot mascot, friendly expression,\nblue and white color scheme, isometric view,\nclean vector style, transparent background"' },
            { sub: '避免常見錯誤', items: [
              '不要用否定句（用 "clear sky" 而非 "no clouds"）',
              '越前面的詞權重越高，把最重要的放前面',
              '加入品質詞：detailed, high quality, professional, 8k',
              '指定風格：photorealistic, illustration, pixel art, watercolor',
            ] },
          ],
        },
        {
          step: '3', title: 'Web 圖片優化', color: '#10B981',
          content: [
            { sub: 'Next.js Image 最佳實踐', code: 'import Image from "next/image";\n\n// 使用 Next.js Image 組件\n<Image\n  src="/hero.webp"\n  alt="Hero image description"\n  width={1200}\n  height={630}\n  priority              // 首屏圖片加 priority\n  quality={85}          // WebP 品質 85 即可\n  placeholder="blur"    // 模糊佔位\n  blurDataURL={blurUrl}\n/>\n\n// 響應式圖片\n<Image\n  src="/product.webp"\n  alt="Product"\n  sizes="(max-width: 768px) 100vw, 50vw"\n  fill\n  className="object-cover"\n/>' },
            { sub: '格式選擇指南', items: [
              'WebP — 通用首選，壓縮率比 JPEG 高 25-35%',
              'AVIF — 最佳壓縮率，但瀏覽器支援較新',
              'SVG — 圖示、Logo、簡單插圖（無限縮放）',
              'PNG — 需要透明背景時使用',
              'JPEG — 照片類圖片的兼容方案',
            ] },
          ],
        },
        {
          step: '4', title: '開源圖片處理工具', color: '#D97706',
          content: [
            { sub: '批量處理', code: '# Sharp — Node.js 高效圖片處理\nnpm install sharp\n\n# 批量轉 WebP\nconst sharp = require("sharp");\nawait sharp("input.jpg")\n  .resize(1200, 630)\n  .webp({ quality: 85 })\n  .toFile("output.webp");\n\n# 生成多尺寸\nconst sizes = [640, 768, 1024, 1280];\nfor (const w of sizes) {\n  await sharp("hero.jpg")\n    .resize(w)\n    .webp({ quality: 85 })\n    .toFile(`hero-${w}.webp`);\n}' },
            { sub: '推薦開源工具', items: [
              'Sharp（github.com/lovell/sharp）— Node.js 圖片處理',
              'Squoosh CLI（github.com/GoogleChromeLabs/squoosh）— Google 圖片壓縮',
              'SVGO（github.com/svg/svgo）— SVG 優化工具',
              'Upscayl（github.com/upscayl/upscayl）— AI 圖片放大',
            ] },
          ],
        },
      ].map((section) => (
        <R key={section.step} d={Number(section.step) * 0.05}>
          <div className="mb-8 bg-[#FAFBFF] rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ background: section.color }}>{section.step}</span>
              <h3 className="text-lg font-bold">{section.title}</h3>
            </div>
            <div className="p-5 space-y-4">
              {section.content.map((block, j) => (
                <div key={j}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{block.sub}</h4>
                  {block.code && <pre className="bg-[#0F172A] text-gray-300 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto font-mono"><code>{block.code}</code></pre>}
                  {block.items && <ul className="space-y-1.5">{block.items.map((item, k) => <li key={k} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-gray-300 mt-0.5">•</span>{item}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </R>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [tab, setTab] = useState<Tab>('resources');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="bg-white text-[#1A1A2E] min-h-screen">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/"><Logo size="md" /></a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:text-[#4169E1] transition-colors ${tab === t.id ? 'text-[#4169E1] font-bold' : ''}`}>
                {t.emoji} {t.label}
              </button>
            ))}
            <a href="/courses" className="hover:text-[#4169E1] transition-colors">課程</a>
            <a href="/friends" className="hover:text-[#4169E1] transition-colors">文章</a>
          </div>
          <motion.a href="/courses" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="bg-[#4169E1] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-200/60 hover:bg-[#3358C8] transition">
            免費試堂
          </motion.a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <R>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-[#4169E1]/10 text-[#4169E1] px-4 py-1.5 rounded-full text-xs font-bold mb-5 tracking-wide border border-[#4169E1]/20">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-[#4169E1] opacity-75"/><span className="relative h-1.5 w-1.5 rounded-full bg-[#4169E1]"/></span>
              100% 開源資源 · 免費使用
            </motion.div>
          </R>
          <R d={0.05}><h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            AI 開發<span className="bg-gradient-to-r from-[#4169E1] to-[#7C3AED] bg-clip-text text-transparent">必備資源庫</span>
          </h1></R>
          <R d={0.1}><p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            精選 18 個頂級開源工具 — 全部附 GitHub 連結。<br className="hidden md:block" />
            從 AI 框架到部署基建，一頁掌握所有你需要的資源。
          </p></R>
        </div>
      </section>

      {/* ═══ TAB NAVIGATION ═══ */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin py-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                  ${tab === t.id
                    ? 'bg-[#4169E1] text-white shadow-md shadow-blue-200/40'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      <section className="py-12 md:py-16 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-6">

          {tab === 'resources' && (
            <>
              {/* Must-Need Tools */}
              <R>
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🛠️</span>
                    <div>
                      <h2 className="text-xl font-bold">Must-Need Tools</h2>
                      <p className="text-sm text-gray-400">AI 開發必備工具 — 每個都是開源</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TOOLS.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                  </div>
                </div>
              </R>

              {/* Must-Need Frameworks */}
              <R>
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">📚</span>
                    <div>
                      <h2 className="text-xl font-bold">Must-Need Frameworks</h2>
                      <p className="text-sm text-gray-400">AI 應用開發框架與函式庫</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FRAMEWORKS.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                  </div>
                </div>
              </R>

              {/* Must-Need Infrastructure */}
              <R>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">🔗</span>
                    <div>
                      <h2 className="text-xl font-bold">Must-Need Infrastructure</h2>
                      <p className="text-sm text-gray-400">部署、自動化和開發基建</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {INFRA.map((r, i) => <ResourceCard key={r.title} r={r} i={i} />)}
                  </div>
                </div>
              </R>
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
            <div className="md:col-span-1">
              <Logo size="sm" />
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                SkillAI.hk 精選開源 AI 資源，助你快速上手 AI 開發。
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">開源工具</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">OpenClaw ↗</a></li>
                <li><a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Claude Code ↗</a></li>
                <li><a href="https://github.com/ollama/ollama" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Ollama ↗</a></li>
                <li><a href="https://github.com/aider-ai/aider" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Aider ↗</a></li>
                <li><a href="https://github.com/open-webui/open-webui" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Open WebUI ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4">框架與基建</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/langchain-ai/langchain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LangChain ↗</a></li>
                <li><a href="https://github.com/crewAIInc/crewAI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">CrewAI ↗</a></li>
                <li><a href="https://github.com/vercel/next.js" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Next.js ↗</a></li>
                <li><a href="https://github.com/supabase/supabase" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Supabase ↗</a></li>
                <li><a href="https://github.com/n8n-io/n8n" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">n8n ↗</a></li>
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
            <p className="text-xs text-gray-600">&copy; 2026 SkillAI.hk &middot; DeFiner Tech Ltd &middot; 保留所有權利</p>
            <p className="text-xs text-gray-700">Made with ❤️ in Hong Kong</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
