'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'general', label: '一般設定', icon: '⚙️' },
  { id: 'notifications', label: '通知設定', icon: '🔔' },
  { id: 'ai', label: 'AI 導師設定', icon: '🤖' },
  { id: 'integrations', label: '整合設定', icon: '🔗' },
];

const SETTINGS_STORAGE_KEY = 'skillai-admin-settings';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const [aiModel, setAiModel] = useState('claude-opus-4-6');
  const [maxTokens, setMaxTokens] = useState('500');
  const [whatsappNumber, setWhatsappNumber] = useState('+85267552667');
  const [platformName, setPlatformName] = useState('SkillAI.hk');
  const [notifyEnrollment, setNotifyEnrollment] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);
  const [notifyCompletion, setNotifyCompletion] = useState(false);
  const [notifyAiError, setNotifyAiError] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const s = JSON.parse(stored) as Record<string, string>;
        if (s.aiModel) setAiModel(s.aiModel);
        if (s.maxTokens) setMaxTokens(s.maxTokens);
        if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
        if (s.platformName) setPlatformName(s.platformName);
        if (s.notifyEnrollment !== undefined) setNotifyEnrollment(s.notifyEnrollment === 'true');
        if (s.notifyPayment !== undefined) setNotifyPayment(s.notifyPayment === 'true');
        if (s.notifyCompletion !== undefined) setNotifyCompletion(s.notifyCompletion === 'true');
        if (s.notifyAiError !== undefined) setNotifyAiError(s.notifyAiError === 'true');
      }
    } catch (err) {
      console.warn('Failed to parse settings from localStorage:', err);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          aiModel,
          maxTokens,
          whatsappNumber,
          platformName,
          notifyEnrollment: String(notifyEnrollment),
          notifyPayment: String(notifyPayment),
          notifyCompletion: String(notifyCompletion),
          notifyAiError: String(notifyAiError),
        }),
      );
    } catch (err) {
      console.warn('Failed to save settings to localStorage:', err);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
          系統設定
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          管理平台設定、AI 導師配置及整合
        </p>
      </div>

      <div className="flex gap-6">
        {/* Section nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                background: activeSection === s.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: activeSection === s.id ? '#7C3AED' : '#9CA3AF',
                border: activeSection === s.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Settings panel */}
        <div className="flex-1 rounded-2xl p-6 space-y-6" style={{ background: '#1A1A2E', border: '1px solid #2D2D44' }}>
          {activeSection === 'general' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white">一般設定</h3>
              <Field label="平台名稱">
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                />
              </Field>
              <Field label="WhatsApp 聯絡號碼">
                <input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                />
              </Field>
              <Field label="時區">
                <select
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                  defaultValue="Asia/Hong_Kong"
                >
                  <option value="Asia/Hong_Kong">Asia/Hong_Kong (UTC+8)</option>
                  <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  <option value="UTC">UTC</option>
                </select>
              </Field>
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white">AI 導師設定</h3>
              <Field label="AI 模型">
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                >
                  <option value="claude-opus-4-6">claude-opus-4-6 (推薦)</option>
                  <option value="claude-sonnet-4-6">claude-sonnet-4-6 (快速)</option>
                  <option value="claude-haiku-4-5-20251001">claude-haiku-4-5 (低成本)</option>
                </select>
              </Field>
              <Field label="最大 Token 數">
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  min={100}
                  max={2000}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
                  style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}
                />
              </Field>
              <div className="p-4 rounded-xl text-xs" style={{ background: '#0F0F1A', color: '#6B7280', border: '1px solid #2D2D44' }}>
                <p className="font-semibold text-white mb-1">API Key 狀態</p>
                <p>ANTHROPIC_API_KEY 已在環境變數設定。如需更換，請修改 <code className="text-purple-400">.env.local</code> 文件。</p>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white">通知設定</h3>
              {([
                { label: '新學員報名通知', checked: notifyEnrollment, onChange: setNotifyEnrollment },
                { label: '付款確認通知', checked: notifyPayment, onChange: setNotifyPayment },
                { label: '課程完成通知', checked: notifyCompletion, onChange: setNotifyCompletion },
                { label: 'AI 導師錯誤通知', checked: notifyAiError, onChange: setNotifyAiError },
              ] as const).map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #2D2D44' }}>
                  <span className="text-sm text-white">{item.label}</span>
                  <ToggleSwitch checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-white">整合設定</h3>
              {[
                { name: 'WhatsApp Business', status: 'connected', color: '#10B981' },
                { name: 'Google Analytics', status: 'connected', color: '#10B981' },
                { name: 'Stripe 支付', status: 'pending', color: '#F59E0B' },
                { name: 'Zoom 視訊', status: 'not_connected', color: '#6B7280' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#0F0F1A', border: '1px solid #2D2D44' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: item.color }}>
                      {item.status === 'connected' ? '已連接' : item.status === 'pending' ? '設定中' : '未連接'}
                    </p>
                  </div>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: '#2D2D44', color: '#9CA3AF' }}
                  >
                    {item.status === 'connected' ? '管理' : '連接'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex items-center gap-3" style={{ borderTop: '1px solid #2D2D44' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#7C3AED' }}
            >
              儲存設定
            </motion.button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm"
                style={{ color: '#10B981' }}
              >
                ✓ 已儲存
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{label}</span>
      {children}
    </label>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-10 h-6 rounded-full transition-colors"
      style={{ background: checked ? '#7C3AED' : '#2D2D44' }}
    >
      <motion.div
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full"
      />
    </button>
  );
}
