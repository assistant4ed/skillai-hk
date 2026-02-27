"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                🏆 全球首創 AI 技能認證平台
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              掌握 <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">AI 技能</span>
              <br />
              引領未來職場
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              國際認可認證 | 個人化學習路徑 | 95% 就業率提升
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              從零基礎到 AI 專家，我們為你打造專屬的 AI 技能成長藍圖
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/75 transition-all"
              >
                免費技能評估
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800/50 backdrop-blur-sm text-white px-10 py-4 rounded-lg font-bold text-lg border-2 border-purple-500/50 hover:border-purple-500 transition-all"
              >
                探索認證課程
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '100,000+', label: '認證學員遍布全球', icon: '👥' },
              { number: '95%', label: '學員就業率提升', icon: '📈' },
              { number: '500+', label: '合作企業夥伴', icon: '🏢' },
              { number: '4.9/5', label: '學員滿意度評分', icon: '⭐' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification System */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              國際認可的 <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">認證體系</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              四個等級，從基礎到專家，系統化提升你的 AI 競爭力
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                level: 'Bronze',
                title: 'AI 基礎應用專家',
                color: 'from-amber-600 to-amber-800',
                icon: '🥉',
                skills: ['Prompt Engineering', 'ChatGPT 實戰', 'AI 工具應用', '職場效率提升'],
                price: '$2,999'
              },
              {
                level: 'Silver',
                title: 'AI 應用解決方案專家',
                color: 'from-gray-400 to-gray-600',
                icon: '🥈',
                skills: ['AI Marketing', '數據分析', '流程自動化', 'No-Code AI'],
                price: '$7,999'
              },
              {
                level: 'Gold',
                title: 'AI 系統架構師',
                color: 'from-yellow-400 to-yellow-600',
                icon: '🥇',
                skills: ['AI Agent 開發', 'LangChain 深度', '模型微調', '系統整合'],
                price: '$15,999'
              },
              {
                level: 'Platinum',
                title: 'AI 創業領袖',
                color: 'from-purple-400 to-purple-600',
                icon: '💎',
                skills: ['AI 產品開發', '商業模式', '融資策略', '團隊建設'],
                price: '$29,999'
              }
            ].map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl transition-opacity" />
                <div className="relative bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all h-full">
                  {/* Badge */}
                  <div className={`inline-block bg-gradient-to-r ${cert.color} text-white px-4 py-1 rounded-full text-sm font-bold mb-4`}>
                    {cert.level}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-4">{cert.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 text-white">{cert.title}</h3>

                  {/* Skills */}
                  <ul className="space-y-2 mb-6">
                    {cert.skills.map((skill, j) => (
                      <li key={j} className="text-gray-300 text-sm flex items-start">
                        <span className="text-cyan-400 mr-2">✓</span>
                        {skill}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    {cert.price}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    了解詳情
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              準備好開啟你的 <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">AI 職涯</span>了嗎？
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              加入 100,000+ 認證學員，用 AI 技能改變你的未來
            </p>

            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl max-w-md mx-auto border border-cyan-500/30">
              <h3 className="text-2xl font-bold mb-4">免費獲得</h3>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">✅</span>
                  <span>5 分鐘 AI 技能評估</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">✅</span>
                  <span>個人化學習路徑報告</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">✅</span>
                  <span>HK$500 課程優惠券</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">✅</span>
                  <span>職涯諮詢（價值 HK$2,000）</span>
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-cyan-500/50 hover:scale-105 transition-transform">
                立即免費評估 →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto text-center text-gray-400">
          <p className="mb-4">© 2026 SkillAI.hk. All rights reserved.</p>
          <p className="text-sm">掌握 AI 技能，引領未來職場</p>
        </div>
      </footer>
    </main>
  );
}
