'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Course, Module, Lesson } from '../components/types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: '已發佈', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  draft: { label: '草稿', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  upcoming: { label: '即將推出', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

const TYPE_ICON: Record<string, string> = {
  video: '🎬',
  ppt: '📑',
  quiz: '📝',
  assignment: '📋',
};

interface LessonPlanRowProps {
  lesson: Lesson;
  index: number;
  courseColor: string;
}

function LessonPlanRow({ lesson, index, courseColor }: LessonPlanRowProps) {
  const status = lesson.status ?? 'published';
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  const slideCount = (lesson.pptSlides ?? lesson.slides ?? []).length;
  const typeIcon = TYPE_ICON[lesson.type] ?? '📄';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 p-3 rounded-lg group"
      style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
    >
      <span
        className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: `${courseColor}20`, color: courseColor }}
      >
        {index + 1}
      </span>

      <span className="text-base flex-shrink-0">{typeIcon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{lesson.title}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs" style={{ color: '#6B7280' }}>
            {lesson.duration ?? '—'}
          </span>
          {slideCount > 0 && (
            <span className="text-xs" style={{ color: '#6B7280' }}>
              {slideCount} 張投影片
            </span>
          )}
          {lesson.views !== undefined && (
            <span className="text-xs" style={{ color: '#6B7280' }}>
              👁 {lesson.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: statusCfg.bg, color: statusCfg.color }}
      >
        {statusCfg.label}
      </span>
    </motion.div>
  );
}

interface ModulePlanCardProps {
  module: Module;
  courseColor: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function ModulePlanCard({ module, courseColor, isExpanded, onToggle }: ModulePlanCardProps) {
  const publishedCount = module.lessons.filter(
    (l) => !l.status || l.status === 'published',
  ).length;
  const totalCount = module.lessons.length;
  const progressPct = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${isExpanded ? courseColor + '40' : '#2D2D44'}` }}
    >
      <button
        className="w-full flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/5 text-left"
        style={{ background: isExpanded ? `${courseColor}08` : '#0F0F1A' }}
        onClick={onToggle}
      >
        {/* Week badge */}
        <span
          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ background: `${courseColor}20`, border: `1px solid ${courseColor}30` }}
        >
          {module.week ? (
            <>
              <span className="text-xs font-medium" style={{ color: courseColor }}>
                第
              </span>
              <span className="text-lg font-bold leading-none" style={{ color: courseColor }}>
                {module.week}
              </span>
              <span className="text-xs font-medium" style={{ color: courseColor }}>
                週
              </span>
            </>
          ) : (
            <span className="text-lg" style={{ color: courseColor }}>
              📚
            </span>
          )}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{module.title}</p>
          {module.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>
              {module.description}
            </p>
          )}
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#2D2D44' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: courseColor }}
              />
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: courseColor }}>
              {publishedCount}/{totalCount} 課堂
            </span>
          </div>
        </div>

        <svg
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{
            color: '#6B7280',
            transform: isExpanded ? 'rotate(180deg)' : 'none',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="p-3 space-y-2"
          style={{ borderTop: `1px solid ${courseColor}20` }}
        >
          {module.lessons.map((lesson, i) => (
            <LessonPlanRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              courseColor={courseColor}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

interface CoursePlanViewProps {
  courses: Course[];
}

export default function CoursePlanView({ courses }: CoursePlanViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id ?? '');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(selectedCourse.modules.map((m) => m.id)));
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  if (!selectedCourse) return null;

  const totalLessons = selectedCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const publishedLessons = selectedCourse.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => !l.status || l.status === 'published').length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Course selector tabs */}
      <div className="flex flex-wrap gap-2">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourseId(course.id);
              setExpandedModules(new Set());
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background:
                selectedCourseId === course.id ? `${course.color}25` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedCourseId === course.id ? course.color + '50' : '#2D2D44'}`,
              color: selectedCourseId === course.id ? course.color : '#9CA3AF',
            }}
          >
            <span>{course.icon ?? '📚'}</span>
            {course.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      {/* Course plan header */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#1A1A2E', border: `1px solid ${selectedCourse.color}30` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">{selectedCourse.title}</h3>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
              {selectedCourse.description ?? selectedCourse.subtitle ?? ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: selectedCourse.color }}>
                {selectedCourse.modules.length}
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                模組
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: selectedCourse.color }}>
                {publishedLessons}/{totalLessons}
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                已發佈
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: selectedCourse.color }}>
                {selectedCourse.duration ?? '—'}
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                課程時長
              </p>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: '#6B7280' }}>
              整體發佈進度
            </span>
            <span className="text-xs font-medium" style={{ color: selectedCourse.color }}>
              {totalLessons > 0 ? Math.round((publishedLessons / totalLessons) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#2D2D44' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalLessons > 0 ? (publishedLessons / totalLessons) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: selectedCourse.color }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={expandAll}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', border: '1px solid #2D2D44' }}
        >
          全部展開
        </button>
        <button
          onClick={collapseAll}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', border: '1px solid #2D2D44' }}
        >
          全部收起
        </button>
        <div className="ml-auto flex items-center gap-2">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: cfg.color }}
              />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Module timeline list */}
      <div className="space-y-3">
        {selectedCourse.modules.map((mod: Module) => (
          <ModulePlanCard
            key={mod.id}
            module={mod}
            courseColor={selectedCourse.color}
            isExpanded={expandedModules.has(mod.id)}
            onToggle={() => toggleModule(mod.id)}
          />
        ))}
      </div>
    </div>
  );
}
