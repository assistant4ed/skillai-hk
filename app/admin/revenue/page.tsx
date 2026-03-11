'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_COLORS } from '../components/types';
import adminStats from '@/data/admin-stats.json';
import studentsData from '@/data/students.json';

const MONTHLY_DATA = adminStats.revenueByMonth.map((d) => ({
  month: `${parseInt(d.month.split('-')[1])}月`,
  value: d.revenue,
}));

const MAX_MONTHLY = Math.max(1, ...MONTHLY_DATA.map((d) => d.value));
const ANNUAL_TOTAL = MONTHLY_DATA.reduce((sum, d) => sum + d.value, 0);

const LEVEL_META: Record<string, { label: string; price: number; color: string }> = {
  bronze:   { label: 'Bronze',   price: 1980,  color: '#CD7F32' },
  silver:   { label: 'Silver',   price: 2980,  color: '#9CA3AF' },
  gold:     { label: 'Gold',     price: 4840,  color: '#D97706' },
  platinum: { label: 'Platinum', price: 9800,  color: '#7C3AED' },
  openclaw: { label: 'OpenClaw', price: 12800, color: '#4169E1' },
};

const REVENUE_BY_LEVEL = (Object.keys(LEVEL_META) as Array<keyof typeof LEVEL_META>).map((level) => {
  const students = adminStats.enrollmentsByLevel[level as keyof typeof adminStats.enrollmentsByLevel] ?? 0;
  const revenue = adminStats.revenueByLevel[level as keyof typeof adminStats.revenueByLevel] ?? 0;
  const meta = LEVEL_META[level];
  return { level, students, revenue, avgPerStudent: meta.price, color: meta.color };
});

const TOTAL_REVENUE = Math.max(1, REVENUE_BY_LEVEL.reduce((sum, l) => sum + l.revenue, 0));

const PAYMENT_HISTORY = studentsData.students
  .flatMap((s) =>
    s.payments.map((p) => ({
      id: p.id,
      student: s.name,
      course: LEVEL_META[s.level as keyof typeof LEVEL_META]?.label ?? s.level,
      amount: p.amount,
      date: p.date,
      method: p.method,
      status: p.status,
    })),
  )
  .sort((a, b) => b.date.localeCompare(a.date));

const MONTHS = ['全部', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const STATUSES = ['全部', '已支付', '待確認', '已退款'];

const STATUS_LABEL: Record<string, string> = {
  paid: '已支付',
  pending: '待確認',
  refunded: '已退款',
};

export default function RevenuePage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1].value;
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2]?.value ?? 0;
  const growthPct = prevMonth > 0 ? Math.round(((currentMonth - prevMonth) / prevMonth) * 100) : 0;

  const filteredPayments = useMemo(() => {
    return PAYMENT_HISTORY.filter((p) => {
      const monthLabel = `${parseInt(p.date.split('-')[1])}月`;
      const matchMonth = filterMonth === '全部' || monthLabel === filterMonth;
      const statusLabel = STATUS_LABEL[p.status] ?? p.status;
      const matchStatus = filterStatus === '全部' || statusLabel === filterStatus;
      return matchMonth && matchStatus;
    });
  }, [filterMonth, filterStatus]);

  const filteredTotal = filteredPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
          收入報告
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          財務概覽與付款記錄
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: '本月收入',
            value: `HK$${(currentMonth / 10000).toFixed(0)}萬`,
            sub: `較上月 ${growthPct >= 0 ? '+' : ''}${growthPct}%`,
            icon: '📈',
            color: '#10B981',
          },
          {
            label: '年度收入',
            value: `HK$${(ANNUAL_TOTAL / 1000000).toFixed(1)}M`,
            sub: '過去 12 個月',
            icon: '💰',
            color: '#7C3AED',
          },
          {
            label: '年度增長',
            value: '+23%',
            sub: '較去年同期',
            icon: '🚀',
            color: '#F59E0B',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6"
              style={{ background: stat.color }}
            />
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}
            >
              {stat.icon}
            </div>
            <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: stat.color }}>
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 12-month chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-white text-lg">年度收入趨勢</h3>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              過去 12 個月月收入
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
          >
            總計 HK${(ANNUAL_TOTAL / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="flex items-end gap-2 h-48">
          {MONTHLY_DATA.map((d, i) => {
            const heightPct = (d.value / MAX_MONTHLY) * 100;
            const isHovered = hoveredBar === i;
            const isLast = i === MONTHLY_DATA.length - 1;

            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs px-2 py-1 rounded font-medium whitespace-nowrap"
                    style={{ background: '#1A1A2E', color: '#E9D5FF', border: '1px solid #2D2D44' }}
                  >
                    HK${(d.value / 10000).toFixed(0)}萬
                  </motion.div>
                )}
                {!isHovered && <div className="h-6" />}

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: 0.2 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-lg"
                  style={{
                    background: isHovered || isLast
                      ? 'linear-gradient(180deg, #A78BFA, #7C3AED)'
                      : 'rgba(124,58,237,0.35)',
                    transition: 'background 0.2s',
                  }}
                />
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Revenue by level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #2D2D44' }}>
          <h3 className="font-bold text-white text-lg">各等級收入分析</h3>
        </div>
        <div className="p-6 space-y-4">
          {REVENUE_BY_LEVEL.map((item, i) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                    style={{ background: `${item.color}20`, color: item.color }}
                  >
                    {item.level}
                  </span>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>
                    {item.students.toLocaleString()} 學員
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    HK${(item.revenue / 10000).toFixed(0)}萬
                  </span>
                  <span className="text-xs ml-2" style={{ color: '#6B7280' }}>
                    ({Math.round((item.revenue / TOTAL_REVENUE) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="h-2.5 rounded-full" style={{ background: '#2D2D44' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.revenue / TOTAL_REVENUE) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
      >
        <div className="px-6 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid #2D2D44' }}>
          <h3 className="font-bold text-white text-lg flex-1">近期付款記錄</h3>
          {/* Month filter */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg outline-none"
            style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
          >
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg outline-none"
            style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Filter summary */}
          {(filterMonth !== '全部' || filterStatus !== '全部') && (
            <span className="text-xs" style={{ color: '#10B981' }}>
              {filteredPayments.length} 筆 · HK${filteredTotal.toLocaleString()}
            </span>
          )}
          <a
            href="/api/admin/export?type=revenue"
            download="revenue.csv"
            className="text-xs px-3 py-1.5 rounded-lg transition-all inline-block"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            📥 匯出 CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #2D2D44', background: '#0F0F1A' }}>
                {['學員', '課程', '金額', '日期', '支付方式', '狀態'].map((h) => (
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
              {filteredPayments.map((p, i) => {
                const courseLevel = Object.keys(LEVEL_COLORS).find(
                  (k) => p.course.toLowerCase() === k,
                );
                const levelColor = courseLevel ? LEVEL_COLORS[courseLevel] : '#9CA3AF';

                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #2D2D44' }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {p.student}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${levelColor}20`, color: levelColor }}
                      >
                        {p.course}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: p.status === 'refunded' ? '#EF4444' : '#10B981' }}>
                      {p.status === 'refunded' ? '-' : ''}HK${p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#9CA3AF' }}>
                      {p.date}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#9CA3AF' }}>
                      {p.method}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit"
                        style={{
                          background: p.status === 'paid' ? 'rgba(16,185,129,0.15)' : p.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: p.status === 'paid' ? '#10B981' : p.status === 'pending' ? '#F59E0B' : '#EF4444',
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: p.status === 'paid' ? '#10B981' : p.status === 'pending' ? '#F59E0B' : '#EF4444' }}
                        />
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
