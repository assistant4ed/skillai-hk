"use client";

import AnimatedCard3D from './AnimatedCard3D';

/**
 * 3D 動畫卡片示範頁面
 * 展示多個不同主題的卡片
 */
export default function AnimatedCardDemo() {
  const cards = [
    {
      title: 'AI 技能評估',
      description: '5 分鐘完成全方位 AI 技能測評，獲得詳細分析報告和學習建議',
      icon: '🎯',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      title: '認證課程',
      description: '4 個等級認證體系，從基礎到專家，系統化提升你的 AI 競爭力',
      icon: '🎓',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: '技能市場',
      description: '展示你的 AI 技能，接受委託項目，獲得企業直聘機會',
      icon: '💼',
      gradient: 'from-pink-600 to-red-600'
    },
    {
      title: '專家社群',
      description: '與全球 10 萬+ AI 學習者交流，獲得導師 1 對 1 專業輔導',
      icon: '👥',
      gradient: 'from-orange-600 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      {/* 標題 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white mb-4">
          互動式 3D 卡片
        </h1>
        <p className="text-xl text-gray-400">
          移動鼠標體驗炫酷的 3D 效果
        </p>
      </div>
      
      {/* 卡片網格 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <AnimatedCard3D
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            gradient={card.gradient}
          />
        ))}
      </div>
      
      {/* 技術說明 */}
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          ✨ 技術特點
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="text-blue-400 mr-3">•</span>
            <span><strong>3D 透視效果:</strong> 使用 CSS transform 3D 和 perspective</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-3">•</span>
            <span><strong>鼠標跟隨:</strong> 實時計算鼠標位置，動態調整旋轉角度</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-400 mr-3">•</span>
            <span><strong>光澤效果:</strong> Radial gradient 跟隨鼠標移動</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-400 mr-3">•</span>
            <span><strong>平滑動畫:</strong> Framer Motion 彈簧動畫，自然流暢</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-3">•</span>
            <span><strong>分層渲染:</strong> translateZ 創造深度層次感</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
