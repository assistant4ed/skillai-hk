"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedCard3DProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

/**
 * 3D 動畫卡片組件
 * - 鼠標懸停時 3D 傾斜效果
 * - 光澤跟隨鼠標移動
 * - 平滑動畫過渡
 */
export default function AnimatedCard3D({ 
  title, 
  description, 
  icon, 
  gradient 
}: AnimatedCard3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // 計算鼠標相對位置 (0-100%)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // 計算 3D 旋轉角度 (-15° 到 15°)
    const rotateYValue = ((x - 50) / 50) * 15;
    const rotateXValue = ((y - 50) / 50) * -15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlareX(x);
    setGlareY(y);
  };

  const handleMouseLeave = () => {
    // 恢復初始狀態
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  return (
    <motion.div
      className="relative w-80 h-96 cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* 背景漸變 */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
        />
        
        {/* 光澤效果 */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
        />
        
        {/* 網格圖案 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* 內容區域 */}
        <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
          {/* 圖標 */}
          <motion.div
            className="text-7xl"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}
          >
            {icon}
          </motion.div>
          
          {/* 文字內容 */}
          <div style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
            <h3 className="text-3xl font-bold mb-3">
              {title}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* 底部裝飾 */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
          />
        </div>
        
        {/* 邊框光暈 */}
        <div className="absolute inset-0 rounded-3xl border border-white/20" />
      </motion.div>
    </motion.div>
  );
}
