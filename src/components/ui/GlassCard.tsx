import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-white/7 backdrop-blur-[24px] border border-white/10 rounded-[18px] ${className}`}>
      {children}
    </div>
  );
}
