'use client';
import { useState, useRef } from 'react';
import { Switch } from '@/components/ui/Switch';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

interface ConfigViewProps {
  people: string[];
  presence: Record<string, boolean>;
  qty: number;
  onPresenceChange: (name: string, value: boolean) => void;
  onQtyChange: (qty: number) => void;
  onStart: () => void;
  onAddPerson: (name: string) => boolean;
  onRemovePerson: (name: string) => void;
}

export default function ConfigView({
  people,
  presence,
  qty,
  onPresenceChange,
  onQtyChange,
  onStart,
  onAddPerson,
  onRemovePerson,
}: ConfigViewProps) {
  const presentCount = Object.values(presence).filter(Boolean).length;
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function markAll(value: boolean) {
    people.forEach(p => onPresenceChange(p, value));
  }

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const ok = onAddPerson(trimmed);
    if (!ok) {
      setError('Nome já existe na lista.');
      return;
    }
    setNewName('');
    setError('');
    inputRef.current?.focus();
  }

  function handleRemove(name: string) {
    onRemovePerson(name);
  }

  return (
    <div className="flex flex-col gap-5 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            Presença
          </h2>
          <p className="text-sm text-white/52">{presentCount} de {people.length} presentes</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!editMode && (
            <>
              <Button variant="tinted" onClick={() => markAll(true)} className="text-xs px-3 py-1.5">
                Todos
              </Button>
              <Button variant="ghost" onClick={() => markAll(false)} className="text-xs px-3 py-1.5">
                Nenhum
              </Button>
            </>
          )}
          <Button
            variant={editMode ? 'danger' : 'secondary'}
            onClick={() => { setEditMode(v => !v); setNewName(''); setError(''); }}
            className="text-xs px-3 py-1.5"
          >
            {editMode ? '✓ Concluir' : '✏️ Editar participantes'}
          </Button>
        </div>
      </div>

      {/* People list */}
      <GlassCard className="p-4">
        {!editMode ? (
          <div className="grid grid-cols-2 gap-y-1 gap-x-6">
            {people.map(person => (
              <Switch
                key={person}
                label={person}
                checked={presence[person] ?? true}
                onToggle={() => onPresenceChange(person, !(presence[person] ?? true))}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {people.map(person => (
              <div
                key={person}
                className="flex items-center justify-between px-3 py-2 rounded-[10px] hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm text-white/80">{person}</span>
                <button
                  onClick={() => handleRemove(person)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-[rgba(255,69,58,0.15)] text-[#FF453A] flex items-center justify-center text-base hover:bg-[rgba(255,69,58,0.3)]"
                  title={`Remover ${person}`}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add new person */}
            <div className="mt-3 pt-3 border-t border-white/8">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Adicionar participante</p>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                  placeholder="Nome completo"
                  className="flex-1 bg-white/7 border border-white/10 rounded-[10px] text-white text-sm px-3 py-2 placeholder:text-white/28 focus:outline-none focus:border-[#0A84FF] transition-colors"
                />
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="px-4 py-2 text-sm"
                >
                  + Adicionar
                </Button>
              </div>
              {error && <p className="text-xs text-[#FF453A] mt-1.5">{error}</p>}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Quantity — only shown outside edit mode */}
      {!editMode && (
        <GlassCard className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">Número de sorteados</p>
            <p className="text-xs text-white/40 mt-0.5">Mínimo 1 · Máximo {presentCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-lg hover:bg-white/20 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={presentCount}
              value={qty}
              onChange={e => {
                const v = parseInt(e.target.value);
                if (!isNaN(v)) onQtyChange(Math.min(presentCount, Math.max(1, v)));
              }}
              className="w-14 text-center bg-white/10 border border-white/10 rounded-[10px] text-white font-bold py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => onQtyChange(Math.min(presentCount, qty + 1))}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-lg hover:bg-white/20 transition-colors"
            >
              +
            </button>
          </div>
        </GlassCard>
      )}

      {/* Start button — only shown outside edit mode */}
      {!editMode && (
        <Button
          variant="primary"
          onClick={onStart}
          disabled={presentCount === 0}
          className="w-full py-4 text-base font-bold"
        >
          🎲 Iniciar Sorteio
        </Button>
      )}
    </div>
  );
}
