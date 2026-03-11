'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import coursesData from '@/data/courses-full.json';
import type { Course, Module, Lesson, Slide } from '../components/types';
import { LEVEL_COLORS } from '../components/types';

const courses = coursesData.courses as unknown as Course[];

type ViewMode = 'reader' | 'thumbnails';

const AI_SUMMARIES: Record<string, string> = {
  // ── BRONZE ──
  'les-1-1-b': 'AI 三大類別（ANI 窄AI / AGI 通用AI / ASI 超級AI）同機器學習、深度學習嘅基本概念。核心結論：所有現有工具均為 ANI，LLM 係透過統計模式識別語言，並非真正「理解」內容。',
  'les-1-2-b': '手把手教你用 ChatGPT 完成真實工作任務：寫 email、整報告、做研究。重點：善用角色扮演、提供上下文、分步拆解問題，輸出質量可提升 3–5 倍。附 10 個即用 prompt 模板。',
  'les-1-3-b': '實戰作業：用 ChatGPT 建立個人 AI 助手。完成步驟包括設定 system prompt、設計對話流程、測試同優化。提交展示你嘅 AI 助手對話截圖，並說明它解決咗你哪個痛點。',
  'les-2-1-b': '深度對比三大主流 AI 平台：ChatGPT 適合創意寫作、Claude 勝在長文件分析、Gemini 最適合 Google 生態用戶。香港職場建議：日常工作用 ChatGPT，分析長文件用 Claude，配合 Google Workspace 用 Gemini。',
  'les-2-2-b': '三大生產力工具 AI 功能實測：Notion AI 自動整理筆記、Canva AI 一鍵生成設計圖、Microsoft Copilot 融入 Office 365。職場人士必學組合，無需額外學習成本即可顯著提升工作效率。',
  'les-2-3-b': 'Bronze 畢業項目：記錄你嘅日常工作流程，識別三個可以用 AI 改善嘅環節，實際應用後提交前後對比報告。評審重點：工具選擇是否合適、效率提升是否量化、能否持續執行。',
  // ── SILVER ──
  'les-1-1-s': '系統性 Prompt Engineering 框架：Role（角色）、Task（任務）、Format（格式）、Constraint（限制）四要素。進階技巧包括 Chain of Thought 逐步推理、Few-Shot 示例引導，每種技巧均附實際業務場景。',
  'les-1-2-s': 'ReAct = Reasoning + Acting。設計 prompt 讓 AI 先推理後行動，結合工具使用（Tool Use）。核心應用：AI 搜尋工具、計算器、數據庫查詢，實現多步驟自動化任務。',
  'les-1-3-s': 'Silver M1 認證作業：為你嘅公司或業務設計 Prompt Engineering 系統，需包含至少 5 個場景嘅優化 prompt、前後效果對比，以及一個 ReAct 框架應用案例。',
  'les-2-1-s': 'Make.com 完全教學：從零建立第一個自動化 Scenario。涵蓋 Webhook 觸發、HTTP 模塊調用 AI API、數據轉換、條件分支。實戰案例：自動將 Gmail 轉發至 Notion 並用 AI 生成摘要。',
  'les-2-2-s': 'n8n 相比 Make 更靈活、免費且可自托管，適合有基礎技術能力嘅用戶。涵蓋 Docker 安裝、Workflow 設計、AI 節點整合。核心優勢：數據留在自己服務器，符合香港企業合規要求。',
  'les-3-1-s': '為 AI 開發量身定制嘅 Python 入門：變量、列表、字典、函數、迴圈，重點放在 API 調用、JSON 處理、文件讀寫三大場景。配合 Claude 作為「即時老師」，邊學邊解決實際問題。',
  'les-3-2-s': '三大 AI API 技術對比：認證機制、調用格式、錯誤處理、計費模型。重點：OpenAI 生態最完善、Claude API 長文本最強、Gemini API 免費額度最大。附完整 Python 代碼範例，可即刻複製使用。',
  'les-3-3-s': 'Silver 畢業項目：用 Make.com 或 n8n + AI API 構建一個自動生成業務報告嘅系統，從數據收集→AI 分析→格式化輸出→定時發送全流程自動化，每月至少節省 4 小時人工時間。',
  // ── GOLD ──
  'les-1-1-g': 'Transformer 係現代 LLM 嘅核心架構：Self-Attention 機制、位置編碼、Feed-Forward 層解析。理解 Token、Context Window、Temperature 等參數嘅實際意義，幫助你在使用 AI 時做出更準確嘅技術決策。',
  'les-1-2-g': 'AI 幻覺（Hallucination）嘅三大成因：訓練數據偏差、概率生成機制、缺乏外部驗證。防治策略：RAG 接地技術、Chain of Verification、多模型交叉驗證。附香港常見幻覺場景（法律、金融、醫療）嘅處理方案。',
  'les-1-3-g': 'Gold M1 作業：選擇一個真實業務場景，設計 LLM 評估方案。需提交測試 prompt 集（≥20條）、幻覺識別方法、模型選型理由、成本估算。評審標準：測試覆蓋率、評估客觀性、商業可行性。',
  'les-2-1-g': 'RAG（Retrieval-Augmented Generation）完整架構：文件分塊策略、Embedding 模型選擇、向量數據庫（Pinecone/Weaviate/pgvector）、檢索排序算法。核心指標：Recall@K、MRR，如何平衡準確率與延遲。',
  'les-2-2-g': '用 LangChain 搭建企業私有知識庫全流程：PDF/Word/網頁文件攝取、分塊、Embedding 存儲、問答鏈設計。實戰案例：香港律師事務所法規查詢系統，實現準確率 >90% 嘅文件問答。',
  'les-3-1-g': 'AI Agent 核心組件：感知（Perception）、規劃（Planning）、記憶（Memory）、行動（Action）。重點對比 Single Agent vs Multi-Agent 場景選擇。工具使用設計原則：工具粒度、錯誤處理、安全邊界。',
  'les-3-2-g': 'LangGraph 係 LangChain 嘅圖形化工作流框架，支持複雜嘅狀態管理同循環邏輯。核心概念：Node（節點）、Edge（邊）、State（狀態）。實戰：構建一個有錯誤重試、人工審核節點嘅企業文件處理 Agent。',
  'les-4-1-g': '深度分析 5 個香港企業 AI 落地案例：HSBC 客服 AI、港鐵智能維護、房地產估值系統、律師所文件審查、零售個性化推薦。提取可複製嘅實施模式：問題定義→數據準備→模型選型→部署監控→ROI 驗算。',
  'les-4-2-g': 'Gold 畢業項目：構建一個結合 RAG 知識庫同 AI Agent 嘅完整系統。需具備自定義知識庫（≥100個文件）、工具調用能力（≥3種工具）、可觀測性監控、部署到可訪問嘅 URL。',
  // ── PLATINUM ──
  'les-1-1-p': '三大 LLM 定制策略深度對比：Prompt Engineering（零成本靈活）→ RAG（低成本知識準確）→ Fine-tuning（高成本風格定制）。決策框架：根據數據量、延遲要求、成本預算、隱私合規選擇最適合嘅策略組合。',
  'les-1-2-p': '高質量 Fine-tuning 數據集三大標準：多樣性（覆蓋所有目標場景）、一致性（風格標注統一）、準確性（人工審核比例 ≥10%）。工具鏈：Label Studio 標注、Argilla 數據管理、合成數據生成。',
  'les-1-3-p': 'LoRA（Low-Rank Adaptation）係目前最高效嘅微調技術：只訓練參數矩陣嘅低秩分解，顯存需求降低 70%。QLoRA 進一步用 4-bit 量化，16GB 顯存可微調 70B 參數模型。實戰：微調 Llama 3 做香港法律問答助手。',
  'les-2-1-p': '視覺語言模型（VLM）實戰：圖片描述、圖表分析、文件 OCR、視覺問答。對比 GPT-4V 同 Claude Vision 嘅能力差異。商業應用：自動發票處理、產品圖片描述生成、視覺質量檢測系統設計。',
  'les-2-2-p': 'OpenAI Whisper 語音識別（支持粵語）+ TTS 語音合成完整系統設計。架構：語音輸入→轉錄→LLM 處理→語音輸出嘅端到端管道。香港應用場景：粵語客服 AI、會議自動記錄、無障礙語音助手。',
  'les-3-1-p': '生產級 AI 系統五大要素：高可用性（HA）、水平擴展、降級策略、成本控制、安全合規。架構模式：API Gateway 負載均衡、Redis 緩存層、異步隊列處理、模型版本管理。附完整 AWS/GCP 參考架構圖。',
  'les-3-2-p': 'Langfuse 係開源 LLM 可觀測性平台：Trace 請求鏈路、評估輸出質量、追蹤 Token 成本、A/B 測試 Prompt。配置：SDK 集成→自定義評分→Dashboard 設置→成本告警。目標：每月 AI 成本降低 20–30%。',
  'les-4-1-p': 'AI 項目從 Proof of Concept 到生產嘅七個里程碑：問題定義→數據評估→模型選型→Prototype→內測→限量發布→全量上線。重點：分析 80% AI 項目在 Prototype 階段死亡嘅五大原因。',
  'les-4-2-p': 'Platinum 畢業項目：為一間真實企業設計完整 AI 轉型藍圖，包括業務流程分析、AI 介入機會識別、技術架構設計、投資回報估算、18個月路線圖。由資深導師評審並提供書面反饋。',
  // ── OPENCLAW ──
  'les-1-1-oc': '2026 年主流 AI Agent 框架全景對比：LangGraph（靈活可控）、CrewAI（角色扮演多Agent）、AutoGen（對話式多Agent）、LlamaIndex Workflows。選型矩陣：根據場景複雜度、團隊技術棧、生產穩定性要求做決策。',
  'les-1-2-oc': 'MCP（Model Context Protocol）係 Anthropic 發布嘅 AI 工具標準協議，讓 Claude 同任何工具安全互動。架構：MCP Server（工具提供方）↔ MCP Client（Claude）。實戰：用 Python 搭建自定義 MCP Server 連接企業內部數據庫。',
  'les-1-3-oc': 'OpenClaw M1 作業：用同一個業務需求分別用 LangGraph 同 CrewAI 實現，對比開發效率、運行穩定性、可維護性。提交對比報告（≥1500字）同兩份完整代碼，說明你嘅最終選型理由。',
  'les-2-1-oc': 'CrewAI 核心概念深度解析：Agent（角色+工具+目標）、Task（任務+輸出格式）、Crew（協作模式：sequential/hierarchical）。實戰：搭建一個由研究員、分析師、撰稿人組成嘅 AI 市場研究團隊。',
  'les-2-2-oc': 'CrewAI Flow 支持複雜嘅事件驅動工作流：條件分支（@router）、並行執行（@listen + AND_）、狀態持久化。案例：構建自動監控競爭對手動態、生成洞察報告、發送 Slack 通知嘅全自動 Agent 系統。',
  'les-3-1-oc': 'AutoGen 0.4 完全重構嘅新架構：AgentChat API（高層）vs Core API（底層）。新增 RoundRobinGroupChat、SelectorGroupChat、Swarm 協作模式。附 0.2→0.4 遷移指南同 Docker 隔離生產部署方案。',
  'les-3-2-oc': '用 AutoGen 構建企業級 AI 代碼審查系統：架構師 Agent 負責高層設計、安全 Agent 掃描漏洞、性能 Agent 分析瓶頸、文檔 Agent 自動更新 README。集成 GitHub Actions 實現 PR 自動審查，每次節省 30 分鐘。',
  'les-4-1-oc': 'AI 服務生產部署完整指南：Docker 多階段構建（縮小 60% 鏡像體積）、Kubernetes HPA 自動擴縮容、GPU 資源調度、模型版本管理。附完整 k8s manifest 文件，支持 GKE/EKS/AKS 三大雲平台。',
  'les-4-2-oc': 'LLM API 成本優化五大策略：① Prompt Caching 降低重複 Token 費用 ② 模型路由（複雜→GPT-4o，簡單→mini）③ 響應緩存 ④ Batch API 非實時任務 ⑤ 開源模型自托管。實測案例：月費從 HK$45,000 降至 HK$13,500。',
  'les-5-1-oc': 'AI SaaS 產品從創意到上線嘅完整路線圖：Week 1–2 用戶訪談+問題驗證；Week 3–4 MVP 技術架構；Week 5–8 核心功能開發；Week 9–10 Beta 測試；Week 11–12 付費轉化優化。附香港 SaaS 市場定價策略框架。',
  'les-5-2-oc': '2026 年 AI MVP 推薦技術棧：前端 Next.js 16 + Tailwind、後端 FastAPI + Python、AI 層 LangChain、數據庫 Supabase（PostgreSQL + pgvector）、部署 Vercel + Railway。選型原則：最短上手時間、最低冷啟動成本。',
  'les-5-3-oc': 'OpenClaw 最高榮譽：Demo Day 畢業展示。面向真實投資人、企業代表、媒體展示你嘅 AI Agent 系統。評審標準：商業價值（30%）、技術創新（30%）、演示完整度（20%）、問答表現（20%）。優秀作品獲 SkillAI 合作推薦。',
};

