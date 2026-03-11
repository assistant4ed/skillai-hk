'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import adminStats from '@/data/admin-stats.json';

const NOTIFICATIONS = adminStats.recentActivity.slice(0, 6).map((a) => ({
  id: a.id,
  text: a.studentName ? `${a.studentName} — ${a.action}` : a.action,
  time: a.timestamp,
  read: false,
}));

interface NavItem {
  href: string;
  icon: string;
  label: string;
  sublabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', icon: '📊', label: '儀表板', sublabel: 'Dashboard' },
  { href: '/admin/crm', icon: '👥', label: '學員 CRM', sublabel: 'Students' },
  { href: '/admin/courses', icon: '📚', label: '課程管理', sublabel: 'Courses' },
  { href: '/admin/videos', icon: '🎬', label: '影片管理', sublabel: 'Videos' },
  { href: '/admin/ppt', icon: '📑', label: 'PPT 內容', sublabel: 'Content' },
  { href: '/admin/revenue', icon: '💰', label: '收入報告', sublabel: 'Revenue' },
];

const SETTINGS_ITEM: NavItem = {
  href: '/admin/settings',
  icon: '⚙️',
  label: '設定',
  sublabel: 'Settings',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length;

  const handleBellClick = () => {
    setShowNotifs((prev) => !prev);
    if (!showNotifs) {
      setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#0F0F1A', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 overflow-hidden"
        style={{ background: '#13131F', borderRight: '1px solid #2D2D44' }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          isActive={isActive}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-full z-50 lg:hidden flex flex-col"
            style={{ width: 240, background: '#13131F', borderRight: '1px solid #2D2D44' }}
          >
            <SidebarContent
              isCollapsed={false}
              isActive={isActive}
              onToggle={() => setIsMobileOpen(false)}
              isMobileClose
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 72 : 240 }}
      >
        {/* Top header */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(15,15,26,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid #2D2D44',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1
                className="font-bold text-white text-lg leading-none"
                style={{ letterSpacing: '-0.02em' }}
              >
                SkillAI.hk
                <span
                  className="ml-2 text-sm font-medium"
                  style={{ color: '#7C3AED' }}
                >
                  管理後台
                </span>
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell with dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 rounded-lg transition-all hover:bg-white/10"
                aria-label={`通知 ${unreadCount > 0 ? `(${unreadCount} 未讀)` : ''}`}
              >
                <svg className="w-5 h-5" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: '#EF4444', padding: '0 3px' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #2D2D44' }}>
                      <span className="text-sm font-bold text-white">最新通知</span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>全部已讀</span>
                    </div>
                    <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} className="px-4 py-3 flex gap-3 items-start">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                            style={{ background: '#2D2D44' }}
                          >
                            📌
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white leading-snug">{n.text}</p>
                            <p className="text-[10px] mt-1" style={{ color: '#4B5563' }}>
                              {new Date(n.time).toLocaleDateString('zh-HK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid #2D2D44' }}>
                      <Link href="/admin/crm" className="text-xs" style={{ color: '#7C3AED' }} onClick={() => setShowNotifs(false)}>
                        查看全部動態 →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin avatar */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4169E1)' }}
              >
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">Admin</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  admin@skillai.hk
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
                style={{ color: '#6B7280' }}
                aria-label="登出"
              >
                登出
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
  isActive: (href: string) => boolean;
  onToggle: () => void;
  isMobileClose?: boolean;
}

function SidebarContent({ isCollapsed, isActive, onToggle, isMobileClose }: SidebarContentProps) {
  return (
    <>
      {/* Logo / brand area */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid #2D2D44', minHeight: 72 }}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4169E1)' }}
              >
                🦞
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">SkillAI.hk</p>
                <p className="text-xs mt-0.5" style={{ color: '#7C3AED' }}>
                  管理後台
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="p-2 rounded-lg transition-all hover:bg-white/10 ml-auto"
          aria-label={isMobileClose ? 'Close menu' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className="w-4 h-4 transition-transform"
            style={{ color: '#6B7280', transform: isMobileClose ? 'none' : isCollapsed ? 'rotate(180deg)' : 'none' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="p-3" style={{ borderTop: '1px solid #2D2D44' }}>
        <NavLink item={SETTINGS_ITEM} isActive={isActive(SETTINGS_ITEM.href)} isCollapsed={isCollapsed} />
      </div>
    </>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative group"
        style={{
          background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
          color: isActive ? '#A78BFA' : '#9CA3AF',
          border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
        }}
      >
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
            style={{ background: '#7C3AED' }}
          />
        )}

        <span className="text-lg flex-shrink-0">{item.icon}</span>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-sm font-medium leading-none truncate" style={{ color: isActive ? '#E9D5FF' : '#D1D5DB' }}>
                {item.label}
              </span>
              <span className="text-xs mt-0.5 truncate" style={{ color: isActive ? '#A78BFA' : '#6B7280' }}>
                {item.sublabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <div
            className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
            style={{ background: '#1A1A2E', color: '#E9D5FF', border: '1px solid #2D2D44', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {item.label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
