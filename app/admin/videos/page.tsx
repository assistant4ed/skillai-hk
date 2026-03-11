'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import videoData from '@/data/video-queue.json';
import type { Video } from '../components/types';
import { LEVEL_COLORS, LEVEL_LABELS } from '../components/types';

const videos = videoData.videos as Video[];

function getYouTubeEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const shortLink = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (shortLink) return `https://www.youtube.com/embed/${shortLink[1]}`;
  const watchParam = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watchParam) return `https://www.youtube.com/embed/${watchParam[1]}`;
  return null;
}

const KANBAN_COLUMNS: Array<{ id: Video['status']; label: string; icon: string; color: string }> = [
  { id: 'planning', label: '規劃中', icon: '📝', color: '#6B7280' },
  { id: 'scripting', label: '撰稿中', icon: '✍️', color: '#3B82F6' },
  { id: 'recording', label: '錄製中', icon: '🎬', color: '#F59E0B' },
  { id: 'editing', label: '剪輯中', icon: '✂️', color: '#8B5CF6' },
  { id: 'review', label: '審核中', icon: '👀', color: '#EF4444' },
  { id: 'published', label: '已發佈', icon: '✅', color: '#10B981' },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: '緊急', color: '#EF4444' },
  high: { label: '高', color: '#F59E0B' },
  medium: { label: '中', color: '#3B82F6' },
  low: { label: '低', color: '#6B7280' },
};

