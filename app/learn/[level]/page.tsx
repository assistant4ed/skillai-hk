'use client';

import { use, useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import coursesData from '@/data/courses-full.json';

/* ══════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════ */

interface PptSlide {
  slideNum: number;
  title: string;
  content: string;
  bulletPoints: string[];
  notes: string;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'assignment';
  duration: string;
  videoUrl?: string;
  videoId?: string;
  thumbnail?: string;
  status: string;
  views?: number;
  description?: string;
  pptSlides: PptSlide[];
  resources: string[];
}

interface Module {
  id: string;
  week: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  level: string;
  title: string;
  titleEn: string;
  color: string;
  price: number;
  totalStudents: number;
  description: string;
  duration: string;
  totalLessons: number;
  rating: number;
  modules: Module[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}

/* ══════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════ */

const LEVEL_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#D97706',
  openclaw: '#4169E1',
  platinum: '#7C3AED',
};

const LEVEL_LABELS: Record<string, string> = {
  bronze: 'AI 新手入門',
  silver: 'AI 進階應用',
  gold: 'AI 專業實戰',
  openclaw: 'OpenClaw Agent',
  platinum: 'AI 架構師',
};

const QUICK_QUESTIONS = [
  '解釋這個概念',
  '給我一個例子',
  '下一步學什麼',
];

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/* ══════════════════════════════════════════════════
   ICONS (inline SVG — zero extra dependencies)
   ══════════════════════════════════════════════════ */

function ArrowLeftIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function PlayIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function DocumentIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function LockIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </motion.svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   PROGRESS BAR
   ══════════════════════════════════════════════════ */

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-full max-w-xs">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MODULE SIDEBAR ITEM
   ══════════════════════════════════════════════════ */

function LessonSidebarItem({
  lesson,
  isCurrent,
  isCompleted,
  isLocked,
  color,
  onClick,
}: {
  lesson: Lesson;
  isCurrent: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg
        transition-all duration-200 group
        ${isCurrent ? 'text-white shadow-sm' : 'hover:bg-gray-100 text-gray-700'}
        ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={isCurrent ? { backgroundColor: color } : {}}
    >
      <span className={`mt-0.5 flex-shrink-0 ${isCurrent ? 'text-white/90' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
        {isCompleted && !isCurrent ? (
          <CheckCircleIcon className="w-4 h-4" />
        ) : isLocked ? (
          <LockIcon className="w-4 h-4" />
        ) : lesson.type === 'video' ? (
          <PlayIcon className="w-4 h-4" />
        ) : (
          <DocumentIcon className="w-4 h-4" />
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span className="text-xs font-medium line-clamp-2 leading-snug">{lesson.title}</span>
        <span className={`text-xs mt-0.5 block ${isCurrent ? 'text-white/70' : 'text-gray-400'}`}>
          {lesson.duration}
        </span>
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════
   SLIDE CARD
   ══════════════════════════════════════════════════ */

function SlideCard({ slide, color }: { slide: PptSlide; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            Slide {slide.slideNum}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">{slide.title}</h3>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">{slide.content}</p>
        {slide.bulletPoints.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {slide.bulletPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                {point}
              </li>
            ))}
          </ul>
        )}
        {slide.notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-medium">備注：</span> {slide.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   NOTES TAB
   ══════════════════════════════════════════════════ */

function NotesTab({ lessonId }: { lessonId: string }) {
  const storageKey = `skillai-notes-${lessonId}`;
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { content: string; savedAt: string };
        setNotes(parsed.content);
        setLastSaved(new Date(parsed.savedAt));
      } catch {
        setNotes(saved);
      }
    }
  }, [storageKey]);

  const handleChange = useCallback(
    (value: string) => {
      setNotes(value);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const payload = { content: value, savedAt: new Date().toISOString() };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setLastSaved(new Date());
      }, 800);
    },
    [storageKey],
  );

  const formattedTime = lastSaved
    ? lastSaved.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex flex-col h-full min-h-64">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">課堂筆記</p>
        {formattedTime && (
          <span className="text-xs text-gray-400">已儲存 {formattedTime}</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="在此輸入你的筆記... 自動儲存至瀏覽器"
        className="flex-1 w-full min-h-64 p-4 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-gray-400 transition-all duration-200 leading-relaxed"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   AI TUTOR TAB
   ══════════════════════════════════════════════════ */

function AiTutorTab({
  lessonTitle,
  courseLevel,
  color,
}: {
  lessonTitle: string;
  courseLevel: string;
  color: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `你好！我係你嘅 AI 導師。你而家係學習「${lessonTitle}」，有咩唔明嘅可以問我！`,
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isStreamingRef = useRef(false);
  const messagesRef = useRef(messages);

  useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreamingRef.current) return;

      const userMessage: ChatMessage = { role: 'user', content: text.trim(), ts: Date.now() };
      const history = messagesRef.current.slice(1); // exclude the initial greeting

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsStreaming(true);

      const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '', ts: Date.now() };
      setMessages((prev) => [...prev, assistantPlaceholder]);

      try {
        const res = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            lessonTitle,
            courseLevel,
            history: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) throw new Error('API error');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated };
            return updated;
          });
        }
      } catch (err) {
        console.error('[AI tutor] streaming error:', err);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: '抱歉，出現咗技術問題，請稍後再試。',
          };
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [lessonTitle, courseLevel],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '400px' }}>
      {/* Quick question chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            aria-label={`向 AI 導師提問：${q}`}
            onClick={() => sendMessage(q)}
            disabled={isStreaming}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 hover:shadow-sm active:scale-95 disabled:opacity-50"
            style={{ borderColor: color, color }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ maxHeight: '360px' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.ts}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ backgroundColor: color }}
              >
                AI
              </div>
            )}
            <div
              className={`
                max-w-[80%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl
                ${msg.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }
              `}
              style={msg.role === 'user' ? { backgroundColor: color } : {}}
            >
              {msg.content || (
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder="問 AI 導師任何問題..."
          rows={1}
          className="flex-1 text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-gray-400 transition-all duration-200 disabled:opacity-50"
          style={{ maxHeight: '96px' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="p-2.5 rounded-xl text-white transition-all duration-200 disabled:opacity-40 active:scale-95 flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-label="發送訊息"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TAB SWITCHER
   ══════════════════════════════════════════════════ */

type TabId = 'video' | 'slides' | 'notes' | 'ai';

const TABS: { id: TabId; label: string }[] = [
  { id: 'video', label: '影片' },
  { id: 'slides', label: '投影片' },
  { id: 'notes', label: '筆記' },
  { id: 'ai', label: 'AI導師' },
];

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */

export default function LearnPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);
  const color = LEVEL_COLORS[level] ?? '#4169E1';

  const course = (coursesData.courses as Course[]).find((c) => c.level === level);

  // Flatten lessons across all modules for prev/next navigation
  const allLessons: Array<{ lesson: Lesson; moduleTitle: string; moduleWeek: number }> = [];
  course?.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      allLessons.push({ lesson, moduleTitle: mod.title, moduleWeek: mod.week });
    });
  });

  const [currentLessonId, setCurrentLessonId] = useState(allLessons[0]?.lesson.id ?? '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(course?.modules.map((m) => m.id) ?? []),
  );
  const [activeTab, setActiveTab] = useState<TabId>('video');

  const currentIndex = allLessons.findIndex((l) => l.lesson.id === currentLessonId);
  const currentEntry = allLessons[currentIndex];
  const currentLesson = currentEntry?.lesson;
  const prevLesson = allLessons[currentIndex - 1]?.lesson ?? null;
  const nextLesson = allLessons[currentIndex + 1]?.lesson ?? null;

  const completedCount = Math.max(0, currentIndex + 1);
  const progressPercent = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

  const handleLessonSelect = (id: string) => {
    setCurrentLessonId(id);
    setActiveTab('video');
    setSidebarOpen(false);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">找不到課程</p>
          <Link href="/learn" className="text-blue-600 hover:underline text-sm">
            返回學習中心
          </Link>
        </div>
      </div>
    );
  }

  const isVideoLesson = currentLesson.type === 'video' && currentLesson.videoUrl;
  const hasSlidesTab = (currentLesson.pptSlides?.length ?? 0) > 0;
  const visibleTabs = TABS.filter((t) => {
    if (t.id === 'video') return isVideoLesson;
    if (t.id === 'slides') return hasSlidesTab;
    return true;
  });

  /* ── Sidebar component (shared between desktop and mobile drawer) ── */
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">課程大綱</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 line-clamp-1">{course.title}</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="課程大綱">
        {course.modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          return (
            <div key={mod.id}>
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors duration-150"
                aria-expanded={isExpanded}
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500">週 {mod.week}</span>
                  <p className="text-sm font-medium text-gray-800 leading-snug">{mod.title}</p>
                </div>
                <ChevronDownIcon isOpen={isExpanded} />
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pl-2 mt-1 space-y-0.5 pb-1">
                      {mod.lessons.map((lesson, li) => {
                        const lessonFlatIndex = allLessons.findIndex((l) => l.lesson.id === lesson.id);
                        const isCompleted = lessonFlatIndex < currentIndex;
                        const isLocked = lessonFlatIndex > currentIndex + 2;
                        return (
                          <LessonSidebarItem
                            key={lesson.id}
                            lesson={lesson}
                            isCurrent={lesson.id === currentLessonId}
                            isCompleted={isCompleted}
                            isLocked={isLocked}
                            color={color}
                            onClick={() => handleLessonSelect(lesson.id)}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <Link
            href="/learn"
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="返回課程頁面"
          >
            <ArrowLeftIcon />
          </Link>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="開啟課程大綱"
          >
            <MenuIcon />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">{currentLesson.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                {LEVEL_LABELS[level] ?? level}
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                {currentEntry?.moduleTitle}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <ProgressBar value={progressPercent} color={color} />
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {completedCount}/{allLessons.length}
            </span>
          </div>
        </div>
      </header>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:hidden flex flex-col"
              aria-label="課程大綱"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm">課程大綱</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="關閉"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">{SidebarContent}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 border-r border-gray-200 bg-white sticky top-[57px] self-start h-[calc(100vh-57px)] overflow-hidden">
          {SidebarContent}
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">

          {/* ── VIDEO EMBED ── */}
          {isVideoLesson && (
            <motion.div
              key={`video-${currentLessonId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="mb-6"
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black"
                style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}

          {/* ── ASSIGNMENT CARD ── */}
          {currentLesson.type === 'assignment' && (
            <motion.div
              key={`assign-${currentLessonId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="mb-6 rounded-2xl border-2 p-6 bg-white"
              style={{ borderColor: color }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  <DocumentIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color }}>
                    課堂作業
                  </p>
                  <h2 className="font-semibold text-gray-900 text-base mb-2">{currentLesson.title}</h2>
                  {currentLesson.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{currentLesson.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">預計時間：{currentLesson.duration}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LESSON META ── */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{currentLesson.title}</h2>
            {currentLesson.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{currentLesson.description}</p>
            )}
          </div>

          {/* ── TAB SWITCHER ── */}
          {visibleTabs.length > 1 && (
            <div className="mb-5">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200
                      ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB PANELS ── */}
          <AnimatePresence mode="wait">
            {activeTab === 'video' && isVideoLesson && (
              <motion.div
                key="tab-video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Views count */}
                {currentLesson.views && (
                  <p className="text-xs text-gray-400">
                    {currentLesson.views.toLocaleString()} 次觀看
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === 'slides' && (
              <motion.div
                key="tab-slides"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {(currentLesson.pptSlides ?? []).map((slide) => (
                  <SlideCard key={slide.slideNum} slide={slide} color={color} />
                ))}
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="tab-notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NotesTab lessonId={currentLessonId} />
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="tab-ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AiTutorTab
                  lessonTitle={currentLesson.title}
                  courseLevel={LEVEL_LABELS[level] ?? level}
                  color={color}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── BOTTOM NAVIGATION ── */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
            <div>
              {prevLesson ? (
                <button
                  onClick={() => handleLessonSelect(prevLesson.id)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
                  <span className="hidden sm:block max-w-36 truncate">{prevLesson.title}</span>
                  <span className="sm:hidden">上一課</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="text-xs text-gray-400">
              {currentIndex + 1} / {allLessons.length}
            </div>

            <div>
              {nextLesson ? (
                <button
                  onClick={() => handleLessonSelect(nextLesson.id)}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95 group"
                  style={{ backgroundColor: color }}
                >
                  <span className="hidden sm:block max-w-36 truncate">{nextLesson.title}</span>
                  <span className="sm:hidden">下一課</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </button>
              ) : (
                <Link
                  href="/learn"
                  className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  完成課程
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
