"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { use, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "../../../components/Logo";

/* ══════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════ */

interface Module {
  week: number;
  title: string;
  topics: string[];
  hours: number;
}

interface Instructor {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Project {
  title: string;
  desc: string;
  tags: string[];
}

interface FaqItem {
  q: string;
  a: string;
}

interface CourseInfo {
  level: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  color: string;
  icon: string;
  duration: string;
  effort: string;
  language: string;
  certificate: string;
  overview: string;
  modules: Module[];
  projects: Project[];
  instructors: Instructor[];
  faq: FaqItem[];
}

/* ══════════════════════════════════════════════════
   LEVEL COLOR MAP
   ══════════════════════════════════════════════════ */

const LEVEL_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#6B7280",
  gold: "#D97706",
  openclaw: "#4169E1",
  platinum: "#7C3AED",
};

/* ══════════════════════════════════════════════════
   ANIMATION HELPERS
   ══════════════════════════════════════════════════ */

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ICONS (inline SVG for zero-dependency)
   ══════════════════════════════════════════════════ */

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ChevronIcon({
  isOpen,
  className = "w-4 h-4",
}: {
  isOpen: boolean;
  className?: string;
}) {
  return (
    <motion.svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </motion.svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function BookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function AwardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   FAQ ACCORDION ITEM
   ══════════════════════════════════════════════════ */

function FaqAccordion({
  item,
  isOpen,
  onToggle,
  color,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-[#1A1A2E] pr-4">
          {item.q}
        </span>
        <ChevronIcon
          isOpen={isOpen}
          className="w-4 h-4 text-gray-400 flex-shrink-0"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div
                className="h-px mb-3"
                style={{ background: `${color}20` }}
              />
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TIMELINE MODULE ITEM
   ══════════════════════════════════════════════════ */

function TimelineModule({
  module,
  index,
  total,
  color,
}: {
  module: Module;
  index: number;
  total: number;
  color: string;
}) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const isLast = index === total - 1;

  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Node */}
        <motion.div
          className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg"
          style={{ background: color }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {module.week}
        </motion.div>
        {/* Connecting line */}
        {!isLast && (
          <div
            className="w-0.5 flex-1 min-h-[16px]"
            style={{ background: `${color}25` }}
          />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 pb-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left group"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 mb-0.5">
                第 {module.week} 週
              </p>
              <h4 className="text-sm font-bold text-[#1A1A2E] truncate pr-2">
                {module.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${color}12`,
                  color,
                }}
              >
                {module.hours}h
              </span>
              <ChevronIcon
                isOpen={isExpanded}
                className="w-3.5 h-3.5 text-gray-300"
              />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="topics"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="px-4 pb-4 pt-1 space-y-1.5">
                {module.topics.map((topic, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2 text-xs text-gray-500"
                  >
                    <CheckIcon
                      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    />
                    <span style={{ color }}>{topic}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   COURSE DATA
   ══════════════════════════════════════════════════ */

const courseData: Record<string, CourseInfo> = {
  bronze: {
    level: "Bronze",
    title: "AI 效率實戰班",
    subtitle: "用 Claude + AI Agent 徹底改造你的工作流程",
    price: "HK$2,999",
    color: "#CD7F32",
    icon: "🏅",
    duration: "4 週",
    effort: "每週 10 小時",
    language: "粵語 / 國語",
    certificate: "AI 效率認證",
    overview:
      "專為非技術背景設計。4 週內學會用 Claude、ChatGPT 和 n8n 等工具建立真正的自動化工作流。每堂課都有即時可用的產出，不教理論 — 只教你明天就能用的技能。",
    modules: [
      {
        week: 1,
        title: "Claude 深度使用與系統 Prompt",
        topics: [
          "Claude vs ChatGPT：何時用哪個",
          "System Prompt 設計框架（RACE 方法）",
          "Claude Projects 知識庫建立",
          "實戰：建立你的個人 AI 工作助手",
        ],
        hours: 10,
      },
      {
        week: 2,
        title: "n8n 自動化工作流實戰",
        topics: [
          "n8n 安裝與核心概念（節點、觸發器、連接）",
          "串接 Gmail + Google Sheets + Slack",
          "用 AI 節點自動分類和回覆郵件",
          "實戰：客戶查詢自動分類回覆系統",
        ],
        hours: 10,
      },
      {
        week: 3,
        title: "AI 數據分析與報告生成",
        topics: [
          "Claude 分析 CSV / Excel 數據",
          "用 Claude Artifacts 生成即時圖表",
          "自動化週報 / 月報生成流程",
          "實戰：業務 KPI 自動化報告",
        ],
        hours: 10,
      },
      {
        week: 4,
        title: "綜合工作流設計與認證",
        topics: [
          "多工具串接：Claude + n8n + Notion",
          "個人 AI 工作流設計與優化",
          "畢業項目展示",
          "認證考試",
        ],
        hours: 10,
      },
    ],
    projects: [
      {
        title: "AI 郵件自動化系統",
        desc: "用 n8n + Claude 建立自動分類、摘要和回覆客戶郵件的完整系統。",
        tags: ["n8n", "Claude API", "郵件自動化"],
      },
      {
        title: "KPI 自動化報告",
        desc: "每週自動從 Google Sheets 提取數據，用 AI 生成分析報告並發送。",
        tags: ["數據分析", "自動化", "報告生成"],
      },
      {
        title: "個人 AI 工作流",
        desc: "設計一套適合你崗位的 AI 輔助工作流，即時節省 50%+ 重覆性工作。",
        tags: ["工作流設計", "效率提升", "Claude"],
      },
    ],
    instructors: [
      {
        name: "Dr. Sarah Chen",
        role: "AI 效率顧問",
        bio: "曾為 50+ 企業設計 AI 工作流，節省人力成本 40%",
        image: "SC",
      },
      {
        name: "Michael Wong",
        role: "自動化工程師",
        bio: "n8n 社群導師，設計過 200+ 自動化流程",
        image: "MW",
      },
    ],
    faq: [
      {
        q: "需要編程基礎嗎？",
        a: "完全不需要！課程使用 Claude 和 n8n 等無代碼/低代碼工具，只要會用瀏覽器即可。",
      },
      {
        q: "課程形式是什麼？",
        a: "線上錄播 + 每週直播答疑 + 實戰作業。每堂課都有可交付的產出。",
      },
      {
        q: "跟 YouTube 免費教程有什麼不同？",
        a: "我們教的是完整工作流設計，不是單獨工具。每個項目都是你真正能帶回辦公室用的。",
      },
      {
        q: "學不會怎麼辦？",
        a: "1 年內免費重修，加上專業導師全程輔導。",
      },
      {
        q: "完成後可以升級嗎？",
        a: "可以！Bronze 畢業生報讀 Silver 課程可享 20% 校友折扣。",
      },
    ],
  },
  silver: {
    level: "Silver",
    title: "AI 應用開發班",
    subtitle: "用 Claude Code + Cursor 從零開發真正的 AI 應用",
    price: "HK$7,999",
    color: "#6B7280",
    icon: "🥈",
    duration: "8 週",
    effort: "每週 12 小時",
    language: "粵語 / 國語",
    certificate: "AI 開發者認證",
    overview:
      "從完全不懂編程到獨立開發和部署 AI 應用。核心武器是 Claude Code 和 Cursor — 用 AI 寫代碼，讓你跳過傳統學習曲線，直接開始建產品。",
    modules: [
      {
        week: 1,
        title: "開發環境 + Claude Code 設置",
        topics: [
          "VS Code / Cursor IDE 安裝與配置",
          "Claude Code CLI 安裝與 API Key 設定",
          "Terminal 基礎操作（cd, ls, git）",
          "實戰：用 Claude Code 生成第一個 Python 腳本",
        ],
        hours: 12,
      },
      {
        week: 2,
        title: "Python + API 串接實戰",
        topics: [
          "用 Claude Code 學 Python（邊做邊學）",
          "Anthropic SDK 串接 Claude API",
          "處理 API 回應、錯誤和串流",
          "實戰：命令行 AI 聊天機器人",
        ],
        hours: 12,
      },
      {
        week: 3,
        title: "Cursor AI 全端開發",
        topics: [
          "Cursor Tab / Chat / Composer 工作流",
          "Next.js 專案用 Cursor 快速搭建",
          "Tailwind CSS 即時 UI 開發",
          "實戰：AI 驅動的個人網站",
        ],
        hours: 12,
      },
      {
        week: 4,
        title: "Supabase 後端 + 用戶系統",
        topics: [
          "Supabase 資料庫設計（PostgreSQL）",
          "用戶認證（Auth）與權限管理",
          "CRUD API 快速開發",
          "實戰：帶登入系統的 AI 筆記應用",
        ],
        hours: 12,
      },
      {
        week: 5,
        title: "AI Agent 工具開發",
        topics: [
          "Claude Tool Use（Function Calling）",
          "設計 Agent 可調用的工具",
          "多步驟 Agent 邏輯設計",
          "實戰：能搜索和分析的研究 Agent",
        ],
        hours: 12,
      },
      {
        week: 6,
        title: "n8n + Webhook 自動化",
        topics: [
          "n8n 進階：自定義 Webhook 觸發",
          "串接 AI Agent 到 Slack / Discord",
          "定時任務與事件驅動設計",
          "實戰：Slack AI 助手（接收問題 → AI 分析 → 回覆）",
        ],
        hours: 12,
      },
      {
        week: 7,
        title: "Vercel 部署 + 域名上線",
        topics: [
          "Vercel 部署流程（Git → 自動部署）",
          "環境變數與 API Key 管理",
          "自定義域名與 Cloudflare DNS",
          "實戰：將畢業項目部署上線",
        ],
        hours: 12,
      },
      {
        week: 8,
        title: "畢業項目與認證",
        topics: [
          "端到端項目開發（前端 + 後端 + AI）",
          "代碼審查與最佳實踐",
          "項目展示與答辯",
          "開發者認證考試",
        ],
        hours: 12,
      },
    ],
    projects: [
      {
        title: "AI 研究助手",
        desc: "用 Claude Tool Use 建立能搜索網頁、分析文件並生成報告的 Agent。",
        tags: ["Claude API", "Tool Use", "Agent"],
      },
      {
        title: "全端 AI 筆記應用",
        desc: "Next.js + Supabase + Claude：帶用戶登入、AI 摘要和搜索的筆記工具。",
        tags: ["Next.js", "Supabase", "全端"],
      },
      {
        title: "Slack AI 自動化 Bot",
        desc: "n8n + Claude 串接 Slack，自動回答團隊問題並整理會議記錄。",
        tags: ["n8n", "Slack", "自動化"],
      },
    ],
    instructors: [
      {
        name: "Alex Liu",
        role: "AI 全端工程師",
        bio: "用 Claude Code 開發過 30+ 商業項目，Cursor 早期用戶",
        image: "AL",
      },
      {
        name: "Jenny Zhang",
        role: "開發者教育",
        bio: "前 Vercel DX 團隊，專注零基礎到全端的加速教學",
        image: "JZ",
      },
    ],
    faq: [
      {
        q: "完全不會編程也行嗎？",
        a: "是的！Claude Code 和 Cursor 就是你的編程搭檔。課程從安裝開始，一步步帶你做出真正的產品。",
      },
      {
        q: "課程包含什麼？",
        a: "96 小時錄播 + 週直播 + 8 個實戰項目 + 代碼評審 + 1 年社群支援。",
      },
      {
        q: "學完能做什麼？",
        a: "獨立開發和部署 AI Web 應用、Agent 和自動化系統。可以接 freelance 或轉型 AI 開發。",
      },
      {
        q: "跟 Gold 有什麼分別？",
        a: "Silver 專注從零到一開發完整應用。Gold 深入企業級架構、RAG 和生產部署。",
      },
    ],
  },
  gold: {
    level: "Gold",
    title: "AI 系統架構師班",
    subtitle: "掌握 RAG、Agent 編排和生產級 AI 系統設計",
    price: "HK$15,999",
    color: "#D97706",
    icon: "🥇",
    duration: "12 週",
    effort: "每週 15 小時",
    language: "粵語 / 國語 / 英語",
    certificate: "AI 架構師認證",
    overview:
      "面向有開發經驗的工程師。12 週深入 RAG 知識庫、多 Agent 編排、MCP Server、LangChain 和生產級部署。畢業時你能獨立設計和交付企業級 AI 系統。",
    modules: [
      {
        week: 1,
        title: "LLM 工程基礎",
        topics: [
          "Transformer 架構與注意力機制",
          "Token 經濟學與成本優化",
          "Claude / GPT / Llama 模型對比與選型",
          "實戰：用 LiteLLM 統一多模型 API",
        ],
        hours: 15,
      },
      {
        week: 2,
        title: "RAG 系統設計",
        topics: [
          "向量數據庫選型（Pinecone / Weaviate / pgvector）",
          "文件分塊策略與 Embedding 模型",
          "混合搜索（向量 + 關鍵字 + 重排序）",
          "實戰：企業文件知識庫（PDF/Notion 匯入）",
        ],
        hours: 15,
      },
      {
        week: 3,
        title: "RAG 進階 — 評估與優化",
        topics: [
          "RAG 評估框架（RAGAS / 人工評估）",
          "Chunk 大小、Overlap、Reranking 調優",
          "多模態 RAG（圖片 + 表格解析）",
          "實戰：帶評分看板的生產 RAG 系統",
        ],
        hours: 15,
      },
      {
        week: 4,
        title: "AI Agent 架構設計",
        topics: [
          "ReAct / Plan-and-Execute 模式",
          "Tool Use 進階：自定義工具鏈",
          "記憶系統（短期/長期/Mem0）",
          "實戰：能上網搜索和寫代碼的全能 Agent",
        ],
        hours: 15,
      },
      {
        week: 5,
        title: "多 Agent 編排系統",
        topics: [
          "CrewAI / LangGraph 框架對比",
          "Agent 角色設計與任務委派",
          "Agent 間通信與狀態共享",
          "實戰：3-Agent 研究分析團隊",
        ],
        hours: 15,
      },
      {
        week: 6,
        title: "MCP Server 開發",
        topics: [
          "Model Context Protocol 規範",
          "MCP Server 開發（TypeScript / Python）",
          "Resource、Tool、Prompt 設計",
          "實戰：自定義 MCP Server 連接企業數據",
        ],
        hours: 15,
      },
      {
        week: 7,
        title: "LangChain + LangGraph 實戰",
        topics: [
          "LangChain Expression Language (LCEL)",
          "LangGraph 有狀態工作流",
          "Human-in-the-loop 設計",
          "實戰：帶人工審批的文件處理流水線",
        ],
        hours: 15,
      },
      {
        week: 8,
        title: "本地模型部署 — Ollama",
        topics: [
          "Ollama 安裝與模型管理",
          "Llama 3 / Mistral / Qwen 本地跑",
          "GPU 優化與量化部署",
          "實戰：離線 RAG 系統（全部本地跑）",
        ],
        hours: 15,
      },
      {
        week: 9,
        title: "全端 AI 應用 — Next.js + Vercel AI SDK",
        topics: [
          "Vercel AI SDK 串流整合",
          "Server Actions + Edge Runtime",
          "即時 UI 更新（Optimistic Updates）",
          "實戰：可部署的 AI SaaS 前端",
        ],
        hours: 15,
      },
      {
        week: 10,
        title: "生產級部署與 DevOps",
        topics: [
          "Docker 容器化最佳實踐",
          "CI/CD（GitHub Actions → Vercel / AWS）",
          "環境分離（Dev / Staging / Prod）",
          "實戰：自動化部署流水線",
        ],
        hours: 15,
      },
      {
        week: 11,
        title: "安全、監控與成本控制",
        topics: [
          "Prompt Injection 防禦實戰",
          "LangFuse / LangSmith 可觀測性",
          "API 用量監控與預算警報",
          "實戰：生產級監控面板",
        ],
        hours: 15,
      },
      {
        week: 12,
        title: "畢業項目與架構師認證",
        topics: [
          "企業級 AI 系統端到端設計",
          "架構決策文檔（ADR）撰寫",
          "項目展示與技術答辯",
          "AI 架構師認證考試",
        ],
        hours: 15,
      },
    ],
    projects: [
      {
        title: "企業 RAG 知識庫",
        desc: "支援 PDF/Notion/Confluence 匯入的智能問答系統，帶混合搜索和權限管理。",
        tags: ["RAG", "Pinecone", "LangChain"],
      },
      {
        title: "多 Agent 研究平台",
        desc: "3 個 Agent 協作：搜索員收集資料、分析員整理數據、撰稿員生成報告。",
        tags: ["CrewAI", "LangGraph", "Agent"],
      },
      {
        title: "生產級 AI SaaS",
        desc: "Next.js + Vercel AI SDK + Supabase，含用戶系統、串流對話和付款。",
        tags: ["Next.js", "Vercel", "SaaS"],
      },
    ],
    instructors: [
      {
        name: "Prof. David Kim",
        role: "AI 系統架構師",
        bio: "前 AWS AI 首席架構師，設計過 50+ 企業級 RAG 和 Agent 系統",
        image: "DK",
      },
      {
        name: "Emily Lau",
        role: "LLM 工程師",
        bio: "LangChain 核心貢獻者，專注生產級 AI 系統優化",
        image: "EL",
      },
    ],
    faq: [
      {
        q: "需要什麼技術背景？",
        a: "需要有 Python 和基礎 Web 開發經驗。建議有 Silver 認證或 1 年以上開發經驗。",
      },
      {
        q: "跟 Silver 有什麼分別？",
        a: "Silver 教你從零做出應用。Gold 教你設計生產級架構：RAG、Agent 編排、MCP、監控、部署。",
      },
      {
        q: "有實習或就業機會嗎？",
        a: "Gold 畢業生優先推薦到合作企業 AI 團隊，包括上市公司和 AI 初創。",
      },
      {
        q: "可以分期付款嗎？",
        a: "可以！提供 3 期免息分期，每期 HK$5,333。",
      },
    ],
  },
  openclaw: {
    level: "OpenClaw",
    title: "OpenClaw 全方位課程",
    subtitle: "從安裝到架構師 — 掌握 2026 最熱 AI 框架",
    price: "HK$9,999",
    color: "#4169E1",
    icon: "🦞",
    duration: "10 週",
    effort: "每週 12 小時",
    language: "粵語 / 國語 / 英語",
    certificate: "OpenClaw 認證開發者",
    overview:
      "最完整的 OpenClaw 課程。10 週從安裝配置到自定義 Skill 開發、多 Agent 編排和企業級部署。每週都有可運行的項目產出，畢業時你是真正的 OpenClaw 專家。",
    modules: [
      {
        week: 1,
        title: "OpenClaw 安裝與核心概念",
        topics: [
          "OpenClaw 架構總覽（Core / Skills / Memory）",
          "一鍵安裝與 API Key 配置",
          "對話管理與上下文控制",
          "實戰：部署你的第一個 OpenClaw 實例",
        ],
        hours: 12,
      },
      {
        week: 2,
        title: "Skill 開發入門",
        topics: [
          "Skill 生命週期（Init → Execute → Response）",
          "輸入驗證與結構化輸出",
          "錯誤處理與重試策略",
          "實戰：天氣查詢 + 匯率轉換 Skill",
        ],
        hours: 12,
      },
      {
        week: 3,
        title: "進階 Skill — API 整合",
        topics: [
          "REST / GraphQL API 串接模式",
          "OAuth 2.0 認證流程",
          "異步任務處理",
          "實戰：電商庫存查詢 + 訂單追蹤 Skill",
        ],
        hours: 12,
      },
      {
        week: 4,
        title: "數據庫 Skill + RAG",
        topics: [
          "Supabase / PostgreSQL 數據操作 Skill",
          "向量搜索整合（pgvector）",
          "知識庫建立與維護",
          "實戰：產品知識庫 FAQ 系統",
        ],
        hours: 12,
      },
      {
        week: 5,
        title: "記憶系統與個人化",
        topics: [
          "短期記憶 vs 長期記憶設計",
          "用戶偏好學習與儲存",
          "Mem0 整合實戰",
          "實戰：記住用戶習慣的個人助手",
        ],
        hours: 12,
      },
      {
        week: 6,
        title: "多平台部署",
        topics: [
          "WhatsApp Business API 整合",
          "Telegram Bot 開發",
          "Discord / Slack 連接器",
          "實戰：同一個 Agent 服務 3 個平台",
        ],
        hours: 12,
      },
      {
        week: 7,
        title: "多 Agent 編排",
        topics: [
          "Agent 角色定義與任務委派",
          "Supervisor / Router 模式",
          "Agent 間狀態共享與消息傳遞",
          "實戰：客服 + 銷售 + 技術支援 Agent 團隊",
        ],
        hours: 12,
      },
      {
        week: 8,
        title: "企業級部署與擴展",
        topics: [
          "Docker Compose 部署",
          "Nginx 反向代理與 SSL",
          "水平擴展與負載均衡",
          "實戰：AWS / GCP 雲端生產部署",
        ],
        hours: 12,
      },
      {
        week: 9,
        title: "安全加固與監控",
        topics: [
          "API Key 輪換與 Rate Limiting",
          "Prompt Injection 防護",
          "日誌收集與分析面板",
          "實戰：Grafana 監控 + 告警系統",
        ],
        hours: 12,
      },
      {
        week: 10,
        title: "畢業項目與認證",
        topics: [
          "企業級 OpenClaw 系統端到端開發",
          "Skill 生態文檔與 API 設計",
          "項目展示與技術答辯",
          "OpenClaw 認證考試",
        ],
        hours: 12,
      },
    ],
    projects: [
      {
        title: "多平台 AI 客服",
        desc: "同一個 OpenClaw Agent 同時服務 WhatsApp + Telegram + Discord，帶知識庫問答。",
        tags: ["OpenClaw", "多平台", "RAG"],
      },
      {
        title: "業務 Skill 套件",
        desc: "開發 5 個可重用 Skill：CRM 查詢、報表生成、庫存檢查、訂單追蹤、通知推送。",
        tags: ["Skill 開發", "API", "Supabase"],
      },
      {
        title: "企業 Agent 集群",
        desc: "3 個 Agent 分工協作的企業系統，含監控面板和自動擴展。",
        tags: ["Docker", "多 Agent", "Grafana"],
      },
    ],
    instructors: [
      {
        name: "Kevin Ho",
        role: "OpenClaw 核心貢獻者",
        bio: "OpenClaw 開源項目核心成員，Skills 生態設計者",
        image: "KH",
      },
      {
        name: "Lisa Wang",
        role: "平台工程師",
        bio: "前阿里雲 AI 平台團隊，5 年分佈式系統部署經驗",
        image: "LW",
      },
    ],
    faq: [
      {
        q: "什麼是 OpenClaw？",
        a: "2026 年最熱門的開源 AI 助手框架。讓你用 Skill 模組快速建立跨平台 AI 助手。",
      },
      {
        q: "需要什麼基礎？",
        a: "建議有基本 JavaScript/TypeScript 知識。前兩週有基礎教學，零基礎也可以跟上。",
      },
      {
        q: "跟 Gold 課程有什麼分別？",
        a: "OpenClaw 課程專精一個框架的完整生態。Gold 是通用 AI 架構（RAG、LangChain、MCP 等）。",
      },
      {
        q: "學完能做什麼？",
        a: "獨立開發、部署和維護企業級 OpenClaw 系統。可勝任 AI 平台工程師職位。",
      },
    ],
  },
  platinum: {
    level: "Platinum",
    title: "AI 創業實戰班",
    subtitle: "從想法到上線產品 — 用 AI 技術棧創業",
    price: "HK$29,999",
    color: "#7C3AED",
    icon: "💎",
    duration: "16 週",
    effort: "每週 20 小時",
    language: "粵語 / 國語 / 英語",
    certificate: "AI 創業領袖認證",
    overview:
      "16 週把你的 AI 產品想法變成真正上線的 SaaS。涵蓋產品設計、Claude Code 快速開發、Vercel 部署、Stripe 付款整合、用戶增長到投資人路演。畢業時你手上有一個真正運行的產品。",
    modules: [
      {
        week: 1,
        title: "AI 市場分析與機會識別",
        topics: [
          "2026 AI 行業趨勢與空白市場",
          "競品分析框架（功能 / 定價 / 技術棧）",
          "用 Claude 做快速市場調研",
          "實戰：撰寫市場分析報告",
        ],
        hours: 20,
      },
      {
        week: 2,
        title: "用戶研究與 PMF 驗證",
        topics: [
          "用戶訪談（Jobs-to-be-Done 框架）",
          "Landing Page MVP 快速驗證",
          "等候名單收集與分析",
          "實戰：驗證頁上線並收集 100 個潛在用戶",
        ],
        hours: 20,
      },
      {
        week: 3,
        title: "產品設計與技術選型",
        topics: [
          "Figma 快速原型設計",
          "AI 技術棧選型（Claude API / RAG / Agent）",
          "成本估算：API 費用 / 基礎設施 / 人力",
          "實戰：完整產品規格文檔",
        ],
        hours: 20,
      },
      {
        week: 4,
        title: "MVP 開發 — 前端",
        topics: [
          "Next.js 14 + Tailwind 快速搭建",
          "用 Cursor / Claude Code 加速開發",
          "用戶認證（NextAuth / Clerk）",
          "實戰：產品前端 MVP",
        ],
        hours: 20,
      },
      {
        week: 5,
        title: "MVP 開發 — 後端與 AI",
        topics: [
          "Supabase 後端設計",
          "Claude API / Vercel AI SDK 整合",
          "Server Actions + Edge Functions",
          "實戰：AI 核心功能上線",
        ],
        hours: 20,
      },
      {
        week: 6,
        title: "付款與訂閱系統",
        topics: [
          "Stripe 整合（一次性 + 訂閱制）",
          "定價策略設計（Freemium / Pro / Enterprise）",
          "用量計費 vs 固定計費模型",
          "實戰：完整付款流程上線",
        ],
        hours: 20,
      },
      {
        week: 7,
        title: "部署與 DevOps",
        topics: [
          "Vercel 生產部署最佳實踐",
          "Cloudflare DNS + CDN 配置",
          "監控（Sentry + Analytics）",
          "實戰：生產環境上線",
        ],
        hours: 20,
      },
      {
        week: 8,
        title: "用戶反饋與快速迭代",
        topics: [
          "用戶反饋收集系統",
          "A/B 測試框架設計",
          "功能優先級排序（RICE 框架）",
          "實戰：首輪用戶測試 + 迭代",
        ],
        hours: 20,
      },
      {
        week: 9,
        title: "增長引擎 — SEO 與內容",
        topics: [
          "Programmatic SEO 策略",
          "AI 輔助內容生產流程",
          "Product Hunt / Hacker News 發布策略",
          "實戰：增長實驗計劃 + 首次發布",
        ],
        hours: 20,
      },
      {
        week: 10,
        title: "增長引擎 — 社群與病毒式",
        topics: [
          "社群運營（Twitter/X、Reddit、Discord）",
          "邀請機制與推薦獎勵設計",
          "用戶留存策略（Onboarding + Engagement）",
          "實戰：社群啟動 + 邀請系統開發",
        ],
        hours: 20,
      },
      {
        week: 11,
        title: "數據分析與商業模型",
        topics: [
          "核心指標（MRR / Churn / LTV / CAC）",
          "數據看板設計（Mixpanel / PostHog）",
          "財務模型與盈利時間表",
          "實戰：商業計劃書撰寫",
        ],
        hours: 20,
      },
      {
        week: 12,
        title: "融資基礎與 Pitch Deck",
        topics: [
          "種子輪 / Pre-A 融資流程",
          "Pitch Deck 結構（問題 → 方案 → 市場 → 團隊）",
          "香港 / 深圳投資生態",
          "實戰：Pitch Deck 撰寫",
        ],
        hours: 20,
      },
      {
        week: 13,
        title: "法律合規與公司設立",
        topics: [
          "香港公司註冊（CR / BR / 銀行開戶）",
          "AI 合規：數據保護與用戶隱私",
          "知識產權保護策略",
          "實戰：合規清單完成",
        ],
        hours: 20,
      },
      {
        week: 14,
        title: "規模化與團隊組建",
        topics: [
          "技術架構擴展計劃",
          "招聘策略（技術 + 營運）",
          "遠程團隊管理工具與流程",
          "實戰：擴展路線圖",
        ],
        hours: 20,
      },
      {
        week: 15,
        title: "Demo Day 準備",
        topics: [
          "產品 Demo 打磨與演示流程",
          "演講技巧與 Q&A 準備",
          "投資人對接策略",
          "實戰：3 輪彩排與反饋",
        ],
        hours: 20,
      },
      {
        week: 16,
        title: "Demo Day 與認證",
        topics: [
          "正式 Demo Day — 向投資人展示",
          "一對一投資人對接",
          "畢業典禮與校友網絡啟動",
          "AI 創業領袖認證",
        ],
        hours: 20,
      },
    ],
    projects: [
      {
        title: "AI SaaS 產品上線",
        desc: "從零到一的 AI SaaS：前端 + 後端 + AI + 付款 + 部署，真正上線運行。",
        tags: ["Next.js", "Claude API", "Stripe"],
      },
      {
        title: "投資人 Pitch Deck",
        desc: "完整商業計劃書和投資人 Pitch Deck，經過模擬路演打磨。",
        tags: ["融資", "商業計劃", "路演"],
      },
      {
        title: "增長實驗報告",
        desc: "真實的用戶增長實驗數據：SEO、Product Hunt 發布、社群運營效果分析。",
        tags: ["增長", "SEO", "數據分析"],
      },
    ],
    instructors: [
      {
        name: "Jason Cheung",
        role: "連續創業者",
        bio: "3 次成功退出，YC 校友，投資過 20+ AI 初創",
        image: "JC",
      },
      {
        name: "Rachel Lee",
        role: "產品策略顧問",
        bio: "前騰訊產品總監，專注 AI 產品設計與增長策略",
        image: "RL",
      },
    ],
    faq: [
      {
        q: "適合什麼人？",
        a: "有技術基礎且想用 AI 創業的人。不限年齡和背景，但需要投入大量時間。",
      },
      {
        q: "需要先有產品想法嗎？",
        a: "不需要！前兩週會用系統方法幫你找到有市場潛力的方向。但有想法更好。",
      },
      {
        q: "課程結束後有支援嗎？",
        a: "終身校友網絡 + 投資人推薦 + 導師諮詢。很多畢業生之間也會互相合作。",
      },
      {
        q: "可以分期付款嗎？",
        a: "可以！6 期免息分期，每期約 HK$5,000。也接受公司報銷。",
      },
    ],
  },
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */

interface CourseDetailProps {
  params: Promise<{ level: string }>;
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const { level } = use(params);
  if (!(level in courseData)) notFound();
  const course = courseData[level];
  const color = LEVEL_COLORS[level];

  /* --- Scroll-based hero parallax --- */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.7], [1, 0.96]);

  /* --- FAQ state --- */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* --- Total hours calculation --- */
  const totalHours = course.modules.reduce(
    (sum: number, m: Module) => sum + m.hours,
    0,
  );

  return (
    <div className="bg-[#FAFBFF] text-[#1A1A2E] min-h-screen">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm shadow-gray-100/20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-[#4169E1] transition">
              資源
            </Link>
            <Link
              href="/courses"
              className="text-[#4169E1] font-bold"
            >
              課程
            </Link>
            <Link href="/friends" className="hover:text-[#4169E1] transition">
              更多資源
            </Link>
          </div>
          <motion.a
            href="/friends"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:inline-flex text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg transition"
            style={{ background: color, boxShadow: `0 8px 24px ${color}30` }}
          >
            免費資源
          </motion.a>
        </div>
      </nav>

      <main id="main-content">
      {/* ═══ STICKY HERO ═══ */}
      <section
        ref={heroRef}
        className="relative pt-20 pb-6 overflow-hidden"
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color}, transparent)`,
          }}
        />

        <motion.div
          className="relative max-w-6xl mx-auto px-6"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-gray-400 mb-4 pt-2"
          >
            <Link href="/courses" className="hover:text-[#4169E1] transition">
              課程
            </Link>
            <span>/</span>
            <span style={{ color }} className="font-semibold">
              {course.level}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: Main info — 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="lg:col-span-3"
            >
              {/* Level badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{course.icon}</span>
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `${color}15`,
                    color,
                  }}
                >
                  {course.level} 認證
                </span>
              </div>

              <h1 className="text-3xl font-black mb-1.5 tracking-tight">
                {course.title}
              </h1>
              <p className="text-sm text-gray-400 mb-5">{course.subtitle}</p>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { icon: <ClockIcon className="w-3.5 h-3.5" />, label: course.duration },
                  { icon: <BookIcon className="w-3.5 h-3.5" />, label: `${totalHours} 小時` },
                  { icon: <GlobeIcon className="w-3.5 h-3.5" />, label: course.language },
                  { icon: <AwardIcon className="w-3.5 h-3.5" />, label: course.certificate },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-gray-500 bg-white rounded-lg border border-gray-100 px-3 py-1.5"
                  >
                    <span style={{ color }}>{stat.icon}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Overview */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {course.overview}
              </p>
            </motion.div>

            {/* Right: Price card — 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.15 }}
              className="lg:col-span-2"
              style={{ perspective: 800 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 p-5 sticky top-20">
                {/* Top bar accent */}
                <div
                  className="h-1 rounded-full mb-4 -mt-1"
                  style={{ background: color }}
                />

                {/* Price — hidden for now */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-400">
                    即將推出
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  {course.duration} 課程 / 包含所有材料
                </p>

                {/* Key benefits */}
                <ul className="space-y-2 mb-5">
                  {[
                    `${course.modules.length} 週系統化課程`,
                    `${totalHours} 小時實戰內容`,
                    "導師一對一批改",
                    `${course.certificate}`,
                    "1 年免費重修",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-gray-600"
                    >
                      <CheckIcon
                        className="w-3.5 h-3.5 flex-shrink-0"
                      />
                      <span style={{ color: i < 2 ? color : undefined }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-2">
                  <motion.a
                    href="https://wa.me/85267552667"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-3 rounded-xl text-white text-sm font-bold text-center shadow-lg transition"
                    style={{
                      background: color,
                      boxShadow: `0 8px 24px ${color}30`,
                    }}
                  >
                    立即報名
                  </motion.a>
                  <motion.a
                    href="https://wa.me/85267552667"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-3 rounded-xl text-sm font-semibold text-center border-2 transition"
                    style={{
                      borderColor: `${color}30`,
                      color,
                    }}
                  >
                    免費諮詢
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ WEEKLY CURRICULUM — Vertical Timeline ═══ */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
                style={{ background: color }}
              >
                <BookIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-black">課程大綱</h2>
                <p className="text-xs text-gray-400">
                  {course.modules.length} 週 / {totalHours} 小時 / 每週實戰項目
                </p>
              </div>
            </div>
          </SectionReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {course.modules.map((module: Module, index: number) => (
              <TimelineModule
                key={index}
                module={module}
                index={index}
                total={course.modules.length}
                color={color}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ WHAT YOU'LL BUILD ═══ */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-8">
              <h2 className="text-xl font-black mb-1">你會做出什麼</h2>
              <p className="text-xs text-gray-400">
                課程結束後，你將擁有這些實戰作品
              </p>
            </div>
          </SectionReveal>

          <motion.div
            className="grid md:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {course.projects.map((project: Project, i: number) => (
              <motion.div
                key={i}
                variants={fadeInScale}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-[#FAFBFF] rounded-2xl border border-gray-100 p-5 group"
              >
                {/* Project number */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-3"
                  style={{ background: color }}
                >
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold mb-1.5">{project.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag: string, j: number) => (
                    <span
                      key={j}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${color}10`,
                        color,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ INSTRUCTORS ═══ */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-8">
              <h2 className="text-xl font-black mb-1">導師團隊</h2>
              <p className="text-xs text-gray-400">
                行業頂尖專家，手把手教學
              </p>
            </div>
          </SectionReveal>

          <motion.div
            className="grid md:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {course.instructors.map((instructor: Instructor, i: number) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4"
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}BB)`,
                  }}
                >
                  {instructor.image}
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-0.5">
                    {instructor.name}
                  </h3>
                  <p
                    className="text-xs font-semibold mb-1.5"
                    style={{ color }}
                  >
                    {instructor.role}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {instructor.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black mb-1">常見問題</h2>
              <p className="text-xs text-gray-400">
                還有疑問？WhatsApp 我們免費諮詢
              </p>
            </div>
          </SectionReveal>

          <motion.div
            className="space-y-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {course.faq.map((item: FaqItem, i: number) => (
              <motion.div key={i} variants={fadeInUp}>
                <FaqAccordion
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                  color={color}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA FOOTER ═══ */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          <SectionReveal>
            <div
              className="rounded-2xl p-8 text-center border"
              style={{
                background: `linear-gradient(135deg, ${color}08, ${color}04)`,
                borderColor: `${color}20`,
              }}
            >
              <span className="text-4xl block mb-3">{course.icon}</span>
              <h2 className="text-2xl font-black mb-2">
                準備好開始了嗎？
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                加入 2,800+ 認證學員，用 AI 技能改變你的未來
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <motion.a
                  href="https://wa.me/85267552667"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition"
                  style={{
                    background: color,
                    boxShadow: `0 8px 24px ${color}30`,
                  }}
                >
                  立即報名 {course.level} 認證
                </motion.a>
                <motion.a
                  href="https://wa.me/85267552667"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200/40 transition"
                >
                  WhatsApp 諮詢
                </motion.a>
              </div>
              <p className="text-[11px] text-gray-300 mt-4">
                7 天無理由退款保證
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0F172A] text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              &copy; 2026 SkillAI.hk &middot; DeFiner Tech Ltd
            </p>
            <div className="flex gap-4 text-xs">
              <Link
                href="/privacy"
                className="hover:text-white transition"
              >
                私隱政策
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                服務條款
              </Link>
              <Link href="/courses" className="hover:text-white transition">
                所有課程
              </Link>
              <Link href="/" className="hover:text-white transition">
                返回首頁
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
