'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import adminStats from '@/data/admin-stats.json';
import videoQueueData from '@/data/video-queue.json';
import type { Video } from './components/types';
import { LEVEL_COLORS } from './components/types';

const { overview, revenueByMonth, enrollmentsByLevel, recentActivity } = adminStats;

const REVENUE_DATA = revenueByMonth.slice(-6).map((d) => ({
  month: d.month.replace(/^\d{4}-0?/, '') + '月',
  value: d.revenue,
  label: `HK$${(d.revenue / 1000).toFixed(0)}K`,
}));

const MAX_REVENUE = Math.max(1, ...REVENUE_DATA.map((d) => d.value));

const lastMonth = revenueByMonth[revenueByMonth.length - 1];
const prevMonth = revenueByMonth[revenueByMonth.length - 2];
const MONTHLY_GROWTH = prevMonth?.revenue > 0
  ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)
  : 0;

const TOP_COURSES = [
  { name: 'Bronze — AI 入門', students: enrollmentsByLevel.bronze, color: '#CD7F32', icon: '🥉' },
  { name: 'Silver — Prompt Engineering', students: enrollmentsByLevel.silver, color: '#9CA3AF', icon: '🥈' },
  { name: 'Gold — AI Agent 開發', students: enrollmentsByLevel.gold, color: '#D97706', icon: '🥇' },
  { name: 'Platinum — 企業 AI 部署', students: enrollmentsByLevel.platinum, color: '#7C3AED', icon: '💎' },
  { name: 'OpenClaw — 架構師認證', students: enrollmentsByLevel.openclaw, color: '#4169E1', icon: '🦞' },
];

const MAX_STUDENTS = Math.max(1, ...TOP_COURSES.map((c) => c.students));

const VIDEO_QUEUE = (videoQueueData.videos as Video[]).filter((v) =>
  ['review', 'editing', 'recording'].includes(v.status),
);

const ACTIVITY_ICONS: Record<string, string> = {
  enrollment: '👤',
  payment: '💰',
  completion: '🎓',
  message: '💬',
  refund: '↩️',
  upgrade: '⬆️',
  video_published: '🎬',
};

const STATUS_VIDEO: Record<string, { label: string; color: string }> = {
  planning: { label: '規劃中', color: '#6B7280' },
  scripting: { label: '撰稿中', color: '#3B82F6' },
  recording: { label: '錄製中', color: '#F59E0B' },
  editing: { label: '剪輯中', color: '#8B5CF6' },
  review: { label: '審核中', color: '#EF4444' },
  published: { label: '已發佈', color: '#10B981' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: '緊急', color: '#EF4444' },
  high: { label: '高', color: '#F59E0B' },
  medium: { label: '中', color: '#3B82F6' },
  low: { label: '低', color: '#6B7280' },
};

const cardBase = {
  background: '#1A1A2E',
  border: '1px solid #2D2D44',
  borderRadius: 16,
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
}

function StatCard({ icon, label, value, sub, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="p-6 relative overflow-hidden"
      style={cardBase}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-8 translate-x-8"
        style={{ background: color }}
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        {icon}
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: '#9CA3AF' }}>
        {label}
      </p>
      <p className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: '#6B7280' }}>
        {sub}
      </p>
    </motion.div>
  );
}

