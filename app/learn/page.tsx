'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '../../components/Logo';
import coursesData from '@/data/courses-full.json';

/* ══════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════ */

interface CourseCard {
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
}

interface LevelProgress {
  completedLessons: number;
  totalLessons: number;
}

/* ══════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════ */

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const LEVEL_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'openclaw'];

const LEVEL_EMOJI: Record<string, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  openclaw: '🦞',
};

/* ══════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════ */

function getProgressFromStorage(level: string, totalLessons: number): LevelProgress {
  if (typeof window === 'undefined') return { completedLessons: 0, totalLessons };
  const key = `skillai-progress-${level}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as { completedLessons: number };
      return { completedLessons: parsed.completedLessons ?? 0, totalLessons };
    }
  } catch {
    // ignore parse errors
  }
  return { completedLessons: 0, totalLessons };
}

/* ══════════════════════════════════════════════════
   PROGRESS BAR
   ══════════════════════════════════════════════════ */

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-full">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COURSE CARD
   ══════════════════════════════════════════════════ */

function CourseHubCard({
  course,
  progress,
  index,
}: {
  course: CourseCard;
  progress: LevelProgress;
  index: number;
}) {
  const hasStarted = progress.completedLessons > 0;
  const isComplete = progress.completedLessons >= progress.totalLessons && hasStarted;
  const progressPercent = progress.totalLessons > 0
    ? (progress.completedLessons / progress.totalLessons) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
    >
      {/* Color accent top bar */}
      <div className="h-1" style={{ backgroundColor: course.color }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${course.color}18` }}
            >
              {LEVEL_EMOJI[course.level] ?? '📚'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{course.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{course.titleEn}</p>
            </div>
          </div>

          {isComplete && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white flex-shrink-0"
              style={{ backgroundColor: course.color }}
            >
              完成
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>{course.duration}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{course.totalLessons} 堂課</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{course.totalStudents.toLocaleString()}+ 學員</span>
        </div>

        {/* Progress */}
        {hasStarted && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>進度</span>
              <span style={{ color: course.color }}>
                {progress.completedLessons}/{progress.totalLessons}
              </span>
            </div>
            <ProgressBar value={progressPercent} color={course.color} />
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/learn/${course.level}`}
          className="block w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-98 group-hover:shadow-sm"
          style={
            hasStarted
              ? { backgroundColor: course.color, color: '#fff' }
              : { backgroundColor: `${course.color}15`, color: course.color }
          }
        >
          {isComplete ? '重溫課程' : hasStarted ? '繼續學習 →' : '開始學習'}
        </Link>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */

export default function LearnHubPage() {
  const courses = (coursesData.courses as CourseCard[]).sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level),
  );

  const [progressMap, setProgressMap] = useState<Record<string, LevelProgress>>({});

  useEffect(() => {
    const map: Record<string, LevelProgress> = {};
    courses.forEach((c) => {
      map[c.level] = getProgressFromStorage(c.level, c.totalLessons);
    });
    setProgressMap(map);
  }, []);

  // Find the first in-progress course for featured CTA
  const inProgressCourse = courses.find(
    (c) => (progressMap[c.level]?.completedLessons ?? 0) > 0 &&
      (progressMap[c.level]?.completedLessons ?? 0) < c.totalLessons,
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <a href="/" className="hover:opacity-80 transition"><Logo size="md" /></a>
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-400">
            <a href="/" className="hover:text-[#4169E1] transition">資源</a>
            <a href="/courses" className="hover:text-[#4169E1] transition">課程</a>
          </div>
          <a href="/friends" className="bg-[#4169E1] text-white px-4 py-1.5 md:px-5 md:py-2 rounded-xl text-xs md:text-sm font-semibold shadow-lg shadow-blue-200/50 hover:bg-[#3358C8] transition">
            免費資源
          </a>
        </div>
      </nav>

      <main id="main-content">
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">

        {/* ── IN-PROGRESS BANNER ── */}
        {inProgressCourse && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="mb-8 rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ backgroundColor: `${inProgressCourse.color}12`, border: `1.5px solid ${inProgressCourse.color}30` }}
          >
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: inProgressCourse.color }}>
                繼續上次進度
              </p>
              <p className="font-bold text-gray-900 text-sm">{inProgressCourse.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                已完成 {progressMap[inProgressCourse.level]?.completedLessons ?? 0} / {inProgressCourse.totalLessons} 堂課
              </p>
            </div>
            <Link
              href={`/learn/${inProgressCourse.level}`}
              className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: inProgressCourse.color }}
            >
              繼續學習 →
            </Link>
          </motion.div>
        )}

        {/* ── LEARNING PATH LABEL ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5"
        >
          <h2 className="text-base font-semibold text-gray-700">全部課程</h2>
          <p className="text-sm text-gray-400 mt-0.5">由入門到架構師的完整學習路徑</p>
        </motion.div>

        {/* ── COURSE GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <CourseHubCard
              key={course.level}
              course={course}
              progress={progressMap[course.level] ?? { completedLessons: 0, totalLessons: course.totalLessons }}
              index={i}
            />
          ))}
        </div>

        {/* ── WHATSAPP UPGRADE CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #25D36615, #25D36605)', border: '1px solid #25D36630' }}
        >
          <p className="text-sm font-semibold text-gray-700 mb-1">想升級課程或有任何問題？</p>
          <p className="text-xs text-gray-500 mb-4">WhatsApp 我們即時獲得免費諮詢 · 7 天無理由退款保證</p>
          <a
            href="https://wa.me/85267552667"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp 免費諮詢
          </a>
        </motion.div>

        {/* ── FOOTER NOTE ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          進度自動儲存至瀏覽器。如需跨設備同步，請登入帳號。
        </motion.p>
      </div>
      </main>

      {/* ── FOOTER ── */}
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
