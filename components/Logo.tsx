"use client";

/**
 * SkillAI Logo — Minecraft-inspired pixel blocks
 * Original design, not a copy
 */
export default function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const scales = { sm: 0.6, md: 1, lg: 1.4 };
  const s = scales[size];
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className="flex items-center" style={{ gap: `${8 * s}px` }}>
      {/* Pixel Icon */}
      <svg width={32 * s} height={36 * s} viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Layer 1 - Top face (lighter) */}
        <rect x="4" y="0" width="10" height="10" rx="1.5" fill="#5B83F5" />
        <rect x="16" y="0" width="10" height="10" rx="1.5" fill="#7BA3FF" />
        
        {/* Layer 2 - Front face (primary) */}
        <rect x="4" y="12" width="10" height="10" rx="1.5" fill="#4169E1" />
        <rect x="16" y="12" width="10" height="10" rx="1.5" fill="#5B83F5" />
        
        {/* Layer 3 - Bottom accent */}
        <rect x="4" y="24" width="10" height="10" rx="1.5" fill="#3358C8" />
        <rect x="16" y="24" width="10" height="10" rx="1.5" fill="#4169E1" />
        
        {/* Spark / AI indicator */}
        <rect x="22" y="4" width="6" height="6" rx="1" fill="#FF6B35" />
        <rect x="0" y="18" width="4" height="4" rx="0.5" fill="#FF6B35" opacity="0.6" />
      </svg>
      
      {showText && (
        <span className={`font-black tracking-tight ${textSizes[size]}`}>
          <span className="text-[#1A1A2E]">Skill</span>
          <span className="text-[#4169E1]">AI</span>
        </span>
      )}
    </div>
  );
}
