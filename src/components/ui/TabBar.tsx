'use client';
import { TabId } from '@/types';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'config', label: 'Configurar', icon: '⚙️' },
  { id: 'sorteio', label: 'Sortear', icon: '🎲' },
  { id: 'timer', label: 'Timer', icon: '⏱️' },
  { id: 'historico', label: 'Histórico', icon: '📋' },
];

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-[rgba(8,8,15,0.6)] backdrop-blur-[12px] border-b border-white/6">
      <div className="max-w-3xl mx-auto flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium
              transition-colors duration-150 border-b-2
              ${active === tab.id
                ? 'text-[#0A84FF] border-[#0A84FF]'
                : 'text-white/52 border-transparent hover:text-white/80'}
            `}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
