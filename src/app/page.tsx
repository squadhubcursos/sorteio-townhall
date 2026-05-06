'use client';
import { useState, useEffect } from 'react';
import { TabId, HistoryEntry } from '@/types';
import { useHistory } from '@/lib/useHistory';
import { usePeople } from '@/lib/usePeople';
import GradientMenu from '@/components/ui/GradientMenu';
import ConfigView from '@/components/views/ConfigView';
import SorteioView from '@/components/views/SorteioView';
import TimerView from '@/components/views/TimerView';
import HistoricoView from '@/components/views/HistoricoView';

export default function Home() {
  const { people, loaded, addPerson, removePerson } = usePeople();
  const [activeTab, setActiveTab] = useState<TabId>('config');
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [qty, setQty] = useState(5);

  // Sync presence when people list changes (new person added = checked by default)
  useEffect(() => {
    if (!loaded) return;
    setPresence(prev => {
      const next: Record<string, boolean> = {};
      people.forEach(p => { next[p] = prev[p] ?? true; });
      return next;
    });
  }, [people, loaded]);
  const [drawResult, setDrawResult] = useState<string[]>([]);
  const [sortRunning, setSortRunning] = useState(false);
  const { history, addEntry, removeEntry, clearAll } = useHistory();

  const presentCount = Object.values(presence).filter(Boolean).length;

  function handlePresenceChange(name: string, value: boolean) {
    setPresence(prev => ({ ...prev, [name]: value }));
  }

  function handleQtyChange(v: number) {
    setQty(Math.min(presentCount, Math.max(1, v)));
  }

  function handleStart() {
    setSortRunning(true);
    setDrawResult([]);
    setActiveTab('sorteio');
  }

  function handleDrawComplete(names: string[]) {
    setSortRunning(false);
    setDrawResult(names);
  }

  function handleGoToTimer() {
    setActiveTab('timer');
  }

  function handleSessionEnd(names: string[]) {
    const now = new Date();
    const date =
      now.toLocaleDateString('pt-BR') +
      ' ' +
      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const entry: HistoryEntry = { date, names, presentCount };
    addEntry(entry);
  }

  return (
    <div className="min-h-screen">
      <div className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
          Sorteio Semanal
        </h1>
        <p className="text-xs text-white/40 mt-1">Grandes Entregas da Semana</p>
      </div>

      <GradientMenu active={activeTab} onChange={setActiveTab} />

      <div className="pb-12">
        {activeTab === 'config' && (
          <ConfigView
            people={people}
            presence={presence}
            qty={qty}
            onPresenceChange={handlePresenceChange}
            onQtyChange={handleQtyChange}
            onStart={handleStart}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
          />
        )}
        {activeTab === 'sorteio' && (
          <SorteioView
            drawResult={drawResult}
            running={sortRunning}
            presence={presence}
            qty={qty}
            onDrawComplete={handleDrawComplete}
            onGoToTimer={handleGoToTimer}
          />
        )}
        {activeTab === 'timer' && (
          <TimerView drawResult={drawResult} onSessionEnd={handleSessionEnd} />
        )}
        {activeTab === 'historico' && (
          <HistoricoView history={history} onRemove={removeEntry} onClearAll={clearAll} />
        )}
      </div>
    </div>
  );
}
