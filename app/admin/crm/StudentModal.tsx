'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Student } from '../components/types';
import { LEVEL_COLORS, LEVEL_LABELS, STATUS_CONFIG } from '../components/types';

interface StudentModalProps {
  student: Student;
  onClose: () => void;
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  const [notes, setNotes] = useState(student.notes ?? '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteSaveError, setNoteSaveError] = useState(false);

  const handleSaveNotes = async () => {
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
      } else {
        console.error('[StudentModal] failed to save notes:', res.status, res.statusText);
        setNoteSaveError(true);
        setTimeout(() => setNoteSaveError(false), 3000);
      }
    } catch (err) {
      console.error('[StudentModal] network error saving notes:', err);
      setNoteSaveError(true);
      setTimeout(() => setNoteSaveError(false), 3000);
    }
  };

  const getProgress = (s: Student): number => {
    if (typeof s.progress === 'number') return s.progress;
    if (s.progress && typeof s.progress === 'object') {
      const vals = Object.values(s.progress as Record<string, number>);
      if (vals.length === 0) return 0;
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    return 0;
  };

  const getCourseProgressEntries = (s: Student): Array<{ name: string; progress: number }> => {
    if (s.courses && Array.isArray(s.courses) && typeof s.progress === 'object' && s.progress !== null) {
      return (s.courses as string[]).map((courseId) => ({
        name: courseId.charAt(0).toUpperCase() + courseId.slice(1),
        progress: (s.progress as Record<string, number>)[courseId] ?? 0,
      }));
    }
    return [];
  };

  const levelColor = LEVEL_COLORS[student.level] ?? '#6B7280';
  const statusCfg = STATUS_CONFIG[student.status] ?? STATUS_CONFIG.inactive;
  const enrolledDate = student.enrolledAt ?? student.enrolledDate ?? '';
  const courseEntries = getCourseProgressEntries(student);
  const overallProgress = getProgress(student);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6"
            style={{ borderBottom: '1px solid #2D2D44' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                style={{ background: `${levelColor}20`, border: `2px solid ${levelColor}60`, color: levelColor }}
              >
                {student.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                {student.nameEn && (
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>
                    {student.nameEn}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${levelColor}20`, color: levelColor }}
                  >
                    {LEVEL_LABELS[student.level]}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                    style={{ background: statusCfg.bg, color: statusCfg.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: statusCfg.color }}
                    />
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '電郵', value: student.email, icon: '✉️' },
                { label: '電話', value: student.phone ?? '—', icon: '📱' },
                { label: '公司', value: student.company ?? '—', icon: '🏢' },
                { label: '報名日期', value: enrolledDate, icon: '📅' },
                { label: '來源', value: student.source ?? '—', icon: '📣' },
                { label: '最後活躍', value: student.lastActive ?? '—', icon: '🕐' },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>
                    {field.icon} {field.label}
                  </p>
                  <p className="text-sm font-medium text-white break-all">{field.value}</p>
                </div>
              ))}
            </div>

            {/* Total spent */}
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <span className="text-sm" style={{ color: '#A78BFA' }}>
                總消費
              </span>
              <span className="text-xl font-bold" style={{ color: '#E9D5FF' }}>
                HK${(student.totalSpent ?? 0).toLocaleString()}
              </span>
            </div>

            {/* Course progress */}
            {courseEntries.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">課程進度</h3>
                <div className="space-y-3">
                  {courseEntries.map((entry) => (
                    <div key={entry.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ color: '#D1D5DB' }}>
                          {entry.name}
                        </span>
                        <span className="text-sm font-medium" style={{ color: entry.progress === 100 ? '#10B981' : '#A78BFA' }}>
                          {entry.progress}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#2D2D44' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${entry.progress}%`,
                            background: entry.progress === 100
                              ? 'linear-gradient(90deg, #10B981, #059669)'
                              : 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall progress (if simple number) */}
            {courseEntries.length === 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">整體進度</span>
                  <span className="text-sm font-medium" style={{ color: '#A78BFA' }}>
                    {overallProgress}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#2D2D44' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${overallProgress}%`,
                      background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Payment history */}
            {student.payments && student.payments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">付款記錄</h3>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid #2D2D44' }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: '#0F0F1A' }}>
                        {['課程', '金額', '日期', '方式', '狀態'].map((h) => (
                          <th key={h} className="text-left px-3 py-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {student.payments.map((p, i) => (
                        <tr
                          key={p.id}
                          style={{ borderTop: i > 0 ? '1px solid #2D2D44' : 'none' }}
                        >
                          <td className="px-3 py-2 text-white text-xs">{p.course ?? p.id}</td>
                          <td className="px-3 py-2 text-xs font-medium" style={{ color: '#10B981' }}>
                            HK${p.amount.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-xs" style={{ color: '#9CA3AF' }}>
                            {p.date}
                          </td>
                          <td className="px-3 py-2 text-xs" style={{ color: '#9CA3AF' }}>
                            {p.method}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: p.status === 'paid' ? 'rgba(16,185,129,0.15)' : p.status === 'refunded' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                color: p.status === 'paid' ? '#10B981' : p.status === 'refunded' ? '#EF4444' : '#F59E0B',
                              }}
                            >
                              {p.status === 'paid' ? '已付' : p.status === 'refunded' ? '已退' : '待付'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">備注</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full text-sm rounded-xl px-3 py-2.5 resize-none focus:outline-none transition-colors"
                style={{
                  background: '#0F0F1A',
                  border: '1px solid #2D2D44',
                  color: '#D1D5DB',
                }}
                placeholder="添加備注..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                  {(() => {
                const phone = (student.phone ?? '').replace(/\D/g, '');
                return phone ? (
                  <motion.a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}
                  >
                    <span>💬</span>
                    WhatsApp 聯繫
                  </motion.a>
                ) : (
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)' }}
                    title="未有電話號碼"
                  >
                    <span>💬</span>
                    未有電話
                  </div>
                );
              })()}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNotes}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(124,58,237,0.15)', color: noteSaveError ? '#EF4444' : noteSaved ? '#10B981' : '#A78BFA', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <span>{noteSaveError ? '✗' : noteSaved ? '✓' : '💾'}</span>
                {noteSaveError ? '儲存失敗' : noteSaved ? '已儲存' : '儲存備注'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
