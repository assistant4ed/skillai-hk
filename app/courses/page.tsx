"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CoursesPage() {
  const certifications = [
    {
      id: 'bronze',
      level: 'Bronze',
      title: 'AI 基礎應用認證',
      subtitle: '掌握 AI 工具，提升工作效率',
      price: 'HK$2,999',
      duration: '4 週',
      gradient: 'from-amber-500 to-orange-600',
      icon: '🥉',
      skills: [
        'Prompt Engineering 基礎',
        'ChatGPT 實戰應用',
        '職場效率提升 10 倍',
        'AI 工具整合流程',
        'Midjourney 圖像生成',
        'AI 寫作與內容創作'
      ],
      modules: [
        { name: 'AI 基礎概念', hours: 8 },
        { name: 'Prompt 工程實戰', hours: 12 },
        { name: '辦公自動化', hours: 10 },
        { name: '項目實戰', hours: 10 }
      ],
      outcomes: [
        '提升工作效率 300%',
        '自動化日常任務',
        '掌握 10+ AI 工具',
        '獲得國際認證'
      ]
    },
    {
      id: 'silver',
      level: 'Silver',
      title: 'AI 應用專家認證',
      subtitle: '深度應用 AI，成為領域專家',
      price: 'HK$7,999',
      duration: '8 週',
      gradient: 'from-gray-300 to-gray-500',
      icon: '🥈',
      skills: [
        'AI Marketing 策略',
        '數據分析與洞察',
        '業務流程自動化',
        'AI 產品設計',
        'LLM 應用開發',
        '團隊 AI 轉型'
      ],
      modules: [
        { name: 'AI 營銷實戰', hours: 15 },
        { name: '數據驅動決策', hours: 15 },
        { name: '流程自動化', hours: 15 },
        { name: '高級項目', hours: 15 }
      ],
      outcomes: [
        '設計 AI 驅動產品',
        '提升團隊生產力',
        '數據分析能力',
        '行業專家認證'
      ]
    },
    {
      id: 'gold',
      level: 'Gold',
      title: 'AI 系統架構師認證',
      subtitle: '構建 AI 系統，引領技術創新',
      price: 'HK$15,999',
      duration: '12 週',
      gradient: 'from-yellow-400 to-yellow-600',
      icon: '🥇',
      popular: true,
      skills: [
        'AI Agent 系統開發',
        'LangChain 深度應用',
        'RAG 系統架構',
        '向量數據庫應用',
        'API 整合開發',
        '企業級 AI 方案'
      ],
      modules: [
        { name: 'AI 系統設計', hours: 20 },
        { name: 'Agent 開發', hours: 20 },
        { name: 'RAG 實戰', hours: 20 },
        { name: '企業項目', hours: 20 }
      ],
      outcomes: [
        '構建完整 AI 系統',
        '開發智能 Agent',
        '企業級方案能力',
        '技術領導認證'
      ]
    },
    {
      id: 'platinum',
      level: 'Platinum',
      title: 'AI 創業領袖認證',
      subtitle: 'AI 創業，打造獨角獸',
      price: 'HK$29,999',
      duration: '16 週',
      gradient: 'from-purple-400 to-pink-600',
      icon: '💎',
      skills: [
        'AI 產品從 0 到 1',
        '商業模式設計',
        '融資與路演',
        '團隊組建管理',
        '市場定位策略',
        '規模化增長'
      ],
      modules: [
        { name: 'AI 創業策略', hours: 25 },
        { name: '產品開發', hours: 30 },
        { name: '商業運營', hours: 25 },
        { name: '融資與擴張', hours: 20 }
      ],
      outcomes: [
        '完整 AI 產品上線',
        '融資計劃書',
        '團隊管理能力',
        '創業領袖認證'
      ]
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              AI 技能認證
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                四級進階體系
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              從基礎到專家，系統化提升你的 AI 競爭力
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {cert.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full z-10">
                    ⭐ 最受歡迎
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/30 hover:bg-white/10 transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl">{cert.icon}</div>
                    <div className={`bg-gradient-to-r ${cert.gradient} text-white text-sm font-bold px-4 py-1 rounded-full`}>
                      {cert.level}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-2">{cert.title}</h3>
                  <p className="text-gray-400 mb-6">{cert.subtitle}</p>

                  {/* Info */}
                  <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{cert.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span>{cert.modules.length} 模組</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">核心技能</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {cert.skills.map((skill, i) => (
                        <div key={i} className="flex items-start text-sm">
                          <span className="text-blue-400 mr-2">•</span>
                          <span className="text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">學習成果</h4>
                    <div className="space-y-2">
                      {cert.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-6 border-t border-white/10">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${cert.gradient} bg-clip-text text-transparent mb-4`}>
                      {cert.price}
                    </div>
                    <Link href={`/courses/${cert.id}`}>
                      <button className="w-full bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white py-3 rounded-xl font-semibold transition-all">
                        了解詳情 →
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            不確定選哪個？
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            完成免費技能評估，我們為你推薦最適合的認證課程
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
            免費技能評估 →
          </button>
        </div>
      </section>
    </div>
  );
}
