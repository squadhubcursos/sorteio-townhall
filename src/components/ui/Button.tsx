'use client';
import { ButtonHTMLAttributes } from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'tinted'
  | 'ghost'
  | 'danger'
  | 'timer-start'
  | 'timer-pause'
  | 'timer-next';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-[#2897ff] via-[#0A84FF] to-[#0070e8] text-white shadow-[0_0_24px_rgba(10,132,255,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(10,132,255,0.6)]',
  secondary: 'bg-white/10 text-white/52 hover:bg-white/15',
  tinted: 'bg-[rgba(10,132,255,0.14)] text-[#0A84FF] hover:bg-[rgba(10,132,255,0.22)]',
  ghost: 'bg-white/10 text-white/52 hover:bg-white/15',
  danger: 'bg-[rgba(255,69,58,0.12)] text-[#FF453A] hover:bg-[rgba(255,69,58,0.2)]',
  'timer-start':
    'bg-gradient-to-b from-[#34d672] via-[#30D158] to-[#28b84c] text-white shadow-[0_0_20px_rgba(48,209,88,0.4)]',
  'timer-pause':
    'bg-gradient-to-b from-[#ffb340] via-[#FF9F0A] to-[#e08a00] text-white shadow-[0_0_20px_rgba(255,159,10,0.4)]',
  'timer-next':
    'bg-gradient-to-b from-[#2897ff] via-[#0A84FF] to-[#0070e8] text-white shadow-[0_0_20px_rgba(10,132,255,0.4)]',
};

export default function Button({ variant = 'secondary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        rounded-[100px] px-5 py-2.5 font-medium text-sm
        transition-all duration-200
        active:scale-[0.96]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${className}
      `}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)', ...props.style }}
    >
      {children}
    </button>
  );
}
