"use client";

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * 全息毛玻璃卡片
 * - 3D 透視跟隨鼠標
 * - 全息光澤掃過效果
 * - 邊緣發光
 * - 浮動陰影
 */
export default function GlassmorphismCard({
  children,
  className = '',
  glowColor = '#00D9FF',
  intensity = 'medium'
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring 物理動畫
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // 光澤位置
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);
  
  const intensityMap = {
    low: { blur: 8, bg: 0.03, border: 0.08, glow: 0.15 },
    medium: { blur: 16, bg: 0.05, border: 0.12, glow: 0.25 },
    high: { blur: 24, bg: 0.08, border: 0.18, glow: 0.4 }
  };
  
  const config = intensityMap[intensity];
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative group ${className}`}
    >
      {/* 外層光暈 */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}40, transparent 60%)`,
        }}
      />
      
      {/* 主卡片 */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          backdropFilter: `blur(${config.blur}px)`,
          WebkitBackdropFilter: `blur(${config.blur}px)`,
          background: `rgba(255, 255, 255, ${config.bg})`,
          border: `1px solid rgba(255, 255, 255, ${config.border})`,
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px ${glowColor}${Math.round(config.glow * 255).toString(16)}`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* 全息光澤效果 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(
              105deg,
              transparent 40%,
              rgba(255, 255, 255, 0.03) 45%,
              rgba(255, 255, 255, 0.06) 50%,
              rgba(255, 255, 255, 0.03) 55%,
              transparent 60%
            )`,
            backgroundSize: '200% 200%',
            backgroundPosition: useTransform(
              mouseX,
              [-0.5, 0.5],
              ['100% 100%', '0% 0%']
            ),
          }}
        />
        
        {/* 彩虹折射效果 */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(0, 217, 255, 0.1) 0%,
                rgba(192, 38, 211, 0.1) 25%,
                rgba(59, 130, 246, 0.1) 50%,
                rgba(139, 92, 246, 0.1) 75%,
                rgba(0, 217, 255, 0.1) 100%
              )
            `,
          }}
        />
        
        {/* 頂部高光 */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${config.border * 2}), transparent)`
          }}
        />
        
        {/* 內容 */}
        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 認證卡片 - 專用的全息認證卡
 */
export function CertificationCard({
  level,
  title,
  icon,
  price,
  features,
  gradient,
  popular = false
}: {
  level: string;
  title: string;
  icon: string;
  price: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}) {
  const gradientColors: Record<string, string> = {
    bronze: '#F59E0B',
    silver: '#9CA3AF',
    gold: '#FBBF24',
    platinum: '#C026D3',
  };
  
  const glowColor = gradientColors[level.toLowerCase()] || '#00D9FF';
  
  return (
    <GlassmorphismCard
      glowColor={glowColor}
      intensity={popular ? 'high' : 'medium'}
      className={popular ? 'scale-105' : ''}
    >
      <div className="p-8">
        {/* Popular 標籤 */}
        {popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div className={`bg-gradient-to-r ${gradient} text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg`}>
              最受歡迎
            </div>
          </div>
        )}
        
        {/* 圖標 */}
        <motion.div
          className="text-6xl mb-6"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>
        
        {/* 級別徽章 */}
        <div className={`inline-block bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
          {level}
        </div>
        
        {/* 標題 */}
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
        
        {/* 功能列表 */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center text-sm text-gray-300"
            >
              <svg className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </motion.li>
          ))}
        </ul>
        
        {/* 價格 */}
        <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-6`}>
          {price}
        </div>
        
        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          了解詳情
        </motion.button>
      </div>
    </GlassmorphismCard>
  );
}
