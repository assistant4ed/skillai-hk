"use client";
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Logo from '../../components/Logo';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type PostType = 'article' | 'video' | 'tip' | 'news';
type ResourceType = 'tool' | 'article' | 'video' | 'course' | 'github' | 'community';
type LevelKey = 'bronze' | 'silver' | 'gold' | 'platinum' | 'openclaw' | 'all';
type UseCaseKey = 'marketing' | 'developer' | 'business' | 'creative' | 'education' | 'finance' | 'general';
type ViewMode = 'level' | 'usecase' | 'featured';

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

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  level: LevelKey;
  useCase: UseCaseKey[];
  tags: string[];
  free: boolean;
  stars?: string;
  featured?: boolean;
}

/* ─────────────────────────────────────────────
   Curated Blog Posts (kept from original)
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Resource Data (80+ entries)
───────────────────────────────────────────── */
const RESOURCES: Resource[] = [
  /* ══════════════════════════════════════════════
     BRONZE — Prompt 同 AI 基礎
     (學習 Prompt、API、本地聊天 UI)
  ══════════════════════════════════════════════ */
  {
    id: 'learn-prompting', title: 'Learn Prompting', description: '免費 Prompt Engineering 完整教學網站，從入門到進階，附大量實例同練習。',
    url: 'https://learnprompting.org', type: 'course', level: 'bronze', useCase: ['education', 'general'],
    tags: ['教學', '免費', 'Prompt'], free: true, featured: true,
  },
  {
    id: 'anthropic-prompt-library', title: 'Anthropic Prompt Library', description: 'Claude 官方 Prompt 庫，200+ 精心設計嘅 Prompt，可直接複製使用。',
    url: 'https://docs.anthropic.com/en/prompt-library', type: 'article', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['Claude', '官方', 'Prompt 庫'], free: true,
  },
  {
    id: 'awesome-prompts', title: 'Awesome ChatGPT Prompts', description: '最多人 Star 嘅 Prompt 合集，涵蓋角色扮演、學習、寫作等所有場景。',
    url: 'https://github.com/f/awesome-chatgpt-prompts', type: 'github', level: 'bronze', useCase: ['general', 'education'],
    tags: ['開源', 'Prompt 合集', '角色扮演'], free: true, stars: '115K', featured: true,
  },
  {
    id: 'fabric', title: 'Fabric', description: '200+ 開源 Prompt 模式，CLI 工具一行指令完成複雜 AI 任務，AI 瑞士軍刀。',
    url: 'https://github.com/danielmiessler/fabric', type: 'github', level: 'bronze', useCase: ['developer', 'general'],
    tags: ['開源', 'CLI', 'Prompt 模式'], free: true, stars: '28K',
  },
  {
    id: 'promptfoo', title: 'Promptfoo', description: '開源 Prompt 測試同評估工具，CI/CD 整合，比較唔同 Prompt 嘅效果。',
    url: 'https://github.com/promptfoo/promptfoo', type: 'github', level: 'bronze', useCase: ['developer'],
    tags: ['Prompt 測試', '評估', 'CI/CD'], free: true, stars: '6K',
  },
  {
    id: 'open-prompt', title: 'Open Prompt', description: '開源 Prompt 管理同分享平台，社群驅動，支援版本管理同協作編輯。',
    url: 'https://github.com/timqian/openprompt.co', type: 'github', level: 'bronze', useCase: ['general', 'education'],
    tags: ['開源', 'Prompt 分享', '社群'], free: true, stars: '1.5K',
  },
  {
    id: 'typingmind', title: 'TypingMind', description: '開源 Chat UI，支援多模型切換，自訂 Prompt 同插件，本地部署更私密。',
    url: 'https://github.com/nicepkg/gpt-runner', type: 'tool', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['Chat UI', '多模型', '自部署'], free: true,
  },
  {
    id: 'jan', title: 'Jan', description: '本地 AI 聊天桌面 App，離線運行 LLM，支援 Llama、Mistral，私隱至上。',
    url: 'https://github.com/janhq/jan', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['本地 AI', '桌面 App', '離線'], free: true, stars: '25K',
  },
  {
    id: 'msty', title: 'Msty', description: '本地 LLM 桌面客戶端，支援多模型對比、RAG、離線使用，介面精美。',
    url: 'https://msty.app', type: 'tool', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['本地 LLM', '桌面', '多模型'], free: true,
  },
  {
    id: 'ai-shell', title: 'AI Shell', description: '終端機 AI 助手，自然語言轉 Shell 指令，支援多模型，開發者日常必備。',
    url: 'https://github.com/BuilderIO/ai-shell', type: 'github', level: 'bronze', useCase: ['developer'],
    tags: ['CLI', 'Shell', '開發工具'], free: true, stars: '4K',
  },
  {
    id: 'shellgpt', title: 'ShellGPT', description: '命令列 AI 助手，直接喺 Terminal 問問題、生成代碼、執行指令。',
    url: 'https://github.com/TheR1D/shell_gpt', type: 'github', level: 'bronze', useCase: ['developer'],
    tags: ['CLI', 'Python', 'Terminal'], free: true, stars: '10K',
  },
  {
    id: 'khoj', title: 'Khoj', description: '自架設 AI 助手，支援 RAG、搜尋、多模型，個人知識庫管理，私隱友好。',
    url: 'https://github.com/khoj-ai/khoj', type: 'github', level: 'bronze', useCase: ['developer', 'general'],
    tags: ['自架設', '知識庫', 'RAG'], free: true, stars: '18K',
  },
  {
    id: 'librechat', title: 'LibreChat', description: '開源 ChatGPT 替代，支援多 AI 供應商、插件、多用戶，可自部署。',
    url: 'https://github.com/danny-avila/LibreChat', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['開源', '自部署', '多模型'], free: true, stars: '20K', featured: true,
  },
  {
    id: 'chatbox', title: 'ChatBox', description: '跨平台 AI 桌面客戶端，支援 OpenAI、Claude、本地模型，介面簡潔。',
    url: 'https://github.com/Bin-Huang/chatbox', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['桌面 App', '跨平台', '多模型'], free: true, stars: '22K',
  },
  {
    id: 'localai', title: 'LocalAI', description: '本地模型伺服器，相容 OpenAI API，無需 GPU 都可以跑，完全離線。',
    url: 'https://github.com/mudler/LocalAI', type: 'github', level: 'bronze', useCase: ['developer'],
    tags: ['本地運行', 'API 相容', '離線'], free: true, stars: '28K',
  },
  {
    id: 'gpt4all', title: 'GPT4All', description: '本地 LLM 生態系統，一鍵安裝，支援多模型，CPU 就跑到，私隱友好。',
    url: 'https://github.com/nomic-ai/gpt4all', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['本地 LLM', 'CPU', '易用'], free: true, stars: '72K',
  },
  {
    id: 'text-generation-webui', title: 'Text Generation WebUI', description: 'Oobabooga 出品，最強本地 LLM Web 介面，支援所有主流模型格式。',
    url: 'https://github.com/oobabooga/text-generation-webui', type: 'github', level: 'bronze', useCase: ['developer'],
    tags: ['Web UI', '本地模型', '進階'], free: true, stars: '42K',
  },
  {
    id: 'lm-studio', title: 'LM Studio', description: '本地 LLM 桌面 App，圖形化介面下載同運行模型，支援 GGUF，極易上手。',
    url: 'https://lmstudio.ai', type: 'tool', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['本地 LLM', '桌面', 'GGUF'], free: true, featured: true,
  },
  {
    id: 'lobe-chat', title: 'Lobe Chat', description: '開源 Chat 框架，支援多模型、插件、TTS、視覺，可自部署，功能極豐富。',
    url: 'https://github.com/lobehub/lobe-chat', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['開源', '多模型', '插件'], free: true, stars: '50K',
  },
  {
    id: 'nextchat', title: 'NextChat', description: '一鍵部署 ChatGPT Web UI，支援 Vercel、Docker，多模型切換，跨平台。',
    url: 'https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web', type: 'github', level: 'bronze', useCase: ['general', 'developer'],
    tags: ['Web UI', 'Vercel', '一鍵部署'], free: true, stars: '78K',
  },

  /* ══════════════════════════════════════════════
     SILVER — 開發框架
     (LLM 框架、SDK、結構化輸出)
  ══════════════════════════════════════════════ */
  {
    id: 'langchain', title: 'LangChain', description: '最成熟嘅 LLM 開發框架，連接模型、工具、記憶體，構建複雜 AI 應用首選。',
    url: 'https://github.com/langchain-ai/langchain', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['框架', 'RAG', 'Agent'], free: true, featured: true, stars: '98K',
  },
  {
    id: 'llamaindex', title: 'LlamaIndex', description: 'RAG 應用首選框架，輕鬆連接文件、數據庫、API，構建智能搜尋系統。',
    url: 'https://github.com/run-llama/llama_index', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['RAG', '向量搜尋', '文件處理'], free: true, stars: '38K',
  },
  {
    id: 'crewai', title: 'CrewAI', description: '多 Agent 協作框架，讓多個 AI 角色分工合作，自動完成研究報告、代碼開發。',
    url: 'https://github.com/crewAIInc/crewAI', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['多 Agent', '自動化', 'Python'], free: true, stars: '23K',
  },
  {
    id: 'autogen', title: 'AutoGen', description: 'Microsoft 出品多 Agent 框架，支援對話式多 Agent 協作，企業信任度高。',
    url: 'https://github.com/microsoft/autogen', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['Microsoft', '多 Agent', '企業'], free: true, stars: '38K',
  },
  {
    id: 'dify', title: 'Dify', description: '可視化 AI 應用開發平台，拖拉式構建 RAG、Chatbot、Agent，開源可自部署。',
    url: 'https://github.com/langgenius/dify', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['可視化', '開源', 'No-Code'], free: true, featured: true, stars: '55K',
  },
  {
    id: 'flowise', title: 'Flowise', description: '拖拉 Node 構建 LLM 流程，零代碼搭建 Agent、RAG 應用，5 分鐘上線。',
    url: 'https://github.com/FlowiseAI/Flowise', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['No-Code', 'Node', '視覺化'], free: true, stars: '32K',
  },
  {
    id: 'haystack', title: 'Haystack', description: 'deepset 出品 NLP 框架，專注 RAG 同搜尋，Pipeline 設計模式，生產級穩定。',
    url: 'https://github.com/deepset-ai/haystack', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['RAG', 'NLP', 'Pipeline'], free: true, stars: '18K',
  },
  {
    id: 'semantic-kernel', title: 'Semantic Kernel', description: 'Microsoft 出品 LLM SDK，支援 C#、Python、Java，企業 .NET 生態首選。',
    url: 'https://github.com/microsoft/semantic-kernel', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['Microsoft', '.NET', 'SDK'], free: true, stars: '22K',
  },
  {
    id: 'instructor', title: 'Instructor', description: '結構化 LLM 輸出工具，用 Pydantic 定義 Schema，保證 JSON 輸出格式。',
    url: 'https://github.com/jxnl/instructor', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['結構化輸出', 'Pydantic', 'Schema'], free: true, stars: '8K',
  },
  {
    id: 'mastra', title: 'Mastra', description: 'TypeScript AI 框架，Agent、RAG、Workflow 一站式，前端開發者友好。',
    url: 'https://github.com/mastra-ai/mastra', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['TypeScript', 'Agent', 'Workflow'], free: true, stars: '8K',
  },
  {
    id: 'pydantic-ai', title: 'Pydantic AI', description: 'Pydantic 團隊出品 AI Agent 框架，類型安全、結構化輸出、依賴注入。',
    url: 'https://github.com/pydantic/pydantic-ai', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['Pydantic', 'Agent', '類型安全'], free: true, stars: '5K',
  },
  {
    id: 'vercel-ai-sdk', title: 'Vercel AI SDK', description: 'Vercel 出品 AI 開發工具包，Streaming UI、多模型支援，Next.js 完美整合。',
    url: 'https://github.com/vercel/ai', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['Vercel', 'Next.js', 'Streaming'], free: true, stars: '12K', featured: true,
  },
  {
    id: 'spring-ai', title: 'Spring AI', description: 'Spring 生態嘅 AI 框架，Java 企業開發者首選，支援多模型同向量存儲。',
    url: 'https://github.com/spring-projects/spring-ai', type: 'github', level: 'silver', useCase: ['developer', 'business'],
    tags: ['Java', 'Spring', '企業'], free: true, stars: '3K',
  },
  {
    id: 'litellm', title: 'LiteLLM', description: '統一 100+ LLM API，一行代碼切換 OpenAI、Claude、Gemini，支援 fallback。',
    url: 'https://github.com/BerriAI/litellm', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['API Gateway', '多模型', '統一'], free: true, stars: '18K',
  },
  {
    id: 'vllm', title: 'vLLM', description: '高效 LLM 推理框架，PagedAttention 技術，吞吐量比 HuggingFace 高 24 倍。',
    url: 'https://github.com/vllm-project/vllm', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['推理優化', '高性能', '開源'], free: true, stars: '40K',
  },
  {
    id: 'guidance', title: 'Guidance', description: 'Microsoft 出品，約束生成框架，控制 LLM 輸出格式，正則同文法級別精度。',
    url: 'https://github.com/guidance-ai/guidance', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['約束生成', '格式控制', 'Microsoft'], free: true, stars: '19K',
  },
  {
    id: 'dspy', title: 'DSPy', description: 'Stanford 出品，程式化 Prompt 優化框架，自動搜索最佳 Prompt，超越手動調參。',
    url: 'https://github.com/stanfordnlp/dspy', type: 'github', level: 'silver', useCase: ['developer', 'education'],
    tags: ['Prompt 優化', 'Stanford', '自動化'], free: true, stars: '20K',
  },
  {
    id: 'mirascope', title: 'Mirascope', description: '輕量級 LLM 開發工具，Pythonic API，支援多模型，極簡設計，上手極快。',
    url: 'https://github.com/Mirascope/mirascope', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['Python', '輕量級', '多模型'], free: true, stars: '1.5K',
  },
  {
    id: 'agno', title: 'Agno', description: '高效能 Agent 框架，支援多模態、記憶體、工具整合，構建生產級 Agent。',
    url: 'https://github.com/agno-agi/agno', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['Agent', '高性能', '多模態'], free: true, stars: '18K',
  },
  {
    id: 'ell', title: 'ell', description: '輕量級 Prompt 工程庫，版本追蹤同視覺化，將 Prompt 當代碼管理。',
    url: 'https://github.com/MadcowD/ell', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['Prompt 管理', '版本控制', '輕量'], free: true, stars: '6K',
  },

  /* ══════════════════════════════════════════════
     GOLD — 基建同 DevOps
     (部署、監控、向量 DB、數據處理)
  ══════════════════════════════════════════════ */
  {
    id: 'ollama', title: 'Ollama', description: '本地跑 LLM，零配置，一個指令下載 Llama、Qwen、Mistral 等 100+ 模型。',
    url: 'https://github.com/ollama/ollama', type: 'github', level: 'gold', useCase: ['developer', 'general'],
    tags: ['本地 LLM', '私隱', '離線'], free: true, stars: '120K', featured: true,
  },
  {
    id: 'open-webui', title: 'Open WebUI', description: '自架設 ChatGPT 替代介面，支援 Ollama 同 OpenAI API，功能齊全。',
    url: 'https://github.com/open-webui/open-webui', type: 'github', level: 'gold', useCase: ['developer', 'general'],
    tags: ['Web UI', '自部署', 'Ollama'], free: true, stars: '55K', featured: true,
  },
  {
    id: 'supabase', title: 'Supabase', description: '開源 Firebase 替代，內建 pgvector，一站式數據庫 + Auth + Storage + AI。',
    url: 'https://github.com/supabase/supabase', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['PostgreSQL', 'pgvector', '開源'], free: true, stars: '75K',
  },
  {
    id: 'n8n', title: 'n8n', description: '開源工作流自動化平台，支援 AI Agent 節點，400+ 整合，可自部署。',
    url: 'https://github.com/n8n-io/n8n', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['自動化', '工作流', '開源'], free: true, stars: '52K',
  },
  {
    id: 'anything-llm', title: 'AnythingLLM', description: '一站式本地 AI 桌面 App，RAG、Agent、多模型，企業私有部署首選。',
    url: 'https://github.com/Mintplex-Labs/anything-llm', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['RAG', '本地部署', '企業'], free: true, stars: '30K',
  },
  {
    id: 'langfuse', title: 'Langfuse', description: 'LLM 可觀測性平台，追蹤 Prompt、成本、延遲，開源可自部署，生產必備。',
    url: 'https://github.com/langfuse/langfuse', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['監控', '可觀測性', '開源'], free: true, stars: '8K',
  },
  {
    id: 'helicone', title: 'Helicone', description: '開源 LLM 代理，一行代碼加入監控、緩存、速率限制，支援所有主流 API。',
    url: 'https://github.com/Helicone/helicone', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['LLM Proxy', '監控', '緩存'], free: true, stars: '3K',
  },
  {
    id: 'phoenix-arize', title: 'Phoenix (Arize)', description: 'LLM 可觀測性同評估工具，追蹤 Trace、Span，視覺化 RAG Pipeline。',
    url: 'https://github.com/Arize-ai/phoenix', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['Tracing', '評估', 'RAG'], free: true, stars: '4K',
  },
  {
    id: 'portkey', title: 'Portkey', description: '開源 AI Gateway，統一管理多模型 API，支援 fallback、緩存、日誌。',
    url: 'https://github.com/Portkey-AI/gateway', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['AI Gateway', '多模型', '路由'], free: true, stars: '6K',
  },
  {
    id: 'mindsdb', title: 'MindsDB', description: '用 SQL 做 AI，連接數據庫直接訓練同查詢模型，數據工程師最愛。',
    url: 'https://github.com/mindsdb/mindsdb', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['SQL', 'AI', '數據庫'], free: true, stars: '27K',
  },
  {
    id: 'weaviate', title: 'Weaviate', description: '開源向量數據庫，支援多模態搜尋（文字、圖片、音頻），GraphQL API。',
    url: 'https://github.com/weaviate/weaviate', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['向量數據庫', '多模態', '開源'], free: true, stars: '12K',
  },
  {
    id: 'qdrant', title: 'Qdrant', description: '高性能向量搜尋引擎，Rust 編寫，延遲極低，支援過濾搜尋，開源可自部署。',
    url: 'https://github.com/qdrant/qdrant', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['向量搜尋', 'Rust', '高性能'], free: true, stars: '22K',
  },
  {
    id: 'chroma', title: 'Chroma', description: '最簡單嘅開源向量數據庫，Python 原生，幾行代碼就跑到，AI 應用原型首選。',
    url: 'https://github.com/chroma-core/chroma', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['向量數據庫', 'Python', '簡單'], free: true, stars: '16K',
  },
  {
    id: 'milvus', title: 'Milvus', description: '雲原生向量數據庫，支援十億級向量，分佈式架構，生產環境大規模部署。',
    url: 'https://github.com/milvus-io/milvus', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['向量數據庫', '分佈式', '大規模'], free: true, stars: '32K',
  },
  {
    id: 'apache-age', title: 'Apache AGE', description: 'PostgreSQL 圖數據庫擴展，用 SQL 同 Cypher 查詢圖數據，知識圖譜好幫手。',
    url: 'https://github.com/apache/age', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['圖數據庫', 'PostgreSQL', '知識圖譜'], free: true, stars: '3K',
  },
  {
    id: 'modal', title: 'Modal', description: 'AI 模型雲端部署，Serverless GPU，Cold Start 極快，按用量收費，零運維。',
    url: 'https://modal.com', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['Serverless', 'GPU', '部署'], free: false,
  },
  {
    id: 'replicate', title: 'Replicate', description: '一行 API 跑任何開源模型，支援自訂模型部署，Stable Diffusion 等熱門模型。',
    url: 'https://replicate.com', type: 'tool', level: 'gold', useCase: ['developer', 'creative'],
    tags: ['API', '模型部署', '開源模型'], free: false,
  },
  {
    id: 'runpod', title: 'RunPod', description: '平價 GPU 雲端，Serverless 同 Pod 兩種模式，LLM 推理同訓練最抵選擇。',
    url: 'https://runpod.io', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['GPU 雲端', 'Serverless', '平價'], free: false,
  },
  {
    id: 'docker-model-runner', title: 'Docker Model Runner', description: 'Docker 官方 AI 模型運行器，容器化部署 LLM，同 Docker 生態完美整合。',
    url: 'https://docs.docker.com/desktop/features/model-runner/', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['Docker', '容器化', '模型部署'], free: true,
  },
  {
    id: 'unstructured', title: 'Unstructured', description: '非結構化數據處理庫，PDF、Word、HTML 轉結構化數據，RAG 前處理必備。',
    url: 'https://github.com/Unstructured-IO/unstructured', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['數據處理', 'PDF', 'RAG'], free: true, stars: '10K',
  },

  /* ══════════════════════════════════════════════
     PLATINUM — AI Agent 同自動化
     (自主 Agent、代碼助手、工具整合)
  ══════════════════════════════════════════════ */
  {
    id: 'browser-use', title: 'Browser Use', description: 'AI 控制瀏覽器自動化，自然語言描述任務，AI 自動點擊、填表、爬取數據。',
    url: 'https://github.com/browser-use/browser-use', type: 'github', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['瀏覽器自動化', 'Playwright', 'AI Agent'], free: true, stars: '21K', featured: true,
  },
  {
    id: 'openclaw', title: 'OpenClaw', description: 'SkillAI.hk 自家開源 AI Agent 平台，多 Agent 協作，本地部署，粵語支援。',
    url: 'https://github.com/openclaw', type: 'github', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['開源', 'Agent', '粵語'], free: true,
  },
  {
    id: 'autogpt', title: 'AutoGPT', description: '最早嘅自主 AI Agent，自動分解目標、搜尋、執行，開源 Agent 先驅。',
    url: 'https://github.com/Significant-Gravitas/AutoGPT', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['自主 Agent', '開源', '先驅'], free: true, stars: '170K',
  },
  {
    id: 'babyagi', title: 'BabyAGI', description: '極簡 AI Agent 框架，自動生成同優先排序任務，學習 Agent 概念嘅最佳起點。',
    url: 'https://github.com/yoheinakajima/babyagi', type: 'github', level: 'platinum', useCase: ['developer', 'education'],
    tags: ['任務管理', '極簡', '學習'], free: true, stars: '20K',
  },
  {
    id: 'metagpt', title: 'MetaGPT', description: '多 Agent 軟件公司模擬，PM、架構師、工程師角色協作，自動生成完整項目。',
    url: 'https://github.com/geekan/MetaGPT', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['多 Agent', '軟件開發', '模擬'], free: true, stars: '46K',
  },
  {
    id: 'gpt-pilot', title: 'GPT Pilot', description: 'AI 開發助手，同你一步步寫完整應用，自動調試、測試、部署。',
    url: 'https://github.com/Pythagora-io/gpt-pilot', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['開發助手', '全棧', '自動化'], free: true, stars: '32K',
  },
  {
    id: 'devika', title: 'Devika', description: '開源 AI 軟件工程師，理解需求、搜尋資料、寫代碼，Devin 嘅開源替代。',
    url: 'https://github.com/stitionai/devika', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['AI 工程師', '開源', '自主'], free: true, stars: '18K',
  },
  {
    id: 'openhands', title: 'OpenHands (OpenDevin)', description: '開源 AI 軟件工程師平台，自主編寫、測試、調試代碼，社群活躍。',
    url: 'https://github.com/All-Hands-AI/OpenHands', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['AI 工程師', '開源', '活躍'], free: true, stars: '40K', featured: true,
  },
  {
    id: 'swe-agent', title: 'SWE-Agent', description: 'Princeton 出品，AI 自動修復 GitHub Issues，SWE-bench 測試表現優異。',
    url: 'https://github.com/princeton-nlp/SWE-agent', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['Bug 修復', 'Princeton', 'GitHub'], free: true, stars: '14K',
  },
  {
    id: 'aider', title: 'Aider', description: 'Terminal 裡嘅 AI Pair Programmer，支援 Claude、GPT-4o，Git 原生整合。',
    url: 'https://github.com/paul-gauthier/aider', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['CLI', 'Pair Programmer', 'Git'], free: true, stars: '31K',
  },
  {
    id: 'claude-code', title: 'Claude Code', description: 'Anthropic 官方 CLI 代碼助手，直接喺 Terminal 寫代碼、修 Bug、重構。',
    url: 'https://docs.anthropic.com/en/docs/claude-code', type: 'tool', level: 'platinum', useCase: ['developer'],
    tags: ['CLI', 'Anthropic', '代碼助手'], free: false, featured: true,
  },
  {
    id: 'cline', title: 'Cline', description: '開源 VS Code AI 助手，自主操作文件同終端，支援多模型，Agent 模式。',
    url: 'https://github.com/cline/cline', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['VS Code', 'Agent', '開源'], free: true, stars: '18K',
  },
  {
    id: 'continue-dev', title: 'Continue', description: '開源 AI 代碼助手，VS Code 同 JetBrains 插件，支援本地模型，保護代碼私隱。',
    url: 'https://github.com/continuedev/continue', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['開源', 'IDE 插件', '本地模型'], free: true, stars: '20K',
  },
  {
    id: 'cursor', title: 'Cursor', description: 'AI 原生 IDE（開放核心），Composer 一次修改多個文件，Codebase 對話。',
    url: 'https://cursor.sh', type: 'tool', level: 'platinum', useCase: ['developer'],
    tags: ['AI IDE', 'Composer', '開放核心'], free: false, featured: true,
  },
  {
    id: 'windsurf', title: 'Windsurf', description: 'Codeium 出品 AI IDE，Cascade 功能自主完成多步驟任務，免費版功能強大。',
    url: 'https://windsurf.com', type: 'tool', level: 'platinum', useCase: ['developer'],
    tags: ['AI IDE', 'Cascade', '免費'], free: true,
  },
  {
    id: 'sweep', title: 'Sweep', description: 'AI 自動處理 GitHub Issues，生成 PR、修 Bug、寫測試，GitHub App 一鍵安裝。',
    url: 'https://github.com/sweepai/sweep', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['GitHub', 'PR 自動化', 'Bug 修復'], free: true, stars: '7K',
  },
  {
    id: 'composio', title: 'Composio', description: '開源工具整合平台，為 AI Agent 接入 150+ 外部工具同 API，一行代碼搞定。',
    url: 'https://github.com/ComposioHQ/composio', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['工具整合', 'API', 'Agent'], free: true, stars: '13K',
  },
  {
    id: 'toolhouse', title: 'Toolhouse', description: 'AI Agent 工具雲，預建 100+ 工具（搜尋、發 Email、讀數據庫），API 即用。',
    url: 'https://toolhouse.ai', type: 'tool', level: 'platinum', useCase: ['developer'],
    tags: ['工具雲', 'Agent', 'API'], free: true,
  },
  {
    id: 'agentops', title: 'AgentOps', description: '開源 AI Agent 監控平台，追蹤 Agent 行為、成本、錯誤率，生產級可觀測性。',
    url: 'https://github.com/AgentOps-AI/agentops', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['Agent 監控', '可觀測性', '開源'], free: true, stars: '3K',
  },
  {
    id: 'smith-agent-testing', title: 'Smith (Agent Testing)', description: '開源 Agent 測試框架，模擬環境測試 Agent 行為，確保生產穩定性。',
    url: 'https://github.com/smithery-ai/cli', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['測試', 'Agent', '品質'], free: true, stars: '1K',
  },

  /* ══════════════════════════════════════════════
     OPENCLAW — 專業領域
     (圖像、音頻、視覺、OCR、文件處理)
  ══════════════════════════════════════════════ */
  {
    id: 'comfyui', title: 'ComfyUI', description: '節點式 Stable Diffusion 工作流，強大可視化管線，AI 圖像生成進階工具。',
    url: 'https://github.com/comfyanonymous/ComfyUI', type: 'github', level: 'openclaw', useCase: ['creative', 'developer'],
    tags: ['圖像生成', '節點式', '工作流'], free: true, stars: '60K', featured: true,
  },
  {
    id: 'stable-diffusion-webui', title: 'Stable Diffusion WebUI', description: 'AUTOMATIC1111 出品，最多人用嘅 SD 介面，擴展生態豐富，社群龐大。',
    url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', type: 'github', level: 'openclaw', useCase: ['creative', 'developer'],
    tags: ['Stable Diffusion', 'Web UI', '擴展'], free: true, stars: '145K', featured: true,
  },
  {
    id: 'fooocus', title: 'Fooocus', description: '簡化版 SD 介面，專注易用性，自動優化參數，新手友好嘅圖像生成工具。',
    url: 'https://github.com/lllyasviel/Fooocus', type: 'github', level: 'openclaw', useCase: ['creative'],
    tags: ['圖像生成', '簡單', '新手友好'], free: true, stars: '42K',
  },
  {
    id: 'invokeai', title: 'InvokeAI', description: '專業級 SD 創作工具，Canvas 編輯、ControlNet、LoRA 管理，藝術家最愛。',
    url: 'https://github.com/invoke-ai/InvokeAI', type: 'github', level: 'openclaw', useCase: ['creative'],
    tags: ['圖像生成', '專業', 'Canvas'], free: true, stars: '24K',
  },
  {
    id: 'upscayl', title: 'Upscayl', description: '開源 AI 圖片放大工具，桌面 App，支援多種放大模型，本地處理保私隱。',
    url: 'https://github.com/upscayl/upscayl', type: 'github', level: 'openclaw', useCase: ['creative'],
    tags: ['圖片放大', '桌面 App', '開源'], free: true, stars: '32K',
  },
  {
    id: 'whisper', title: 'Whisper', description: 'OpenAI 開源語音識別模型，支援 99 種語言，準確率極高，本地可跑。',
    url: 'https://github.com/openai/whisper', type: 'github', level: 'openclaw', useCase: ['developer', 'business'],
    tags: ['語音識別', '多語言', 'OpenAI'], free: true, stars: '72K', featured: true,
  },
  {
    id: 'tts', title: 'Coqui TTS', description: '開源文字轉語音引擎，支援多語言、聲音克隆、自訂訓練，本地運行。',
    url: 'https://github.com/coqui-ai/TTS', type: 'github', level: 'openclaw', useCase: ['developer', 'creative'],
    tags: ['TTS', '語音合成', '開源'], free: true, stars: '36K',
  },
  {
    id: 'bark', title: 'Bark', description: 'Suno 出品開源語音生成，支援音樂、笑聲、嘆氣等非語音聲音，極度自然。',
    url: 'https://github.com/suno-ai/bark', type: 'github', level: 'openclaw', useCase: ['creative', 'developer'],
    tags: ['語音生成', '非語音', '自然'], free: true, stars: '36K',
  },
  {
    id: 'audiocraft', title: 'AudioCraft', description: 'Meta 出品開源音頻生成框架，支援音樂（MusicGen）同音效（AudioGen）。',
    url: 'https://github.com/facebookresearch/audiocraft', type: 'github', level: 'openclaw', useCase: ['creative', 'developer'],
    tags: ['音樂生成', 'Meta', '音效'], free: true, stars: '22K',
  },
  {
    id: 'demucs', title: 'Demucs', description: 'Meta 出品音頻分離工具，將歌曲分成人聲、鼓、低音、其他，效果業界頂級。',
    url: 'https://github.com/facebookresearch/demucs', type: 'github', level: 'openclaw', useCase: ['creative'],
    tags: ['音頻分離', 'Meta', '人聲提取'], free: true, stars: '8K',
  },
  {
    id: 'roop', title: 'Roop', description: '開源換臉工具，一張照片即可換臉，支援視頻同圖片，本地運行。',
    url: 'https://github.com/s0md3v/roop', type: 'github', level: 'openclaw', useCase: ['creative'],
    tags: ['換臉', '開源', '視頻'], free: true, stars: '28K',
  },
  {
    id: 'segment-anything', title: 'Segment Anything', description: 'Meta SAM 模型，一鍵分割圖片中任何物件，電腦視覺基礎模型。',
    url: 'https://github.com/facebookresearch/segment-anything', type: 'github', level: 'openclaw', useCase: ['developer', 'creative'],
    tags: ['圖像分割', 'Meta', '基礎模型'], free: true, stars: '48K',
  },
  {
    id: 'yolo', title: 'YOLO (Ultralytics)', description: '實時物件偵測模型，速度極快，支援偵測、分割、追蹤，部署簡單。',
    url: 'https://github.com/ultralytics/ultralytics', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['物件偵測', '實時', '部署'], free: true, stars: '35K',
  },
  {
    id: 'tesseract', title: 'Tesseract OCR', description: 'Google 維護嘅開源 OCR 引擎，支援 100+ 語言，最成熟嘅文字識別方案。',
    url: 'https://github.com/tesseract-ocr/tesseract', type: 'github', level: 'openclaw', useCase: ['developer', 'business'],
    tags: ['OCR', '文字識別', 'Google'], free: true, stars: '63K',
  },
  {
    id: 'paddleocr', title: 'PaddleOCR', description: '百度出品高精度 OCR，支援中英日韓等 80+ 語言，中文識別效果最佳。',
    url: 'https://github.com/PaddlePaddle/PaddleOCR', type: 'github', level: 'openclaw', useCase: ['developer', 'business'],
    tags: ['OCR', '中文', '百度'], free: true, stars: '45K',
  },
  {
    id: 'doctr', title: 'docTR', description: '開源文件文字識別庫，支援 TensorFlow 同 PyTorch，OCR + Layout 分析。',
    url: 'https://github.com/mindee/doctr', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['OCR', '文件分析', 'Layout'], free: true, stars: '4K',
  },
  {
    id: 'marker', title: 'Marker', description: '開源 PDF 轉 Markdown 工具，保留格式同結構，RAG 數據前處理神器。',
    url: 'https://github.com/VikParuchuri/marker', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['PDF', 'Markdown', 'RAG'], free: true, stars: '18K',
  },
  {
    id: 'mineru', title: 'MinerU', description: '開源文件解析工具，PDF 轉 Markdown/JSON，支援公式、表格、版面分析。',
    url: 'https://github.com/opendatalab/MinerU', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['PDF 解析', '表格', '公式'], free: true, stars: '25K',
  },
  {
    id: 'surya', title: 'Surya', description: '開源多語言 OCR 同版面分析，支援 90+ 語言，準確率超越商業方案。',
    url: 'https://github.com/VikParuchuri/surya', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['OCR', '多語言', '版面分析'], free: true, stars: '15K',
  },
  {
    id: 'docling', title: 'Docling', description: 'IBM 出品文件轉換工具，PDF/DOCX/HTML 轉結構化數據，企業文件處理。',
    url: 'https://github.com/DS4SD/docling', type: 'github', level: 'openclaw', useCase: ['developer', 'business'],
    tags: ['文件轉換', 'IBM', '結構化'], free: true, stars: '15K',
  },
];

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */
const LEVEL_CONFIG: Record<Exclude<LevelKey, 'all'>, { label: string; color: string; bg: string; emoji: string; desc: string }> = {
  bronze:   { label: 'Prompt 基礎',  color: '#92400E', bg: '#FEF3C7', emoji: '🥉', desc: 'Prompt 同 AI 基礎 — 學習 Prompt、API 同本地聊天工具' },
  silver:   { label: '開發框架',     color: '#374151', bg: '#F3F4F6', emoji: '🥈', desc: '開發框架 — LLM 框架、SDK 同結構化輸出' },
  gold:     { label: '基建部署',     color: '#92400E', bg: '#FFFBEB', emoji: '🥇', desc: '基建同 DevOps — 部署、監控、向量數據庫同數據處理' },
  platinum: { label: 'AI Agent',     color: '#5B21B6', bg: '#EDE9FE', emoji: '💎', desc: 'AI Agent 同自動化 — 自主 Agent、代碼助手同工具整合' },
  openclaw: { label: '專業領域',     color: '#1E3A8A', bg: '#DBEAFE', emoji: '🦞', desc: '專業領域 — 圖像、音頻、視覺、OCR 同文件處理' },
};