function getAiSummary(lessonId: string): string {
  return (
    AI_SUMMARIES[lessonId] ??
    '此課堂的 AI 摘要正在生成中，請稍後查看。AI 摘要會提取核心知識點、關鍵數據和實戰建議，幫助快速複習課程內容。'
  );
}

function getSlidesForLesson(lesson: Lesson): Slide[] {
  return lesson.pptSlides ?? lesson.slides ?? [];
}

export default function PptPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0].id);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(courses[0].modules[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    courses[0].modules[0].lessons[0].id,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('reader');

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? courses[0],
    [selectedCourseId],
  );

  const selectedModule = useMemo(
    () =>
      selectedCourse.modules.find((m) => m.id === selectedModuleId) ?? selectedCourse.modules[0],
    [selectedCourse, selectedModuleId],
  );

  const selectedLesson = useMemo(
    () =>
      selectedModule.lessons.find((l) => l.id === selectedLessonId) ??
      selectedModule.lessons[0],
    [selectedModule, selectedLessonId],
  );

  const slides = getSlidesForLesson(selectedLesson);
  const totalSlides = slides.length;
  const currentSlideData = slides[currentSlide] ?? null;

  const handleCourseChange = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    setSelectedCourseId(courseId);
    setSelectedModuleId(course.modules[0].id);
    setSelectedLessonId(course.modules[0].lessons[0].id);
    setCurrentSlide(0);
  };

  const handleModuleChange = (modId: string) => {
    const mod = selectedCourse.modules.find((m) => m.id === modId);
    if (!mod) return;
    setSelectedModuleId(modId);
    setSelectedLessonId(mod.lessons[0].id);
    setCurrentSlide(0);
  };

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentSlide(0);
  };

  const handlePrint = () => {
    const content = slides
      .map(
        (s) =>
          `=== 投影片 ${s.slideNum}: ${s.title} ===\n${s.content}\n${(s.bulletPoints ?? []).map((b) => `• ${b}`).join('\n')}\n[講師備注]: ${s.notes}`,
      )
      .join('\n\n');
    const win = window.open('', '_blank');
    if (!win) return;
    const pre = win.document.createElement('pre');
    pre.style.cssText = 'font-family:sans-serif;padding:2rem;white-space:pre-wrap';
    pre.textContent = content;
    win.document.body.appendChild(pre);
    win.print();
  };

  const levelColor = LEVEL_COLORS[selectedCourse.id] ?? '#7C3AED';

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            PPT 內容閱讀器
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            瀏覽和管理課程投影片內容
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'reader' ? 'thumbnails' : 'reader')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(59,130,246,0.15)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            {viewMode === 'reader' ? '📸 縮圖模式' : '📖 閱讀模式'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(124,58,237,0.15)',
              color: '#A78BFA',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            🖨️ 匯出
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div
        className="p-4 rounded-xl flex flex-wrap gap-4"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="flex-1 min-w-40">
          <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>
            課程等級
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-40">
          <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>
            模組
          </label>
          <select
            value={selectedModuleId}
            onChange={(e) => handleModuleChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
          >
            {selectedCourse.modules.map((m: Module) => (
              <option key={m.id} value={m.id}>
                {m.week ? `第 ${m.week} 週：` : ''}
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-40">
          <label className="block text-xs mb-1.5" style={{ color: '#6B7280' }}>
            課堂
          </label>
          <select
            value={selectedLessonId}
            onChange={(e) => handleLessonChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
          >
            {selectedModule.lessons.map((l: Lesson) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* No slides fallback */}
      {totalSlides === 0 && (
        <div
          className="py-20 rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
        >
          <span className="text-5xl">📑</span>
          <p className="text-white font-medium">此課堂暫無投影片</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            選擇其他課堂查看（作業和測驗類課堂沒有 PPT）
          </p>
        </div>
      )}

      {/* Reader mode */}
      {totalSlides > 0 && viewMode === 'reader' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {currentSlideData && (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#1A1A2E', border: `1px solid ${levelColor}40` }}
                >
                  {/* Slide header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{
                      background: `${levelColor}15`,
                      borderBottom: `1px solid ${levelColor}30`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: `${levelColor}30`, color: levelColor }}
                      >
                        {currentSlideData.slideNum}
                      </span>
                      <div>
                        <p className="text-xs" style={{ color: levelColor }}>
                          {selectedCourse.title}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {selectedLesson.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: '#6B7280' }}>
                      {currentSlide + 1} / {totalSlides}
                    </span>
                  </div>

                  {/* Slide body */}
                  <div className="p-6 space-y-4">
                    <h3
                      className="text-2xl font-bold leading-tight"
                      style={{ color: levelColor, letterSpacing: '-0.02em' }}
                    >
                      {currentSlideData.title}
                    </h3>

                    <p className="text-sm leading-relaxed" style={{ color: '#D1D5DB' }}>
                      {currentSlideData.content}
                    </p>

                    {(currentSlideData.bulletPoints ?? []).length > 0 && (
                      <ul className="space-y-2">
                        {(currentSlideData.bulletPoints ?? []).map((bullet, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-start gap-3 text-sm"
                            style={{ color: '#E5E7EB' }}
                          >
                            <span
                              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{ background: `${levelColor}25`, color: levelColor }}
                            >
                              {i + 1}
                            </span>
                            {bullet}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Speaker notes */}
                  <div
                    className="mx-6 mb-6 p-4 rounded-xl"
                    style={{
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.2)',
                    }}
                  >
                    <p className="text-xs font-semibold mb-2" style={{ color: '#F59E0B' }}>
                      📝 講師備注
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#D1D5DB' }}>
                      {currentSlideData.notes}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: '#1A1A2E', border: '1px solid #2D2D44', color: '#D1D5DB' }}
              >
                ← 上一頁
              </motion.button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="transition-all rounded-full"
                    style={{
                      width: i === currentSlide ? 24 : 8,
                      height: 8,
                      background: i === currentSlide ? levelColor : '#2D2D44',
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: '#1A1A2E', border: '1px solid #2D2D44', color: '#D1D5DB' }}
              >
                下一頁 →
              </motion.button>
            </div>
          </div>

          {/* Sidebar: slide list + AI summary */}
          <div className="space-y-4">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #2D2D44' }}>
                <p className="text-sm font-semibold text-white">所有投影片</p>
              </div>
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {slides.map((slide, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm"
                    style={{
                      background: i === currentSlide ? `${levelColor}20` : 'transparent',
                      color: i === currentSlide ? levelColor : '#9CA3AF',
                      border:
                        i === currentSlide
                          ? `1px solid ${levelColor}30`
                          : '1px solid transparent',
                    }}
                  >
                    <span
                      className="text-xs mr-2"
                      style={{ color: i === currentSlide ? levelColor : '#4B5563' }}
                    >
                      {slide.slideNum}.
                    </span>
                    {slide.title}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#1A1A2E', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  borderBottom: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                <span>🤖</span>
                <p className="text-sm font-semibold" style={{ color: '#A78BFA' }}>
                  AI 課堂摘要
                </p>
              </div>
              <div className="p-4">
                <p className="text-xs leading-relaxed" style={{ color: '#D1D5DB' }}>
                  {getAiSummary(selectedLessonId)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnails mode */}
      {totalSlides > 0 && viewMode === 'thumbnails' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {slides.map((slide, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                setCurrentSlide(i);
                setViewMode('reader');
              }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: '#1A1A2E',
                border: `1px solid ${i === currentSlide ? levelColor : '#2D2D44'}`,
              }}
            >
              <div
                className="px-3 py-2 flex items-center gap-2"
                style={{
                  background: `${levelColor}15`,
                  borderBottom: `1px solid ${levelColor}20`,
                }}
              >
                <span
                  className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center"
                  style={{ background: `${levelColor}30`, color: levelColor }}
                >
                  {slide.slideNum}
                </span>
                <span className="text-xs text-white font-medium truncate">{slide.title}</span>
              </div>
              <div className="p-3">
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#9CA3AF' }}>
                  {slide.content}
                </p>
                <p className="text-xs mt-2" style={{ color: '#4B5563' }}>
                  {(slide.bulletPoints ?? []).length} 個要點
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
