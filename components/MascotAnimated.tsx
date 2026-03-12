"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

type MascotVariant = 'wave' | 'bounce' | 'peek' | 'float' | 'spin' | 'nod' | 'thumbsup';
type MascotSize = 'xs' | 'sm' | 'md' | 'lg';

const sizes: Record<MascotSize, number> = { xs: 48, sm: 80, md: 140, lg: 240 };

const variants: Record<MascotVariant, object> = {
  wave: {
    animate: { rotate: [0, 14, -8, 14, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 },
  },
  bounce: {
    animate: { y: [0, -12, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  peek: {
    initial: { x: 60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  float: {
    animate: { y: [0, -8, 0], rotate: [0, 2, -2, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  spin: {
    animate: { rotateY: [0, 360] },
    transition: { duration: 6, repeat: Infinity, ease: 'linear' },
  },
  nod: {
    animate: { rotateZ: [0, 5, -3, 5, 0], scale: [1, 1.02, 1] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 },
  },
  thumbsup: {
    animate: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 },
  },
};

interface MascotProps {
  variant?: MascotVariant;
  size?: MascotSize;
  className?: string;
  showGlow?: boolean;
  showBlocks?: boolean;
  label?: string;
}

export default function MascotAnimated({
  variant = 'float',
  size = 'md',
  className = '',
  showGlow = false,
  showBlocks = false,
  label,
}: MascotProps) {
  const s = sizes[size];
  const v = variants[variant];
  const animProps = v as any;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Glow effect */}
      {showGlow && (
        <div className="absolute -inset-4 bg-gradient-to-br from-[#4169E1]/20 to-[#7C3AED]/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
      )}

      {/* Floating blocks */}
      {showBlocks && (
        <>
          <motion.div animate={{ y: [-6, 6, -6], rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity }} 
            className="absolute -top-2 -left-2 w-4 h-4 bg-[#FF6B35] rounded-md opacity-70 z-10" />
          <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#10B981] rounded-sm opacity-60 z-10" />
          <motion.div animate={{ y: [-3, 3, -3], x: [2, -2, 2] }} transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 -right-3 w-2.5 h-2.5 bg-[#7C3AED] rounded-sm opacity-50 z-10" />
        </>
      )}

      {/* Mascot */}
      <motion.div {...animProps} className="relative z-0">
        <Image src="/mascot.jpg" alt="SkillAI mascot character wearing glasses and a branded shirt, representing the AI skills training platform" width={s} height={s}
          className="rounded-xl shadow-lg" style={{ width: s, height: s, objectFit: 'cover' }} />
      </motion.div>

      {/* Optional label */}
      {label && (
        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-2 text-xs font-semibold text-[#4169E1] bg-[#EBF0FF] px-3 py-1 rounded-full">
          {label}
        </motion.span>
      )}
    </div>
  );
}