const USE_CASE_CONFIG: Record<Exclude<UseCaseKey, 'general'>, { label: string; emoji: string }> = {
  marketing:  { label: '市場行銷', emoji: '📣' },
  developer:  { label: '開發工程', emoji: '💻' },
  business:   { label: '商業應用', emoji: '🏢' },
  creative:   { label: '創意設計', emoji: '🎨' },
  education:  { label: '學習教育', emoji: '📚' },
  finance:    { label: '金融投資', emoji: '💰' },
};

const TYPE_ICON: Record<ResourceType, string> = {
  tool: '🔧', article: '📄', video: '🎬', course: '🎓', github: '⭐', community: '👥',
};

const POST_TYPE_CONFIG: Record<PostType, { emoji: string; label: string; color: string; bg: string }> = {
  article: { emoji: '📝', label: '文章',    color: '#3B82F6', bg: '#EFF6FF' },
  video:   { emoji: '🎬', label: '影片',    color: '#EF4444', bg: '#FEF2F2' },
  tip:     { emoji: '💡', label: '快速技巧', color: '#F59E0B', bg: '#FFFBEB' },
  news:    { emoji: '📰', label: '最新資訊', color: '#8B5CF6', bg: '#F5F3FF' },
};

/* ─────────────────────────────────────────────
   Reveal wrapper
───────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Resource Card
───────────────────────────────────────────── */
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const levelKey = resource.level as Exclude<LevelKey, 'all'>;
  const levelCfg = LEVEL_CONFIG[levelKey] ?? LEVEL_CONFIG.bronze;

  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {resource.featured && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#FEF3C7', color: '#92400E',
            borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
          }}>
            精選
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>{TYPE_ICON[resource.type]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 4, lineHeight: 1.3 }}>
              {resource.title}
            </h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>
              {resource.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {resource.tags.map(tag => (
            <span key={tag} style={{
              padding: '2px 8px', borderRadius: 6, fontSize: 11,
              background: '#F3F4F6', color: '#6B7280',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: resource.free ? '#DCFCE7' : '#FEE2E2',
              color: resource.free ? '#166534' : '#991B1B',
            }}>
              {resource.free ? '免費' : '付費'}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: levelCfg.bg, color: levelCfg.color,
            }}>
              {levelCfg.emoji} {levelCfg.label}
            </span>
            {resource.stars && (
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                ⭐ {resource.stars}
              </span>
            )}
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: '#111', color: '#fff', textDecoration: 'none',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111'; }}
          >
            訪問 →
          </a>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────
   Post Card (articles section)
───────────────────────────────────────────── */
function PostCard({ post, index }: { post: Post; index: number }) {
  const tc = POST_TYPE_CONFIG[post.type];
  const hasArticlePage = !post.auto || post.hasArticle;
  const linkHref = hasArticlePage ? `/friends/${post.id}` : post.sourceUrl;
  const isExternal = !hasArticlePage && !!post.sourceUrl;

  const cardInner = (
    <article
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
          borderRadius: 20, fontSize: 13, fontWeight: 600, background: tc.bg, color: tc.color,
        }}>
          {tc.emoji} {tc.label}
        </span>
        {post.auto && <span style={{ fontSize: 10, color: '#bbb' }}>🤖 自動更新</span>}
      </div>
      <div style={{ padding: '12px 20px 20px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: '#111' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 12, background: '#F3F4F6', color: '#6B7280' }}>
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

  return (
    <Reveal delay={index * 0.08}>
      {linkHref ? (
        isExternal ? (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            {cardInner}
          </a>
        ) : (
          <Link href={linkHref} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            {cardInner}
          </Link>
        )
      ) : cardInner}
    </Reveal>
  );
}

/* ─────────────────────────────────────────────
   Tab button
───────────────────────────────────────────── */
function TabButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: 20, border: 'none', fontSize: 14,
        fontWeight: active ? 700 : 500, cursor: 'pointer',
        background: active ? '#111' : '#fff',
        color: active ? '#fff' : '#555',
        boxShadow: active ? '0 2px 8px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.07)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function FriendsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('featured');
  const [levelTab, setLevelTab] = useState<Exclude<LevelKey, 'all'>>('bronze');
  const [usecaseTab, setUsecaseTab] = useState<Exclude<UseCaseKey, 'general'>>('marketing');
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<Post[]>(curatedPosts);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.posts) {
          const seen = new Set<string>();
          const merged: Post[] = [];
          for (const p of [...curatedPosts, ...data.posts]) {
            if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
          }
          merged.sort((a, b) => b.date.localeCompare(a.date));
          setAllPosts(merged);
          setLastUpdated(data.lastUpdated || '');
        }
      })
      .catch(() => {});
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return RESOURCES;
    return RESOURCES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const featuredResources = filteredResources.filter(r => r.featured);
  const levelResources = filteredResources.filter(r => r.level === levelTab);
  const usecaseResources = filteredResources.filter(r => r.useCase.includes(usecaseTab));

  const resourcesForDisplay =
    viewMode === 'featured' ? featuredResources :
    viewMode === 'level'    ? levelResources :
    usecaseResources;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>

      {/* ── Sticky Header ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px', background: '#fff', borderBottom: '1px solid #eee',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size="sm" showText={false} />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>SkillAI.hk</span>
        </Link>
        <nav style={{ display: 'flex', gap: 20, fontSize: 14, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>資源</Link>
          <Link href="/courses" style={{ color: '#666', textDecoration: 'none' }}>課程</Link>
          <Link href="/friends" style={{
            background: '#4169E1', color: '#fff', padding: '6px 16px',
            borderRadius: 12, fontWeight: 600, textDecoration: 'none',
            fontSize: 13,
          }}>
            免費資源
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{
        padding: '64px 24px 48px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #FAFAFA 100%)',
      }}>
        <Reveal>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, color: '#111', marginBottom: 16, letterSpacing: '-0.5px' }}>
            🤖 AI 資源庫
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', color: '#555', maxWidth: 580, margin: '0 auto 24px', lineHeight: 1.7 }}>
            100+ 個精選開源 AI 工具同開發者資源，按技術領域同使用場景整理。
            <br />找到最適合你嘅工具，立即開始。
          </p>
        </Reveal>

        {/* Search */}
        <Reveal delay={0.15}>
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="搜尋工具、關鍵字或標籤…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 48px', borderRadius: 16,
                border: '2px solid #E5E7EB', fontSize: 15, outline: 'none',
                background: '#fff', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#111'; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
            />
          </div>
        </Reveal>

        {lastUpdated && (
          <p style={{ fontSize: 12, color: '#bbb', marginTop: 12 }}>
            🔄 上次更新: {lastUpdated.substring(0, 16).replace('T', ' ')}
          </p>
        )}
      </section>

      {/* ── Stats strip ── */}
      <Reveal delay={0.2}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 40, padding: '0 24px 32px',
          flexWrap: 'wrap',
        }}>
          {[
            { num: `${RESOURCES.length}+`, label: '精選資源' },
            { num: '5', label: '課程等級' },
            { num: '6', label: '使用場景' },
            { num: `${RESOURCES.filter(r => r.free).length}+`, label: '免費工具' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── View Mode Toggle ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8,
        padding: '0 24px 24px', flexWrap: 'wrap',
      }}>
        <TabButton active={viewMode === 'featured'} onClick={() => setViewMode('featured')}>
          ⭐ 精選推薦
        </TabButton>
        <TabButton active={viewMode === 'level'} onClick={() => setViewMode('level')}>
          📚 按課程等級
        </TabButton>
        <TabButton active={viewMode === 'usecase'} onClick={() => setViewMode('usecase')}>
          🎯 按使用場景
        </TabButton>
      </div>

      {/* ── Level Sub-tabs ── */}
      <AnimatePresence>
        {viewMode === 'level' && (
          <motion.div
            key="level-tabs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 8,
              padding: '0 24px 24px', flexWrap: 'wrap',
            }}>
              {(Object.entries(LEVEL_CONFIG) as [Exclude<LevelKey, 'all'>, typeof LEVEL_CONFIG[keyof typeof LEVEL_CONFIG]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setLevelTab(key)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: 'none', fontSize: 13,
                    fontWeight: levelTab === key ? 700 : 500, cursor: 'pointer',
                    background: levelTab === key ? cfg.bg : '#fff',
                    color: levelTab === key ? cfg.color : '#666',
                    boxShadow: levelTab === key
                      ? `0 0 0 2px ${cfg.color}44`
                      : '0 1px 3px rgba(0,0,0,0.07)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cfg.emoji} {cfg.label}
                  <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
                    ({RESOURCES.filter(r => r.level === key).length})
                  </span>
                </button>
              ))}
            </div>
            {/* Level description */}
            <div style={{ textAlign: 'center', padding: '0 24px 20px' }}>
              <span style={{
                display: 'inline-block', padding: '6px 20px', borderRadius: 20,
                background: LEVEL_CONFIG[levelTab].bg, color: LEVEL_CONFIG[levelTab].color,
                fontSize: 14, fontWeight: 500,
              }}>
                {LEVEL_CONFIG[levelTab].desc}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Use Case Sub-tabs ── */}
      <AnimatePresence>
        {viewMode === 'usecase' && (
          <motion.div
            key="usecase-tabs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 8,
              padding: '0 24px 24px', flexWrap: 'wrap',
            }}>
              {(Object.entries(USE_CASE_CONFIG) as [Exclude<UseCaseKey, 'general'>, typeof USE_CASE_CONFIG[keyof typeof USE_CASE_CONFIG]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setUsecaseTab(key)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: 'none', fontSize: 13,
                    fontWeight: usecaseTab === key ? 700 : 500, cursor: 'pointer',
                    background: usecaseTab === key ? '#111' : '#fff',
                    color: usecaseTab === key ? '#fff' : '#555',
                    boxShadow: usecaseTab === key ? '0 2px 8px rgba(0,0,0,0.18)' : '0 1px 3px rgba(0,0,0,0.07)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cfg.emoji} {cfg.label}
                  <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
                    ({RESOURCES.filter(r => r.useCase.includes(key)).length})
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Resource Grid ── */}
      <main id="main-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        {searchQuery && (
          <p style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 14 }}>
            搜尋「{searchQuery}」— 找到 {filteredResources.length} 個結果
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${levelTab}-${usecaseTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {resourcesForDisplay.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} index={i} />
            ))}
            {resourcesForDisplay.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#aaa' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 16 }}>
                  {searchQuery ? `冇搵到「${searchQuery}」嘅資源` : '呢個分類暫時冇資源'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Latest Articles ── */}
      <section style={{ background: '#fff', padding: '60px 24px 80px', borderTop: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#111', marginBottom: 10 }}>
                📰 最新文章
              </h2>
              <p style={{ fontSize: 15, color: '#888' }}>
                最新 AI 資訊、實用教學、工具評測 — 幫你跟上 AI 時代
              </p>
            </div>
          </Reveal>

          <PostGrid posts={allPosts} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: 'center', padding: '56px 24px', background: '#111', color: '#fff' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
          想有系統咁學 AI？
        </h2>
        <p style={{ color: '#999', marginBottom: 28, fontSize: 16 }}>
          我哋嘅課程從零基礎到 AI 架構師，有系統咁幫你掌握 AI 技能。
        </p>
        <Link href="/courses" style={{
          display: 'inline-block', padding: '14px 36px', borderRadius: 12,
          background: '#fff', color: '#111', fontWeight: 700, fontSize: 16,
          textDecoration: 'none', transition: 'transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
        >
          睇課程 →
        </Link>
      </section>

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

/* ─────────────────────────────────────────────
   Post Grid (stateful sub-component to keep
   filter logic clean without polluting window)
───────────────────────────────────────────── */
function PostGrid({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {(['all', 'article', 'video', 'tip', 'news'] as const).map(t => {
          const isActive = filter === t;
          const label = t === 'all' ? '全部' : POST_TYPE_CONFIG[t].label;
          const emoji = t === 'all' ? '🔥' : POST_TYPE_CONFIG[t].emoji;
          const count = t === 'all' ? posts.length : posts.filter(p => p.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '7px 16px', borderRadius: 20, border: 'none',
                fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                background: isActive ? '#111' : '#F3F4F6',
                color: isActive ? '#fff' : '#555',
                transition: 'all 0.2s',
              }}
            >
              {emoji} {label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {filtered.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#aaa' }}>
            暫時冇呢個類別嘅內容
          </div>
        )}
      </div>
    </>
  );
}
