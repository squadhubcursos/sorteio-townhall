'use client';

const CIRCUMFERENCE = 2 * Math.PI * 78; // r=78, ≈490

interface TimerCircleProps {
  seconds: number;
  total: number;
  urgent: boolean;
}

export default function TimerCircle({ seconds, total, urgent }: TimerCircleProps) {
  const progress = seconds / total;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className={`relative inline-flex items-center justify-center ${urgent ? 'animate-[timerPulse_0.5s_ease-in-out_infinite_alternate]' : ''}`}>
      <svg width={180} height={180} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={90}
          cy={90}
          r={78}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={5}
        />
        <circle
          cx={90}
          cy={90}
          r={78}
          fill="none"
          stroke={urgent ? '#FF453A' : '#0A84FF'}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="absolute text-5xl font-bold"
        style={{ fontFamily: 'var(--font-syne)', color: urgent ? '#FF453A' : 'white' }}
      >
        {seconds}
      </span>
    </div>
  );
}
