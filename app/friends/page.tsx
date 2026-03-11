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
  /* ── BRONZE ── */
  {
    id: 'chatgpt', title: 'ChatGPT', description: '最流行嘅 AI 聊天助手，免費版夠日常使用，Plus 版解鎖 GPT-4o 同插件。',
    url: 'https://chat.openai.com', type: 'tool', level: 'bronze', useCase: ['general', 'business', 'education'],
    tags: ['OpenAI', '聊天', '入門'], free: true, featured: true,
  },
  {
    id: 'claude', title: 'Claude', description: 'Anthropic 出品，長文本處理最強，200K token 上下文，適合分析長文件。',
    url: 'https://claude.ai', type: 'tool', level: 'bronze', useCase: ['general', 'developer', 'business'],
    tags: ['Anthropic', '長文本', '分析'], free: true, featured: true,
  },
  {
    id: 'gemini', title: 'Gemini', description: 'Google 嘅 AI，同 Google 生態完美整合，免費用 Gemini 1.5 Pro。',
    url: 'https://gemini.google.com', type: 'tool', level: 'bronze', useCase: ['general', 'education'],
    tags: ['Google', '多模態', '免費'], free: true, featured: true,
  },
  {
    id: 'perplexity', title: 'Perplexity AI', description: 'AI 搜尋引擎，即時引用來源，唔會亂生成假資料，研究必備。',
    url: 'https://perplexity.ai', type: 'tool', level: 'bronze', useCase: ['general', 'education', 'business'],
    tags: ['搜尋', '引用', '研究'], free: true, featured: true,
  },
  {
    id: 'copilot', title: 'Microsoft Copilot', description: '免費用 GPT-4，深度整合 Office 365，係 Windows 用家嘅最佳選擇。',
    url: 'https://copilot.microsoft.com', type: 'tool', level: 'bronze', useCase: ['business', 'general'],
    tags: ['Microsoft', 'Office', 'GPT-4'], free: true,
  },
  {
    id: 'notion-ai', title: 'Notion AI', description: '筆記 + AI 一體，整理資訊最方便，支援自動摘要、翻譯、改寫。',
    url: 'https://notion.so', type: 'tool', level: 'bronze', useCase: ['business', 'education', 'general'],
    tags: ['筆記', '生產力', 'AI 寫作'], free: false,
  },
  {
    id: 'canva-ai', title: 'Canva AI', description: '零基礎設計出專業圖片，Magic Studio 一鍵生成圖像、背景、文字。',
    url: 'https://canva.com', type: 'tool', level: 'bronze', useCase: ['marketing', 'creative', 'business'],
    tags: ['設計', '圖片生成', '免費'], free: true,
  },
  {
    id: 'removebg', title: 'Remove.bg', description: '一鍵去除圖片背景，秒速完成，免費每月 50 張，設計師必備小工具。',
    url: 'https://remove.bg', type: 'tool', level: 'bronze', useCase: ['marketing', 'creative'],
    tags: ['圖片處理', '去背', '設計'], free: true,
  },
  {
    id: 'otter', title: 'Otter.ai', description: '自動轉錄會議錄音，即時生成會議記錄，支援粵語同普通話。',
    url: 'https://otter.ai', type: 'tool', level: 'bronze', useCase: ['business', 'education'],
    tags: ['會議記錄', '語音轉文字', '轉錄'], free: true,
  },
  {
    id: 'deepl', title: 'DeepL', description: '最準確嘅 AI 翻譯工具，比 Google Translate 更自然，支援 31 種語言。',
    url: 'https://deepl.com', type: 'tool', level: 'bronze', useCase: ['general', 'business', 'education'],
    tags: ['翻譯', '多語言', '準確'], free: true,
  },

  /* ── SILVER ── */
  {
    id: 'prompthero', title: 'PromptHero', description: '最大 Prompt 社群，搜尋最佳 Prompt，涵蓋 Midjourney、Stable Diffusion、ChatGPT。',
    url: 'https://prompthero.com', type: 'community', level: 'silver', useCase: ['creative', 'general'],
    tags: ['Prompt 社群', '圖像', '分享'], free: true,
  },
  {
    id: 'flowgpt', title: 'FlowGPT', description: 'Prompt 分享平台，有評分系統，可以按場景搜尋最受歡迎嘅 Prompt。',
    url: 'https://flowgpt.com', type: 'community', level: 'silver', useCase: ['general', 'business'],
    tags: ['Prompt 分享', '評分', '社群'], free: true,
  },
  {
    id: 'promptbase', title: 'PromptBase', description: '買賣優質 Prompt 嘅市場，由專業 Prompt 工程師設計，節省開發時間。',
    url: 'https://promptbase.com', type: 'community', level: 'silver', useCase: ['general', 'business', 'creative'],
    tags: ['Prompt 市場', '買賣', '專業'], free: false,
  },
  {
    id: 'learn-prompting', title: 'Learn Prompting', description: '免費 Prompt Engineering 完整教學網站，從入門到進階，附大量實例。',
    url: 'https://learnprompting.org', type: 'course', level: 'silver', useCase: ['education', 'general'],
    tags: ['教學', '免費', 'Prompt'], free: true, featured: true,
  },
  {
    id: 'openai-playground', title: 'OpenAI Playground', description: '直接測試唔同 GPT 參數，調整 temperature、top_p，深度理解模型行為。',
    url: 'https://platform.openai.com/playground', type: 'tool', level: 'silver', useCase: ['developer', 'general'],
    tags: ['測試', '參數', 'GPT'], free: false,
  },
  {
    id: 'anthropic-prompt-library', title: 'Anthropic Prompt Library', description: 'Claude 官方 Prompt 庫，200+ 精心設計嘅 Prompt，可直接複製使用。',
    url: 'https://docs.anthropic.com/en/prompt-library', type: 'article', level: 'silver', useCase: ['general', 'developer'],
    tags: ['Claude', '官方', 'Prompt 庫'], free: true,
  },
  {
    id: 'fabric', title: 'Fabric', description: '200+ 開源 Prompt 模式，CLI 工具一行指令完成複雜 AI 任務，AI 瑞士軍刀。',
    url: 'https://github.com/danielmiessler/fabric', type: 'github', level: 'silver', useCase: ['developer', 'general'],
    tags: ['開源', 'CLI', 'Prompt 模式'], free: true, stars: '20K',
  },
  {
    id: 'awesome-prompts', title: 'Awesome ChatGPT Prompts', description: '最多人 Star 嘅 Prompt 合集，涵蓋角色扮演、學習、寫作等所有場景。',
    url: 'https://github.com/f/awesome-chatgpt-prompts', type: 'github', level: 'silver', useCase: ['general', 'education'],
    tags: ['開源', 'Prompt 合集', '角色扮演'], free: true, stars: '104K', featured: true,
  },
  {
    id: 'langchain-hub', title: 'LangChain Hub', description: '生產級 Prompt 管理平台，版本控制、A/B 測試、協作編輯一應俱全。',
    url: 'https://smith.langchain.com/hub', type: 'tool', level: 'silver', useCase: ['developer'],
    tags: ['Prompt 管理', '版本控制', 'LangChain'], free: true,
  },

  /* ── GOLD ── */
  {
    id: 'langchain', title: 'LangChain', description: '最成熟嘅 LLM 開發框架，連接模型、工具、記憶體，構建複雜 AI 應用首選。',
    url: 'https://langchain.com', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['框架', 'RAG', 'Agent'], free: true, featured: true,
  },
  {
    id: 'llamaindex', title: 'LlamaIndex', description: 'RAG 應用首選框架，輕鬆連接文件、數據庫、API，構建智能搜尋系統。',
    url: 'https://llamaindex.ai', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['RAG', '向量搜尋', '文件處理'], free: true,
  },
  {
    id: 'crewai', title: 'CrewAI', description: '多 Agent 協作框架，讓多個 AI 角色分工合作，自動完成研究報告、代碼開發。',
    url: 'https://crewai.com', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['多 Agent', '自動化', 'Python'], free: true, stars: '23K',
  },
  {
    id: 'autogen', title: 'AutoGen', description: 'Microsoft 出品多 Agent 框架，支援對話式多 Agent 協作，企業信任度高。',
    url: 'https://microsoft.github.io/autogen', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['Microsoft', '多 Agent', '企業'], free: true, stars: '38K',
  },
  {
    id: 'dify', title: 'Dify', description: '可視化 AI 應用開發平台，拖拉式構建 RAG、Chatbot、Agent，開源可自部署。',
    url: 'https://dify.ai', type: 'tool', level: 'gold', useCase: ['developer', 'business'],
    tags: ['可視化', '開源', 'No-Code'], free: true, featured: true,
  },
  {
    id: 'flowise', title: 'Flowise', description: '拖拉 Node 構建 LLM 流程，零代碼搭建 Agent、RAG 應用，5 分鐘上線。',
    url: 'https://flowiseai.com', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['No-Code', 'Node', '視覺化'], free: true, stars: '30K',
  },
  {
    id: 'ollama', title: 'Ollama', description: '本地跑 LLM，零配置，一個指令下載 Llama、Qwen、Mistral 等 100+ 模型。',
    url: 'https://ollama.ai', type: 'github', level: 'gold', useCase: ['developer', 'general'],
    tags: ['本地 LLM', '私隱', '離線'], free: true, stars: '120K', featured: true,
  },
  {
    id: 'litellm', title: 'LiteLLM', description: '統一 100+ LLM API，一行代碼切換 OpenAI、Claude、Gemini，支援 fallback。',
    url: 'https://github.com/BerriAI/litellm', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['API Gateway', '多模型', '統一'], free: true, stars: '18K',
  },
  {
    id: 'langfuse', title: 'Langfuse', description: 'LLM 可觀測性平台，追蹤 Prompt、成本、延遲，開源可自部署，生產必備。',
    url: 'https://langfuse.com', type: 'tool', level: 'gold', useCase: ['developer'],
    tags: ['監控', '可觀測性', '開源'], free: true,
  },
  {
    id: 'mem0', title: 'Mem0', description: '為 AI Agent 加入長期記憶，跨對話記住用戶偏好，告別每次重新介紹自己。',
    url: 'https://mem0.ai', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['記憶體', 'Agent', '持久化'], free: true, stars: '28K',
  },
  {
    id: 'browser-use', title: 'Browser Use', description: 'AI 控制瀏覽器自動化，自然語言描述任務，AI 自動點擊、填表、爬取數據。',
    url: 'https://github.com/browser-use/browser-use', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['瀏覽器自動化', 'Playwright', 'AI Agent'], free: true, stars: '21K',
  },
  {
    id: 'firecrawl', title: 'Firecrawl', description: 'LLM 友好嘅網頁爬蟲，一個 API 將任何網站轉成結構化 Markdown，支援 JS 渲染。',
    url: 'https://firecrawl.dev', type: 'github', level: 'gold', useCase: ['developer', 'business'],
    tags: ['爬蟲', '數據提取', 'Markdown'], free: true, stars: '28K',
  },

  /* ── PLATINUM ── */
  {
    id: 'azure-openai', title: 'Azure OpenAI', description: '企業級 GPT 部署，SOC2 合規，支援私有 VNet，適合有嚴格私隱要求嘅企業。',
    url: 'https://azure.microsoft.com/ai', type: 'tool', level: 'platinum', useCase: ['business', 'developer'],
    tags: ['企業', 'SOC2', 'Azure'], free: false,
  },
  {
    id: 'aws-bedrock', title: 'AWS Bedrock', description: 'AWS 多模型 API，一站式存取 Claude、Llama、Titan，企業 AI 首選雲端平台。',
    url: 'https://aws.amazon.com/bedrock', type: 'tool', level: 'platinum', useCase: ['business', 'developer'],
    tags: ['AWS', '多模型', '企業'], free: false,
  },
  {
    id: 'vertex-ai', title: 'Google Vertex AI', description: 'Google 企業 AI 平台，Gemini + PaLM + 第三方模型，MLOps 全生命周期管理。',
    url: 'https://cloud.google.com/vertex-ai', type: 'tool', level: 'platinum', useCase: ['business', 'developer'],
    tags: ['Google Cloud', 'MLOps', '企業'], free: false,
  },
  {
    id: 'huggingface-enterprise', title: 'Hugging Face Enterprise', description: '私有模型部署，SOC2 認證，Inference Endpoints 一鍵部署任何開源模型。',
    url: 'https://huggingface.co', type: 'tool', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['開源模型', '私有部署', 'SOC2'], free: false,
  },
  {
    id: 'wandb', title: 'Weights & Biases', description: 'ML 實驗追蹤業界標準，記錄訓練指標、模型版本、數據集，團隊協作必備。',
    url: 'https://wandb.ai', type: 'tool', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['ML 實驗', '追蹤', '協作'], free: false,
  },
  {
    id: 'pinecone', title: 'Pinecone', description: '企業級向量數據庫，全托管，支援十億級向量，低延遲相似度搜尋，易於擴展。',
    url: 'https://pinecone.io', type: 'tool', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['向量數據庫', '企業', 'RAG'], free: false,
  },
  {
    id: 'weaviate', title: 'Weaviate', description: '開源向量數據庫，支援多模態搜尋（文字、圖片、音頻），GraphQL API。',
    url: 'https://weaviate.io', type: 'tool', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['向量數據庫', '多模態', '開源'], free: true,
  },
  {
    id: 'qdrant', title: 'Qdrant', description: '高性能向量搜尋引擎，Rust 編寫，延遲極低，支援過濾搜尋，開源可自部署。',
    url: 'https://qdrant.tech', type: 'tool', level: 'platinum', useCase: ['developer'],
    tags: ['向量搜尋', 'Rust', '高性能'], free: true,
  },
  {
    id: 'supabase', title: 'Supabase', description: '開源 Firebase 替代，內建 pgvector，一站式數據庫 + Auth + Storage + AI。',
    url: 'https://supabase.com', type: 'tool', level: 'platinum', useCase: ['developer', 'business'],
    tags: ['PostgreSQL', 'pgvector', '開源'], free: true,
  },
  {
    id: 'pgvector', title: 'pgvector', description: 'PostgreSQL 向量擴展，唔需要獨立向量數據庫，直接喺 Postgres 做向量搜尋。',
    url: 'https://github.com/pgvector/pgvector', type: 'github', level: 'platinum', useCase: ['developer'],
    tags: ['PostgreSQL', '向量', '開源'], free: true, stars: '14K',
  },

  /* ── OPENCLAW ── */
  {
    id: 'anthropic-docs', title: 'Anthropic API Docs', description: 'Claude 官方 API 文件，Claude 3.5 Sonnet、Haiku、Opus 使用指南，Tool Use 詳解。',
    url: 'https://docs.anthropic.com', type: 'article', level: 'openclaw', useCase: ['developer'],
    tags: ['Claude', 'API', '官方文件'], free: true,
  },
  {
    id: 'openai-docs', title: 'OpenAI API Docs', description: 'GPT-4o、Assistants API、Fine-tuning、Embeddings 完整開發者文件。',
    url: 'https://platform.openai.com/docs', type: 'article', level: 'openclaw', useCase: ['developer'],
    tags: ['GPT', 'API', '官方文件'], free: true,
  },
  {
    id: 'huggingface', title: 'Hugging Face', description: '最大開源模型平台，100K+ 模型、Dataset、Space，AI 界嘅 GitHub。',
    url: 'https://huggingface.co', type: 'community', level: 'openclaw', useCase: ['developer'],
    tags: ['開源模型', '數據集', 'Transformer'], free: true, featured: true,
  },
  {
    id: 'papers-with-code', title: 'Papers With Code', description: 'AI 最新論文 + 代碼，SOTA 排行榜，了解最前沿技術嘅最佳入口。',
    url: 'https://paperswithcode.com', type: 'article', level: 'openclaw', useCase: ['developer', 'education'],
    tags: ['論文', '代碼', 'SOTA'], free: true,
  },
  {
    id: 'arxiv-ai', title: 'Arxiv AI', description: 'AI 最新學術論文預印本，cs.AI、cs.LG、cs.CL 分類，每日更新。',
    url: 'https://arxiv.org/list/cs.AI/recent', type: 'article', level: 'openclaw', useCase: ['developer', 'education'],
    tags: ['學術論文', '研究', '預印本'], free: true,
  },
  {
    id: 'mlflow', title: 'MLflow', description: 'ML 生命周期管理平台，實驗追蹤、模型打包、部署，支援所有主流框架。',
    url: 'https://mlflow.org', type: 'tool', level: 'openclaw', useCase: ['developer'],
    tags: ['MLOps', '實驗管理', '開源'], free: true,
  },
  {
    id: 'ray', title: 'Ray', description: '分佈式 AI 訓練框架，輕鬆擴展到多機多卡，支援 LLM Fine-tuning、強化學習。',
    url: 'https://ray.io', type: 'tool', level: 'openclaw', useCase: ['developer'],
    tags: ['分佈式', '訓練', '擴展'], free: true,
  },
  {
    id: 'vllm', title: 'vLLM', description: '高效 LLM 推理框架，PagedAttention 技術，吞吐量比 HuggingFace 高 24 倍。',
    url: 'https://github.com/vllm-project/vllm', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['推理優化', '高性能', '開源'], free: true, stars: '40K',
  },
  {
    id: 'triton', title: 'Triton Inference Server', description: 'NVIDIA 推理服務器，支援 GPU 加速，多模型部署，生產環境 LLM 服務首選。',
    url: 'https://github.com/triton-inference-server', type: 'github', level: 'openclaw', useCase: ['developer'],
    tags: ['NVIDIA', '推理', '生產'], free: true,
  },
  {
    id: 'modal', title: 'Modal', description: 'AI 模型雲端部署，按用量收費，零運維，Cold Start 極快，適合 Serverless AI。',
    url: 'https://modal.com', type: 'tool', level: 'openclaw', useCase: ['developer'],
    tags: ['Serverless', '雲端', '部署'], free: false,
  },

  /* ── MARKETING use case ── */
  {
    id: 'jasper', title: 'Jasper', description: 'AI 行銷文案平台，品牌語調一致，支援 Blog、廣告、社交媒體，行銷團隊首選。',
    url: 'https://jasper.ai', type: 'tool', level: 'silver', useCase: ['marketing'],
    tags: ['文案', '行銷', 'SEO'], free: false,
  },
  {
    id: 'copy-ai', title: 'Copy.ai', description: 'AI 文案生成工具，90+ 模板覆蓋所有行銷場景，免費版每月 2000 字。',
    url: 'https://copy.ai', type: 'tool', level: 'silver', useCase: ['marketing', 'business'],
    tags: ['文案', '模板', '行銷'], free: true,
  },
  {
    id: 'midjourney', title: 'Midjourney', description: '最頂級嘅 AI 圖像生成工具，藝術質感最高，設計師、行銷人員必備。',
    url: 'https://midjourney.com', type: 'tool', level: 'silver', useCase: ['marketing', 'creative'],
    tags: ['圖像生成', '藝術', '設計'], free: false, featured: true,
  },
  {
    id: 'dalle', title: 'DALL-E 3', description: 'OpenAI 嘅圖像生成，整合喺 ChatGPT Plus，文字理解能力最強，指令最準確。',
    url: 'https://openai.com/dall-e-3', type: 'tool', level: 'silver', useCase: ['marketing', 'creative'],
    tags: ['圖像生成', 'OpenAI', 'ChatGPT'], free: false,
  },
  {
    id: 'elevenlabs', title: 'ElevenLabs', description: '最自然嘅 AI 語音合成，Clone 任何聲音，支援 30+ 語言，廣告配音必備。',
    url: 'https://elevenlabs.io', type: 'tool', level: 'silver', useCase: ['marketing', 'creative'],
    tags: ['語音合成', '配音', '克隆聲音'], free: true,
  },
  {
    id: 'heygen', title: 'HeyGen', description: 'AI 數字人視頻，上傳一張照片就生成說話視頻，多語言配音，行銷爆款工具。',
    url: 'https://heygen.com', type: 'tool', level: 'silver', useCase: ['marketing', 'creative', 'business'],
    tags: ['數字人', '視頻', '多語言'], free: false,
  },
  {
    id: 'synthesia', title: 'Synthesia', description: '企業級 AI 視頻製作，160+ AI 演員，支援 120+ 語言，培訓視頻首選。',
    url: 'https://synthesia.io', type: 'tool', level: 'silver', useCase: ['marketing', 'business', 'education'],
    tags: ['AI 視頻', '企業', '培訓'], free: false,
  },
  {
    id: 'runway', title: 'Runway', description: 'AI 視頻生成工具，Gen-3 Alpha 支援文字轉視頻、圖片轉視頻，電影級效果。',
    url: 'https://runwayml.com', type: 'tool', level: 'silver', useCase: ['marketing', 'creative'],
    tags: ['視頻生成', 'AI 電影', '創意'], free: false,
  },

  /* ── DEVELOPER use case ── */
  {
    id: 'github-copilot', title: 'GitHub Copilot', description: 'AI 代碼補全業界標準，支援 100+ 語言，Chat 功能解釋代碼、修復 Bug。',
    url: 'https://github.com/features/copilot', type: 'tool', level: 'silver', useCase: ['developer'],
    tags: ['代碼補全', 'GitHub', 'IDE'], free: false, featured: true,
  },
  {
    id: 'cursor', title: 'Cursor', description: 'AI 原生 IDE，Composer 一次修改多個文件，Codebase 對話，開發者新寵。',
    url: 'https://cursor.sh', type: 'tool', level: 'silver', useCase: ['developer'],
    tags: ['AI IDE', 'Composer', 'Claude'], free: false, featured: true,
  },
  {
    id: 'continue-dev', title: 'Continue.dev', description: '開源 AI 代碼助手，VS Code 插件，支援本地模型，保護代碼私隱。',
    url: 'https://continue.dev', type: 'github', level: 'silver', useCase: ['developer'],
    tags: ['開源', 'VS Code', '本地模型'], free: true, stars: '20K',
  },
  {
    id: 'codeium', title: 'Codeium', description: '完全免費嘅 AI 代碼補全，支援 70+ 語言，70+ IDE，速度快，無限制。',
    url: 'https://codeium.com', type: 'tool', level: 'silver', useCase: ['developer'],
    tags: ['免費', '代碼補全', '多語言'], free: true,
  },
  {
    id: 'aider', title: 'Aider', description: 'Terminal 裡嘅 AI Pair Programmer，支援 Claude、GPT-4o，Git 原生整合。',
    url: 'https://aider.chat', type: 'github', level: 'gold', useCase: ['developer'],
    tags: ['CLI', 'Pair Programmer', 'Git'], free: true, stars: '31K',
  },
  {
    id: 'cody', title: 'Sourcegraph Cody', description: 'AI 代碼助手，理解整個 Codebase，支援大型企業項目，比 Copilot 更懂上下文。',
    url: 'https://sourcegraph.com/cody', type: 'tool', level: 'silver', useCase: ['developer', 'business'],
    tags: ['企業', 'Codebase', '代碼理解'], free: true,
  },

  /* ── BUSINESS use case ── */
  {
    id: 'monday-ai', title: 'Monday.com AI', description: '項目管理 + AI，自動生成任務、摘要會議、預測風險，團隊協作更高效。',
    url: 'https://monday.com', type: 'tool', level: 'silver', useCase: ['business'],
    tags: ['項目管理', '自動化', '協作'], free: false,
  },
  {
    id: 'salesforce-einstein', title: 'Salesforce Einstein', description: 'CRM 內建 AI，預測客戶行為、自動生成郵件、銷售預測，企業 CRM 首選。',
    url: 'https://salesforce.com/einstein', type: 'tool', level: 'platinum', useCase: ['business', 'finance'],
    tags: ['CRM', '銷售', '預測'], free: false,
  },
  {
    id: 'hubspot-ai', title: 'HubSpot AI', description: 'AI 行銷 + 銷售 + 客服平台，Content Assistant 自動生成 Blog、郵件、廣告。',
    url: 'https://hubspot.com', type: 'tool', level: 'silver', useCase: ['business', 'marketing'],
    tags: ['行銷自動化', 'CRM', 'Content'], free: true,
  },
  {
    id: 'zapier-ai', title: 'Zapier AI', description: 'AI 自動化工作流，連接 7000+ 應用，自然語言描述就能創建複雜自動化。',
    url: 'https://zapier.com', type: 'tool', level: 'silver', useCase: ['business', 'general'],
    tags: ['自動化', '工作流', '整合'], free: true,
  },

  /* ── CREATIVE use case ── */
  {
    id: 'adobe-firefly', title: 'Adobe Firefly', description: 'Adobe 官方 AI，訓練數據全部版權合規，商業使用放心，整合 Photoshop。',
    url: 'https://adobe.com/firefly', type: 'tool', level: 'silver', useCase: ['creative', 'marketing'],
    tags: ['Adobe', '版權合規', '商業'], free: false,
  },
  {
    id: 'stable-diffusion', title: 'Stable Diffusion', description: '完全開源嘅圖像生成模型，本地運行、無限生成、無審查，創作自由度最高。',
    url: 'https://stability.ai', type: 'github', level: 'gold', useCase: ['creative', 'developer'],
    tags: ['開源', '本地運行', '無限制'], free: true, stars: '38K',
  },
  {
    id: 'suno', title: 'Suno', description: 'AI 音樂生成，輸入歌詞就生成完整歌曲，涵蓋所有曲風，創作門檻歸零。',
    url: 'https://suno.com', type: 'tool', level: 'bronze', useCase: ['creative'],
    tags: ['音樂生成', '歌曲', '創作'], free: true, featured: true,
  },
  {
    id: 'kling', title: 'Kling', description: '快手出品 AI 視頻生成，中國最強視頻 AI，5 秒視頻生成，動作流暢自然。',
    url: 'https://kling.kuaishou.com', type: 'tool', level: 'silver', useCase: ['creative', 'marketing'],
    tags: ['視頻生成', '國產', '快手'], free: true,
  },
  {
    id: 'pika', title: 'Pika', description: 'AI 視頻生成工具，Text to Video 同 Image to Video，特效豐富，易上手。',
    url: 'https://pika.art', type: 'tool', level: 'silver', useCase: ['creative', 'marketing'],
    tags: ['視頻生成', 'Text to Video', '特效'], free: true,
  },
  {
    id: 'leonardo', title: 'Leonardo AI', description: 'AI 圖像生成平台，遊戲資產、角色設計、建築效果圖，專業創作者首選。',
    url: 'https://leonardo.ai', type: 'tool', level: 'silver', useCase: ['creative', 'marketing'],
    tags: ['圖像生成', '遊戲', '角色設計'], free: true,
  },

  /* ── EDUCATION use case ── */
  {
    id: 'khanmigo', title: 'Khan Academy Khanmigo', description: 'AI 學習助手，蘇格拉底式引導，唔直接給答案，幫助學生真正理解。',
    url: 'https://khanacademy.org/khan-labs', type: 'tool', level: 'bronze', useCase: ['education'],
    tags: ['K-12', '蘇格拉底', '免費'], free: true,
  },
  {
    id: 'duolingo-max', title: 'Duolingo Max', description: 'AI 語言學習，Roleplay 功能同真實場景練習，Explain My Answer 即時解釋。',
    url: 'https://duolingo.com', type: 'tool', level: 'bronze', useCase: ['education', 'general'],
    tags: ['語言學習', '互動', 'GPT-4'], free: false,
  },
  {
    id: 'coursera-ai', title: 'Coursera AI', description: 'AI 個人化學習路徑，根據你嘅目標推薦課程，支援 AI 同 ML 專業認證。',
    url: 'https://coursera.org', type: 'course', level: 'bronze', useCase: ['education'],
    tags: ['認證', '課程', '個人化'], free: false,
  },
  {
    id: 'socratic', title: 'Socratic by Google', description: 'Google 出品免費學習 App，拍照即解題，涵蓋數學、科學、歷史，學生神器。',
    url: 'https://socratic.org', type: 'tool', level: 'bronze', useCase: ['education'],
    tags: ['Google', '免費', '解題'], free: true,
  },

  /* ── FINANCE use case ── */
  {
    id: 'bloomberg-gpt', title: 'Bloomberg GPT', description: 'Bloomberg 訓練嘅金融專用 LLM，理解金融術語、新聞分析、市場情緒。',
    url: 'https://bloomberg.com/company/press/bloomberggpt-50-billion-parameter-llm-taylor-language-models-finance/', type: 'article', level: 'platinum', useCase: ['finance', 'business'],
    tags: ['金融 AI', '彭博', '市場分析'], free: false,
  },
  {
    id: 'kensho', title: 'Kensho (S&P Global)', description: 'S&P Global 旗下 AI 金融分析平台，智能財報分析、宏觀經濟預測。',
    url: 'https://kensho.com', type: 'tool', level: 'platinum', useCase: ['finance', 'business'],
    tags: ['財報分析', 'S&P', '機構'], free: false,
  },
  {
    id: 'alphasense', title: 'AlphaSense', description: '企業級 AI 市場情報平台，分析財報、新聞、研究報告，投資決策利器。',
    url: 'https://alpha-sense.com', type: 'tool', level: 'platinum', useCase: ['finance', 'business'],
    tags: ['市場情報', '投資', '財報'], free: false,
  },
];

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */
const LEVEL_CONFIG: Record<Exclude<LevelKey, 'all'>, { label: string; color: string; bg: string; emoji: string; desc: string }> = {
  bronze:   { label: 'Bronze',   color: '#92400E', bg: '#FEF3C7', emoji: '🥉', desc: 'AI 入門 — 零基礎即用工具' },
  silver:   { label: 'Silver',   color: '#374151', bg: '#F3F4F6', emoji: '🥈', desc: 'Prompt Engineering — 進階溝通技巧' },
  gold:     { label: 'Gold',     color: '#92400E', bg: '#FFFBEB', emoji: '🥇', desc: 'AI Agent 開發 — 構建智能應用' },
  platinum: { label: 'Platinum', color: '#5B21B6', bg: '#EDE9FE', emoji: '💎', desc: '企業 AI — 生產級部署方案' },
  openclaw: { label: 'OpenClaw', color: '#1E3A8A', bg: '#DBEAFE', emoji: '🦞', desc: 'AI 架構師 — 前沿技術同底層原理' },
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
        <nav style={{ display: 'flex', gap: 20, fontSize: 14 }}>
          <Link href="/courses" style={{ color: '#666', textDecoration: 'none' }}>課程</Link>
          <Link href="/friends" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>AI 資源</Link>
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
            80+ 個精選 AI 工具同資源，按課程等級同使用場景整理。
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
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
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

      <footer style={{ textAlign: 'center', padding: '24px', fontSize: 13, color: '#999', background: '#111', borderTop: '1px solid #222' }}>
        <span style={{ color: '#555' }}>© 2026 SkillAI.hk · DeFiner Tech Ltd</span>
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
