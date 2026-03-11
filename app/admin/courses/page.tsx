'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import coursesData from '@/data/courses-full.json';
import type { Course, Module, Lesson } from '../components/types';
import CoursePlanView from './CoursePlanView';

const courses = coursesData.courses as unknown as Course[];

type ActiveTab = 'overview' | 'plan';

interface AddLessonForm {
  title: string;
  type: 'video' | 'ppt' | 'quiz';
  videoUrl: string;
  duration: string;
}

const DEFAULT_FORM: AddLessonForm = { title: '', type: 'video', videoUrl: '', duration: '' };

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [addLessonForm, setAddLessonForm] = useState<AddLessonForm>(DEFAULT_FORM);
  const [lessonToast, setLessonToast] = useState<string | null>(null);

  const totalStudents = courses.reduce((sum, c) => sum + c.totalStudents, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.revenue ?? 0), 0);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const title = addLessonForm.title.trim();
    setShowAddLesson(false);
    setAddLessonForm(DEFAULT_FORM);
    setLessonToast(`「${title}」已加入課程`);
    setTimeout(() => setLessonToast(null), 3000);
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Toast notification */}
      <AnimatePresence>
        {lessonToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            ✓ {lessonToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            課程管理
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            {courses.length} 個課程等級 · {totalStudents.toLocaleString()} 位學員
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setActiveTab('plan'); setShowAddLesson(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <span>+</span> 新增課程
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}>
        {(
          [
            { id: 'overview', label: '課程總覽', icon: '📚' },
            { id: 'plan', label: '課程計劃', icon: '📅' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? '#7C3AED' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#9CA3AF',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course plan tab */}
      {activeTab === 'plan' && (
        <CoursePlanView courses={courses} />
      )}

      {/* Overview tab content */}
      {activeTab === 'overview' && (
      <>

      {/* Overview summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '總學員', value: totalStudents.toLocaleString(), icon: '👥', color: '#7C3AED' },
          { label: '總收入', value: `HK$${(totalRevenue / 1000000).toFixed(1)}M`, icon: '💰', color: '#10B981' },
          { label: '平均完課率', value: `${courses.length > 0 ? Math.round(courses.reduce((s, c) => s + (c.completionRate ?? 0), 0) / courses.length) : 0}%`, icon: '🎓', color: '#F59E0B' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl flex items-center gap-4"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {stat.label}
              </p>
              <p className="text-xl font-bold" style={{ color: stat.color, letterSpacing: '-0.02em' }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <CourseCard
              course={course}
              isSelected={selectedCourse?.id === course.id}
              onSelect={() => setSelectedCourse(selectedCourse?.id === course.id ? null : course)}
            />
          </motion.div>
        ))}
      </div>

      {/* Course detail expandable */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedCourse.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedCourse.title}</h3>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      {selectedCourse.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddLesson(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)' }}
                  >
                    <span>+</span> 新增課堂
                  </motion.button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modules list */}
              <div className="space-y-3">
                {selectedCourse.modules.map((mod: Module) => (
                  <div
                    key={mod.id}
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid #2D2D44' }}
                  >
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
                      style={{ background: '#0F0F1A' }}
                      onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${selectedCourse.color}20`, color: selectedCourse.color }}
                        >
                          {selectedCourse.modules.indexOf(mod) + 1}
                        </span>
                        <span className="text-sm font-medium text-white">{mod.title}</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>
                          {mod.lessons.length} 課堂
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 transition-transform"
                        style={{
                          color: '#6B7280',
                          transform: expandedModule === mod.id ? 'rotate(180deg)' : 'none',
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {expandedModule === mod.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-2" style={{ borderTop: '1px solid #2D2D44' }}>
                            {mod.lessons.map((lesson: Lesson) => (
                              <LessonRow key={lesson.id} lesson={lesson} color={selectedCourse.color} onEdit={() => setShowAddLesson(true)} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Lesson Modal */}
      <AnimatePresence>
        {showAddLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowAddLesson(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4">新增課堂</h3>
              <form onSubmit={handleAddLesson} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                    課堂標題
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={addLessonForm.title}
                    onChange={(e) => setAddLessonForm({ ...addLessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                    placeholder="例：LangChain 基礎入門"
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: addLessonForm.title.length >= 90 ? '#F59E0B' : '#6B7280' }}>
                    {addLessonForm.title.length}/100
                  </p>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                    類型
                  </label>
                  <select
                    value={addLessonForm.type}
                    onChange={(e) => setAddLessonForm({ ...addLessonForm, type: e.target.value as 'video' | 'ppt' | 'quiz' })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                  >
                    <option value="video">影片</option>
                    <option value="ppt">PPT</option>
                    <option value="quiz">測驗</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={addLessonForm.videoUrl}
                    onChange={(e) => setAddLessonForm({ ...addLessonForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                    時長
                  </label>
                  <input
                    type="text"
                    value={addLessonForm.duration}
                    onChange={(e) => setAddLessonForm({ ...addLessonForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                    placeholder="例：25 分鐘"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLesson(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: '#7C3AED', color: 'white' }}
                  >
                    新增課堂
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </>
      )}
    </div>
  );
}

function CourseCard({
  course,
  isSelected,
  onSelect,
}: {
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl cursor-pointer transition-all"
      style={{
        background: '#1A1A2E',
        border: `1px solid ${isSelected ? course.color : '#2D2D44'}`,
        boxShadow: isSelected ? `0 0 20px ${course.color}30` : 'none',
      }}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{course.icon ?? '📚'}</span>
          <div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium block mb-1"
              style={{ background: `${course.color}20`, color: course.color }}
            >
              {(course.status ?? 'published') === 'published' ? '已發佈' : '草稿'}
            </span>
            <p className="text-sm font-bold text-white">{course.title.split('—')[0].trim()}</p>
          </div>
        </div>
        <button
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label="Edit course"
        >
          <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
        {course.subtitle ?? course.description ?? ''}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: '學員', value: course.totalStudents.toLocaleString() },
          { label: '收入', value: `HK$${((course.revenue ?? 0) / 10000).toFixed(0)}萬` },
          { label: '模組', value: `${course.modules.length}` },
          { label: '課堂', value: `${lessonCount}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-3 py-2 rounded-lg"
            style={{ background: '#0F0F1A' }}
          >
            <p className="text-xs" style={{ color: '#6B7280' }}>
              {stat.label}
            </p>
            <p className="text-sm font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Completion rate */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: '#6B7280' }}>
            完課率
          </span>
          <span className="text-xs font-medium" style={{ color: course.color }}>
            {course.completionRate ?? 0}%
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#2D2D44' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.completionRate ?? 0}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: course.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function LessonRow({ lesson, color, onEdit }: { lesson: Lesson; color: string; onEdit?: () => void }) {
  const typeIcon = lesson.type === 'video' ? '🎬' : lesson.type === 'ppt' ? '📑' : '📝';
  const typeLabel = lesson.type === 'video' ? '影片' : lesson.type === 'ppt' ? 'PPT' : '測驗';

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{ background: '#1A1A2E' }}
    >
      <span className="text-base">{typeIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{lesson.title}</p>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          {lesson.duration ?? '—'}
        </p>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: `${color}20`, color }}
      >
        {typeLabel}
      </span>
      <button
        className="p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
        aria-label="Edit lesson"
        onClick={onEdit}
      >
        <svg className="w-3.5 h-3.5" style={{ color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  );
}
