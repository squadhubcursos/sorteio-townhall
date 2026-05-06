'use client';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative flex-shrink-0 w-[22px] h-[22px] rounded-full
          transition-all duration-[250ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
          ${checked
            ? 'bg-[#0A84FF] border border-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.5)] scale-[1.08]'
            : 'bg-white/4 border border-white/28'}
        `}
      >
        {checked && (
          <svg
            className="absolute inset-0 m-auto w-3 h-3"
            viewBox="0 0 12 10"
            fill="none"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span className={`text-sm transition-colors ${checked ? 'text-white' : 'text-white/52'}`}>
        {label}
      </span>
    </label>
  );
}