const MOCK_LIBRARY: Video[] = [
  { id: 'LIB-001', title: 'AI 基礎概念總覽', course: 'bronze', status: 'published', duration: '12 分鐘', views: 2847, youtubeUrl: 'https://youtube.com/watch?v=demo1', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: 'LIB-002', title: 'Prompt Engineering 入門', course: 'silver', status: 'published', duration: '20 分鐘', views: 1892, youtubeUrl: 'https://youtube.com/watch?v=demo2', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: 'LIB-003', title: 'LangChain Agent 實戰', course: 'gold', status: 'published', duration: '35 分鐘', views: 1234, youtubeUrl: 'https://youtube.com/watch?v=demo3', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: 'LIB-004', title: 'RAG 系統搭建', course: 'gold', status: 'published', duration: '28 分鐘', views: 987, youtubeUrl: 'https://youtube.com/watch?v=demo4', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: 'LIB-005', title: 'Fine-tuning 完全指南', course: 'platinum', status: 'published', duration: '45 分鐘', views: 756, youtubeUrl: 'https://youtube.com/watch?v=demo5', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
];

type TabType = 'kanban' | 'library' | 'upload';

interface UploadForm {
  title: string;
  course: string;
  youtubeUrl: string;
  duration: string;
  description: string;
}

const DEFAULT_UPLOAD: UploadForm = { title: '', course: 'bronze', youtubeUrl: '', duration: '', description: '' };

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('kanban');
  const [searchLibrary, setSearchLibrary] = useState('');
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>(DEFAULT_UPLOAD);
  const [uploadState, setUploadState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const queueStats = useMemo(() => ({
    total: videos.length + MOCK_LIBRARY.length,
    published: MOCK_LIBRARY.filter((v) => v.status === 'published').length + videos.filter((v) => v.status === 'published').length,
    inProduction: videos.filter((v) => ['scripting', 'recording', 'editing'].includes(v.status)).length,
    planning: videos.filter((v) => v.status === 'planning').length,
  }), []);

  const filteredLibrary = useMemo(() => {
    return MOCK_LIBRARY.filter(
      (v) =>
        searchLibrary === '' ||
        v.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
        v.course.includes(searchLibrary.toLowerCase()),
    );
  }, [searchLibrary]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadState('saving');
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadForm.title,
          course: uploadForm.course,
          youtubeUrl: uploadForm.youtubeUrl,
          duration: uploadForm.duration,
          description: uploadForm.description,
          status: 'planning',
          priority: 'medium',
        }),
      });
      if (res.ok) {
        setUploadState('saved');
        setTimeout(() => {
          setUploadState('idle');
          setUploadForm(DEFAULT_UPLOAD);
          setActiveTab('library');
        }, 1200);
      } else {
        console.error('[Videos] upload failed:', res.status, res.statusText);
        setUploadState('error');
        setTimeout(() => setUploadState('idle'), 2500);
      }
    } catch (err) {
      console.error('[Videos] network error during upload:', err);
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 2500);
    }
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            影片管理
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            管理課程影片製作流程與影片庫
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '影片總數', value: queueStats.total, icon: '🎬', color: '#7C3AED' },
          { label: '已發佈', value: queueStats.published, icon: '✅', color: '#10B981' },
          { label: '製作中', value: queueStats.inProduction, icon: '🔄', color: '#F59E0B' },
          { label: '規劃中', value: queueStats.planning, icon: '📝', color: '#3B82F6' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <span className="text-xl">{stat.icon}</span>
            <div>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                {stat.label}
              </p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}>
        {(
          [
            { id: 'kanban', label: '製作流程', icon: '📋' },
            { id: 'library', label: '影片庫', icon: '🎞️' },
            { id: 'upload', label: '上傳影片', icon: '⬆️' },
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

      {/* Kanban board */}
      {activeTab === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {KANBAN_COLUMNS.map((col) => {
              const colVideos = videos.filter((v) => v.status === col.id);
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-64 flex-shrink-0"
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
                    style={{ background: `${col.color}15`, border: `1px solid ${col.color}30` }}
                  >
                    <span>{col.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: col.color }}>
                      {col.label}
                    </span>
                    <span
                      className="ml-auto text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                      style={{ background: `${col.color}30`, color: col.color }}
                    >
                      {colVideos.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colVideos.map((video) => (
                      <KanbanCard key={video.id} video={video} colColor={col.color} />
                    ))}
                    {colVideos.length === 0 && (
                      <div
                        className="h-20 rounded-xl flex items-center justify-center text-xs"
                        style={{ border: '1px dashed #2D2D44', color: '#4B5563' }}
                      >
                        沒有影片
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#6B7280' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="搜索影片..."
              value={searchLibrary}
              onChange={(e) => setSearchLibrary(e.target.value)}
              className="w-full max-w-sm pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: '#1A1A2E', border: '1px solid #2D2D44', color: '#E5E7EB' }}
            />
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: '#0F0F1A', borderBottom: '1px solid #2D2D44' }}>
                  {['縮圖', '標題', '課程', '時長', '觀看次數', '狀態', '操作'].map((h) => (
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
                {filteredLibrary.map((video, i) => {
                  const levelColor = LEVEL_COLORS[video.course] ?? '#6B7280';
                  return (
                    <tr key={video.id} style={{ borderBottom: '1px solid #2D2D44' }}>
                      <td className="px-4 py-3">
                        <div
                          className="w-16 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                          style={{ background: '#0F0F1A' }}
                        >
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{video.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${levelColor}20`, color: levelColor }}
                        >
                          {LEVEL_LABELS[video.course] ?? video.course}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>
                          {video.duration ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium" style={{ color: '#D1D5DB' }}>
                          {(video.views ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                        >
                          已發佈
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setPreviewVideo(video)}
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' }}
                        >
                          預覽
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload form */}
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg"
        >
          <div
            className="p-6 rounded-2xl"
            style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
          >
            <h3 className="text-lg font-bold text-white mb-5">上傳新影片</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              {[
                { label: '影片標題', key: 'title', type: 'text', placeholder: '例：MCP Protocol 完全指南' },
                { label: 'YouTube URL', key: 'youtubeUrl', type: 'url', placeholder: 'https://youtube.com/watch?v=...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={uploadForm[field.key as keyof UploadForm]}
                    onChange={(e) => setUploadForm({ ...uploadForm, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                  所屬課程
                </label>
                <select
                  value={uploadForm.course}
                  onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                >
                  {['bronze', 'silver', 'gold', 'platinum', 'openclaw'].map((l) => (
                    <option key={l} value={l}>
                      {LEVEL_LABELS[l]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#9CA3AF' }}>
                  描述
                </label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#E5E7EB' }}
                  placeholder="影片描述..."
                />
              </div>
              <div
                className="flex items-center justify-center p-8 rounded-xl cursor-pointer transition-colors hover:border-purple-500"
                style={{ border: '2px dashed #2D2D44' }}
              >
                <div className="text-center">
                  <span className="text-3xl block mb-2">📄</span>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>
                    拖放 PPT 文件到此處
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    支援 .pptx, .pdf
                  </p>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={uploadState === 'saving'}
                whileHover={{ scale: uploadState === 'saving' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: uploadState === 'saved'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : uploadState === 'error'
                    ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                    : 'linear-gradient(135deg, #7C3AED, #4169E1)',
                  color: 'white',
                  opacity: uploadState === 'saving' ? 0.7 : 1,
                }}
              >
                {uploadState === 'saving' ? '上傳中...' : uploadState === 'saved' ? '✓ 已加入佇列' : uploadState === 'error' ? '上傳失敗，請重試' : '上傳影片'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Video preview modal */}
      <AnimatePresence>
        {previewVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPreviewVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black flex items-center justify-center">
                {getYouTubeEmbedUrl(previewVideo.youtubeUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(previewVideo.youtubeUrl)!}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={previewVideo.title}
                  />
                ) : (
                  <p className="text-sm" style={{ color: '#6B7280' }}>無可用影片連結</p>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white">{previewVideo.title}</p>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44', color: '#9CA3AF' }}
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanCard({ video, colColor }: { video: Video; colColor: string }) {
  const levelColor = LEVEL_COLORS[video.course] ?? '#6B7280';
  const priorityCfg = PRIORITY_CONFIG[video.priority ?? 'medium'];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-3 rounded-xl cursor-pointer"
      style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
    >
      <p className="text-xs font-medium text-white mb-2 leading-snug">{video.title}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ background: `${levelColor}20`, color: levelColor }}
        >
          {LEVEL_LABELS[video.course] ?? video.course}
        </span>
        {priorityCfg && (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: `${priorityCfg.color}20`, color: priorityCfg.color }}
          >
            {priorityCfg.label}
          </span>
        )}
      </div>
      {video.assignedTo && (
        <p className="text-xs" style={{ color: '#6B7280' }}>
          👤 {video.assignedTo}
        </p>
      )}
      {video.dueDate && (
        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
          📅 {video.dueDate}
        </p>
      )}
    </motion.div>
  );
}
