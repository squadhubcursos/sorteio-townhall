'use client';
import { IoSettingsOutline, IoDiceOutline, IoTimerOutline, IoListOutline } from 'react-icons/io5';
import { TabId } from '@/types';

const MENU_ITEMS: {
  id: TabId;
  title: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
}[] = [
  { id: 'config',    title: 'Configurar', icon: <IoSettingsOutline />, gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { id: 'sorteio',   title: 'Sortear',    icon: <IoDiceOutline />,     gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { id: 'timer',     title: 'Timer',      icon: <IoTimerOutline />,    gradientFrom: '#FF9966', gradientTo: '#FF5E62' },
  { id: 'historico', title: 'Histórico',  icon: <IoListOutline />,     gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
];

interface GradientMenuProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function GradientMenu({ active, onChange }: GradientMenuProps) {
  return (
    <div className="sticky top-0 z-40 bg-[rgba(8,8,15,0.6)] backdrop-blur-[12px] border-b border-white/6">
      <div className="flex justify-center items-center py-3 px-4">
        <ul className="flex gap-4">
          {MENU_ITEMS.map(({ id, title, icon, gradientFrom, gradientTo }) => {
            const isActive = active === id;
            return (
              <li
                key={id}
                onClick={() => onChange(id)}
                style={
                  {
                    '--gradient-from': gradientFrom,
                    '--gradient-to': gradientTo,
                  } as React.CSSProperties
                }
                className={`
                  relative cursor-pointer select-none
                  flex items-center justify-center
                  transition-all duration-500
                  rounded-full shadow-lg
                  ${isActive
                    ? 'w-[140px] h-[46px] shadow-none'
                    : 'w-[46px] h-[46px] bg-white/10 hover:w-[140px] hover:shadow-none'}
                  group
                `}
              >
                {/* Gradient background — active always visible, hover for inactive */}
                <span
                  className={`
                    absolute inset-0 rounded-full
                    bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]
                    transition-opacity duration-500
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                />
                {/* Glow blur */}
                <span
                  className={`
                    absolute top-[8px] inset-x-0 h-full rounded-full -z-10
                    bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]
                    blur-[12px] transition-opacity duration-500
                    ${isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-40'}
                  `}
                />
                {/* Icon — hidden when active or hovered */}
                <span
                  className={`
                    relative z-10 text-xl transition-all duration-300
                    ${isActive ? 'scale-0 opacity-0' : 'scale-100 opacity-100 group-hover:scale-0 group-hover:opacity-0'}
                    text-white/60
                  `}
                >
                  {icon}
                </span>
                {/* Label */}
                <span
                  className={`
                    absolute text-white text-xs font-semibold uppercase tracking-wide
                    transition-all duration-300
                    ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-150'}
                  `}
                >
                  {title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
