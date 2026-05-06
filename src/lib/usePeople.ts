'use client';
import { useState, useEffect } from 'react';
import { PEOPLE } from './constants';

const KEY = 'sorteio_people';

export function usePeople() {
  const [people, setPeople] = useState<string[]>(PEOPLE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPeople(parsed);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  function save(next: string[]) {
    const sorted = [...next].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    setPeople(sorted);
    localStorage.setItem(KEY, JSON.stringify(sorted));
  }

  function addPerson(name: string) {
    const trimmed = name.trim();
    if (!trimmed || people.includes(trimmed)) return false;
    save([...people, trimmed]);
    return true;
  }

  function removePerson(name: string) {
    save(people.filter(p => p !== name));
  }

  return { people, loaded, addPerson, removePerson };
}
