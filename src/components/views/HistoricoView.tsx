'use client';
import { HistoryEntry } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface HistoricoViewProps {
  history: HistoryEntry[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

export default function HistoricoView({ history, onRemove, onClearAll }: HistoricoViewProps) {
  function handleClearAll() {
    if (window.confirm('Apagar todo o histórico? Esta ação não pode ser desfeita.')) {
      onClearAll();
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
          Histórico
        </h2>
        {history.length > 0 && (
          <Button variant="danger" onClick={handleClearAll} className="text-xs px-3 py-1.5">
            Limpar tudo
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-white/52 text-sm">Nenhum sorteio realizado ainda.</p>
        </GlassCard>
      ) : (
        history.map((entry, i) => (
          <GlassCard key={i} className="p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs text-white/40 mb-0.5">{entry.date}</p>
                <p className="text-sm font-medium text-white">{entry.names.length} sorteados</p>
                {entry.presentCount && (
                  <p className="text-xs text-white/30">{entry.presentCount} presentes</p>
                )}
              </div>
              <Button variant="danger" onClick={() => onRemove(i)} className="text-xs px-3 py-1.5 flex-shrink-0">
                Apagar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.names.map((name, j) => (
                <div
                  key={j}
                  className="flex items-center gap-1 bg-white/7 border border-white/10 rounded-[100px] px-3 py-1 text-xs text-white/70"
                >
                  <span className="text-white/30">#{j + 1}</span>
                  {name}
                </div>
              ))}
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
}
