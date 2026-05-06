'use client';
import { useState, useEffect } from 'react';
import { HistoryEntry } from '@/types';

const KEY = 'sorteio_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  function addEntry(entry: HistoryEntry) {
    setHistory(prev => {
      const next = [entry, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function removeEntry(index: number) {
    setHistory(prev => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearAll() {
    setHistory([]);
    localStorage.removeItem(KEY);
  }

  return { history, addEntry, removeEntry, clearAll };
}
