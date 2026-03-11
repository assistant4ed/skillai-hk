'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import rawData from '@/data/students.json';
import type { Student } from '../components/types';
import { LEVEL_COLORS, LEVEL_LABELS, STATUS_CONFIG } from '../components/types';
import StudentModal from './StudentModal';

const students = rawData.students as unknown as Student[];

const ITEMS_PER_PAGE = 10;

function getProgress(s: Student): number {
  if (typeof s.progress === 'number') return s.progress;
  if (s.progress && typeof s.progress === 'object') {
    const vals = Object.values(s.progress as Record<string, number>);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  return 0;
}

function escapeCsvField(val: unknown): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportCsv(data: Student[]) {
  const headers = ['ID', '姓名', '英文名', '電郵', '電話', '公司', '等級', '狀態', '進度', '總消費', '來源', '最後活躍'];
  const rows = data.map((s) => [
    s.id, s.name, s.nameEn ?? '', s.email, s.phone ?? '', s.company ?? '',
    s.level, s.status, `${getProgress(s)}%`, `HK$${s.totalSpent ?? 0}`,
    s.source ?? '', s.lastActive ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map(escapeCsvField).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function CrmPage() {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.nameEn ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (s.phone ?? '').replace(/\s/g, '').includes(search.replace(/\s/g, '')) ||
        (s.company ?? '').toLowerCase().includes(search.toLowerCase());
      const matchLevel = filterLevel === 'all' || s.level === filterLevel;
      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchSearch && matchLevel && matchStatus;
    });
  }, [search, filterLevel, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    active: students.filter((s) => s.status === 'active').length,
    pending: students.filter((s) => s.status === 'pending').length,
    totalRevenue: students.reduce((sum, s) => sum + (s.totalSpent ?? 0), 0),
  }), []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            學員 CRM
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            管理所有學員關係與進度
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => exportCsv(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <span>📥</span>
          匯出 CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '活躍學員', value: stats.active.toLocaleString(), color: '#10B981', icon: '🟢' },
          { label: '待確認', value: stats.pending.toLocaleString(), color: '#F59E0B', icon: '🟡' },
          { label: '總收入', value: `HK$${(stats.totalRevenue / 1000000).toFixed(1)}M`, color: '#7C3AED', icon: '💰' },
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

      {/* Search and filters */}
      <div
        className="p-4 rounded-xl flex flex-wrap gap-3"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="flex-1 min-w-48 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#6B7280' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="搜索姓名或電郵..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none transition-colors"
            style={{
              background: '#0F0F1A',
              border: '1px solid #2D2D44',
              color: '#E5E7EB',
            }}
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => {
            setFilterLevel(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg text-sm focus:outline-none cursor-pointer"
          style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
        >
          <option value="all">所有等級</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
          <option value="openclaw">OpenClaw</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg text-sm focus:outline-none cursor-pointer"
          style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
        >
          <option value="all">所有狀態</option>
          <option value="active">活躍</option>
          <option value="pending">待確認</option>
          <option value="inactive">非活躍</option>
          <option value="refunded">已退款</option>
        </select>
        <span className="flex items-center text-sm px-3 py-2 rounded-lg" style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#6B7280' }}>
          {filtered.length} 位學員
        </span>
      </div>

      {/* Student table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0F0F1A', borderBottom: '1px solid #2D2D44' }}>
                {['學員', '等級', '狀態', '進度', '最後活躍', '總消費', '操作'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((student, i) => {
                const levelColor = LEVEL_COLORS[student.level] ?? '#6B7280';
                const statusCfg = STATUS_CONFIG[student.status] ?? STATUS_CONFIG.inactive;
                const progress = getProgress(student);

                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid #2D2D44' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    {/* Avatar + name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: `${levelColor}20`, border: `1px solid ${levelColor}40`, color: levelColor }}
                        >
                          {student.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{student.name}</p>
                          <p className="text-xs truncate" style={{ color: '#6B7280' }}>
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: `${levelColor}20`, color: levelColor }}
                      >
                        {LEVEL_LABELS[student.level]}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: statusCfg.color }}
                        />
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2D2D44' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${progress}%`,
                              background: progress === 100
                                ? 'linear-gradient(90deg, #10B981, #059669)'
                                : 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
                          {progress}%
                        </span>
                      </div>
                    </td>

                    {/* Last active */}
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>
                        {student.lastActive ?? '—'}
                      </span>
                    </td>

                    {/* Total spent */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium" style={{ color: '#10B981' }}>
                        HK${(student.totalSpent ?? 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                        >
                          查看
                        </button>
                        {(() => {
                          const phone = (student.phone ?? '').replace(/\D/g, '');
                          return phone ? (
                            <a
                              href={`https://wa.me/${phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                              style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              WA
                            </a>
                          ) : (
                            <span
                              className="text-xs px-2.5 py-1 rounded-lg"
                              style={{ background: 'rgba(107,114,128,0.15)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.25)' }}
                              title="沒有電話號碼"
                            >
                              WA
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center" style={{ color: '#6B7280' }}>
                    沒有找到符合條件的學員
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid #2D2D44' }}
          >
            <p className="text-xs" style={{ color: '#6B7280' }}>
              第 {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} 位，共 {filtered.length} 位
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40"
                style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
              >
                ← 上一頁
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 rounded-lg text-xs transition-all"
                  style={{
                    background: page === currentPage ? '#7C3AED' : '#0F0F1A',
                    border: `1px solid ${page === currentPage ? '#7C3AED' : '#2D2D44'}`,
                    color: page === currentPage ? 'white' : '#9CA3AF',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-40"
                style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
              >
                下一頁 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student detail modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