function AnimatedTooltip({ show, label }: { show: boolean; label: string }) {
  return (
    <div className="relative h-6 flex items-center justify-center">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
          style={{ background: '#1A1A2E', color: '#E9D5FF', border: '1px solid #2D2D44' }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const today = new Date().toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activeRate = overview.totalStudents > 0
    ? Math.round((overview.activeStudents / overview.totalStudents) * 100)
    : 0;
  const completionPct = Math.round(overview.courseCompletionRate * 100);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
          總覽儀表板
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {today} — 數據即時更新
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="總學員"
          value={overview.totalStudents.toLocaleString()}
          sub={`+${lastMonth.newStudents} 本月新增`}
          color="#7C3AED"
          delay={0}
        />
        <StatCard
          icon="💰"
          label="本月收入"
          value={`HK$${(overview.monthlyRevenue / 1000).toFixed(0)}K`}
          sub={`${MONTHLY_GROWTH >= 0 ? '+' : ''}${MONTHLY_GROWTH}% 較上月`}
          color="#10B981"
          delay={0.05}
        />
        <StatCard
          icon="🔥"
          label="活躍學員"
          value={overview.activeStudents.toLocaleString()}
          sub={`${activeRate}% 活躍率`}
          color="#F59E0B"
          delay={0.1}
        />
        <StatCard
          icon="🎓"
          label="完課率"
          value={`${completionPct}%`}
          sub={`NPS 分數 ${overview.npsScore}`}
          color="#3B82F6"
          delay={0.15}
        />
      </div>

      {/* Revenue chart + Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="xl:col-span-2 p-6"
          style={cardBase}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">收入趨勢</h3>
              <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                最近 6 個月
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
            >
              {MONTHLY_GROWTH >= 0 ? '+' : ''}{MONTHLY_GROWTH}% 增長
            </div>
          </div>

          <div className="flex items-end gap-3 h-48">
            {REVENUE_DATA.map((d, i) => {
              const heightPct = (d.value / MAX_REVENUE) * 100;
              const isHovered = hoveredBar === i;
              const isLast = i === REVENUE_DATA.length - 1;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <AnimatedTooltip show={isHovered} label={d.label} />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-lg rounded-b relative overflow-hidden"
                    style={{
                      background: isHovered
                        ? 'linear-gradient(180deg, #A78BFA, #7C3AED)'
                        : isLast
                        ? 'linear-gradient(180deg, #7C3AED, #5B21B6)'
                        : 'rgba(124,58,237,0.35)',
                      border: isHovered ? '1px solid rgba(167,139,250,0.5)' : '1px solid transparent',
                      transition: 'background 0.2s, border 0.2s',
                    }}
                  />
                  <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent activity from admin-stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="p-6"
          style={cardBase}
        >
          <h3 className="font-bold text-white text-lg mb-4">最新動態</h3>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ background: '#2D2D44' }}
                >
                  {ACTIVITY_ICONS[item.type] ?? '📌'}
                </div>
                <div className="flex-1 min-w-0">
                  {item.studentName && (
                    <p className="text-sm font-medium text-white truncate">{item.studentName}</p>
                  )}
                  <p className="text-xs leading-snug" style={{ color: '#9CA3AF' }}>
                    {item.action}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>
                    {new Date(item.timestamp).toLocaleDateString('zh-HK', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions + Top courses + Video queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-6"
          style={cardBase}
        >
          <h3 className="font-bold text-white text-lg mb-4">快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '👤', label: '新增學員', color: '#7C3AED', href: '/admin/crm' },
              { icon: '🎬', label: '上傳影片', color: '#3B82F6', href: '/admin/videos' },
              { icon: '📚', label: '新增課程', color: '#10B981', href: '/admin/courses' },
              { icon: '📊', label: '匯出報告', color: '#F59E0B', href: '/admin/revenue' },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  background: `${action.color}15`,
                  border: `1px solid ${action.color}30`,
                }}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium text-white">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Top courses using real enrollment data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="p-6"
          style={cardBase}
        >
          <h3 className="font-bold text-white text-lg mb-4">熱門課程</h3>
          <div className="space-y-3">
            {TOP_COURSES.map((course) => (
              <div key={course.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-1.5">
                    {course.icon}
                    <span className="truncate">{course.name.split('—')[0].trim()}</span>
                  </span>
                  <span
                    className="text-xs font-medium flex-shrink-0"
                    style={{ color: course.color }}
                  >
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#2D2D44' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(course.students / MAX_STUDENTS) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: course.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Video queue from real video-queue.json data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-6"
          style={cardBase}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-lg">影片佇列</h3>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
            >
              {videoQueueData.stats.urgentCount + videoQueueData.stats.byStatus.review} 待處理
            </span>
          </div>
          <div className="space-y-3">
            {VIDEO_QUEUE.slice(0, 3).map((v) => {
              const levelColor = LEVEL_COLORS[v.course] ?? '#6B7280';
              const statusCfg = STATUS_VIDEO[v.status];
              const priorityCfg = PRIORITY_CONFIG[v.priority ?? 'medium'];
              return (
                <div
                  key={v.id}
                  className="p-3 rounded-xl"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                >
                  <p className="text-sm font-medium text-white mb-2 leading-tight">{v.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: `${levelColor}20`, color: levelColor }}
                    >
                      {v.course}
                    </span>
                    {statusCfg && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: `${statusCfg.color}20`, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                    )}
                    {priorityCfg && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: `${priorityCfg.color}20`,
                          color: priorityCfg.color,
                        }}
                      >
                        {priorityCfg.label}
                      </span>
                    )}
                  </div>
                  {v.dueDate && (
                    <p className="text-xs mt-1.5" style={{ color: '#6B7280' }}>
                      截止：{v.dueDate}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
