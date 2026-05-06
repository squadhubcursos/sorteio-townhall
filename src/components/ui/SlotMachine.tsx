'use client';

interface SlotProps {
  name: string;
  index: number;
  spinning: boolean;
  revealed: boolean;
}

export default function SlotMachine({ name, index, spinning, revealed }: SlotProps) {
  return (
    <div
      className={`
        relative flex items-center justify-center
        h-[52px] rounded-[12px] px-3 overflow-hidden
        border transition-all duration-300
        ${revealed
          ? 'bg-[#0A84FF] border-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.5)] animate-[slotReveal_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
          : spinning
            ? 'bg-white/7 border-[#0A84FF]/60 animate-[slotSpin_0.12s_steps(1)_infinite]'
            : 'bg-white/7 border-white/10'}
      `}
    >
      <span className="absolute top-1 left-2 text-[10px] font-bold text-white/40">
        #{index + 1}
      </span>
      <span className={`text-sm font-semibold text-center ${revealed ? 'text-white' : 'text-white/70'}`}>
        {name}
      </span>
    </div>
  );
}
