"use client";

import { motion } from 'framer-motion';
import { use } from 'react';

interface CourseDetailProps {
  params: Promise<{ level: string }>;
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const { level } = use(params);
  
  // Course data (would normally come from API/database)
  const courseData: Record<string, any> = {
    bronze: {
      level: 'Bronze',
      title: 'AI 基礎應用認證',
      subtitle: '掌握 AI 工具，提升工作效率 10 倍',
      price: 'HK$2,999',
      gradient: 'from-amber-500 to-orange-600',
      icon: '🥉',
      duration: '4 週',
      effort: '每週 10 小時',
      language: '粵語/國語',
      certificate: '國際認可證書',
      overview: 'Bronze 認證專為職場新手設計，幫助你快速掌握 AI 工具，大幅提升工作效率。無需編程基礎，4 週即可完成轉型。',
      modules: [
        {
          week: 1,
          title: 'AI 基礎與 Prompt Engineering',
          topics: [
            'AI 發展歷史與現況',
            'ChatGPT 基礎使用',
            'Prompt 編寫技巧',
            '實戰：撰寫專業郵件'
          ],
          hours: 10
        },
        {
          week: 2,
          title: '辦公自動化實戰',
          topics: [
            'Excel 數據分析自動化',
            'PPT 生成與美化',
            '報告撰寫加速',
            '實戰：月度報告自動化'
          ],
          hours: 10
        },
        {
          week: 3,
          title: 'AI 創作工具應用',
          topics: [
            'Midjourney 圖像生成',
            'AI 視頻製作',
            '內容創作流程',
            '實戰：社交媒體內容生成'
          ],
          hours: 10
        },
        {
          week: 4,
          title: '綜合項目與認證',
          topics: [
            'AI 工具整合',
            '個人工作流優化',
            '項目實戰',
            '認證考試'
          ],
          hours: 10
        }
      ],
      instructors: [
        {
          name: 'Dr. Sarah Chen',
          role: 'AI 應用專家',
          bio: '前 Google AI 研究員，10 年 AI 教學經驗',
          image: '👩‍🏫'
        },
        {
          name: 'Michael Wong',
          role: 'Prompt Engineering 導師',
          bio: 'OpenAI 認證講師，培訓 5000+ 學員',
          image: '👨‍💼'
        }
      ],
      testimonials: [
        {
          name: '王小明',
          role: '市場經理',
          company: '某科技公司',
          quote: '完成 Bronze 認證後，我的工作效率提升了 300%！現在每天可以節省 3 小時。',
          rating: 5
        },
        {
          name: 'Lisa Chan',
          role: '人力資源專員',
          company: '金融機構',
          quote: 'AI 工具讓我從繁瑣的文書工作中解放出來，現在可以專注於更有價值的工作。',
          rating: 5
        }
      ],
      faq: [
        {
          q: '需要編程基礎嗎？',
          a: '完全不需要！Bronze 認證專為非技術背景人士設計，只要會使用電腦即可。'
        },
        {
          q: '課程形式是什麼？',
          a: '線上錄播視頻 + 每週直播答疑 + 實戰作業 + 導師批改。'
        },
        {
          q: '證書國際認可嗎？',
          a: '是的！我們的證書獲得全球 500+ 企業認可，並記錄在區塊鏈上。'
        },
        {
          q: '學不會怎麼辦？',
          a: '我們提供 1 年內免費重修，並有專業導師全程輔導。'
        }
      ]
    },
    // Add other levels (silver, gold, platinum) similarly
  };

  const course = courseData[level] || courseData.bronze;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-20`} />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={`inline-block bg-gradient-to-r ${course.gradient} text-white text-sm font-bold px-4 py-2 rounded-full mb-4`}>
                {course.level} 認證
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                {course.subtitle}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm text-gray-400">課程時長</div>
                  <div className="font-semibold">{course.duration}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm text-gray-400">學習投入</div>
                  <div className="font-semibold">{course.effort}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="text-sm text-gray-400">授課語言</div>
                  <div className="font-semibold">{course.language}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-sm text-gray-400">獲得證書</div>
                  <div className="font-semibold">{course.certificate}</div>
                </div>
              </div>

              <div className={`text-5xl font-bold bg-gradient-to-r ${course.gradient} bg-clip-text text-transparent mb-6`}>
                {course.price}
              </div>

              <div className="flex gap-4">
                <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                  立即報名
                </button>
                <button className="bg-white/10 border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition">
                  免費試聽
                </button>
              </div>
            </motion.div>

            {/* Right: Preview Image/Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className={`aspect-video bg-gradient-to-br ${course.gradient} rounded-2xl flex items-center justify-center text-9xl`}>
                {course.icon}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">課程概述</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {course.overview}
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">課程大綱</h2>
          
          <div className="space-y-6">
            {course.modules.map((module: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">第 {module.week} 週</div>
                    <h3 className="text-2xl font-bold">{module.title}</h3>
                  </div>
                  <div className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                    {module.hours} 小時
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {module.topics.map((topic: string, i: number) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">導師團隊</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {course.instructors.map((instructor: any, index: number) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-8xl mb-4">{instructor.image}</div>
                <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                <div className="text-blue-400 mb-4">{instructor.role}</div>
                <p className="text-gray-300">{instructor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">學員評價</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {course.testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-black/50 border border-white/10 rounded-2xl p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role} @ {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">常見問題</h2>
          
          <div className="space-y-6">
            {course.faq.map((item: any, index: number) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-3">{item.q}</h3>
                <p className="text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">準備好開始了嗎？</h2>
          <p className="text-xl text-gray-300 mb-8">
            加入 100,000+ 認證學員，用 AI 技能改變你的未來
          </p>
          <button className="bg-white text-black px-12 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
            立即報名 {course.level} 認證 →
          </button>
        </div>
      </section>
    </div>
  );
}
