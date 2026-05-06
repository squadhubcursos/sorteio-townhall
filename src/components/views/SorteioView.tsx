'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GIPHY_KEY, GIPHY_TAGS } from '@/lib/constants';
import SlotMachine from '@/components/ui/SlotMachine';
import GifOverlay from '@/components/ui/GifOverlay';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

interface SorteioViewProps {
  drawResult: string[];
  running: boolean;
  presence: Record<string, boolean>;
  qty: number;
  onDrawComplete: (names: string[]) => void;
  onGoToTimer: () => void;
}

export default function SorteioView({ drawResult, running, presence, qty, onDrawComplete, onGoToTimer }: SorteioViewProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [gifUrl, setGifUrl] = useState('');
  const [gifLoading, setGifLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTagRef = useRef<string>('');

  const present = Object.keys(presence).filter(p => presence[p]);

  const fetchGif = useCallback(async () => {
    setGifLoading(true);
    setGifUrl('');
    const available = GIPHY_TAGS.filter(t => t !== lastTagRef.current);
    const tag = available[Math.floor(Math.random() * available.length)];
    lastTagRef.current = tag;
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=${encodeURIComponent(tag)}&rating=g`
      );
      const json = await res.json();
      setGifUrl(json?.data?.images?.original?.url ?? '');
    } catch {}
    setGifLoading(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    // Reset
    setSpinning(true);
    setRevealed([]);
    setSlots(Array.from({ length: qty }, () => present[Math.floor(Math.random() * present.length)]));
    setShowOverlay(true);
    fetchGif();

    // Spin: randomise slots every 100ms
    spinInterval.current = setInterval(() => {
      setSlots(Array.from({ length: qty }, () => present[Math.floor(Math.random() * present.length)]));
    }, 100);

    // After 5s: pick real results and reveal
    const timeout = setTimeout(() => {
      if (spinInterval.current) clearInterval(spinInterval.current);
      setSpinning(false);

      // Draw without replacement
      const pool = [...present];
      const picks: string[] = [];
      for (let i = 0; i < Math.min(qty, pool.length); i++) {
        const idx = Math.floor(Math.random() * pool.length);
        picks.push(pool.splice(idx, 1)[0]);
      }
      setSlots(picks);

      // Reveal simultaneously with 80ms stagger
      picks.forEach((_, i) => {
        setTimeout(() => {
          setRevealed(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 80);
      });

      setTimeout(() => {
        setShowOverlay(false);
        onDrawComplete(picks);
      }, picks.length * 80 + 400);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const hasResult = drawResult.length > 0 && !running;

  return (
    <>
      <GifOverlay visible={showOverlay} gifUrl={gifUrl} loading={gifLoading} />

      <div className="flex flex-col gap-5 p-4 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            Sorteio
          </h2>
          <p className="text-sm text-white/52">
            {running ? 'Sorteando...' : hasResult ? 'Sorteados!' : 'Aguardando sorteio'}
          </p>
        </div>

        {(running || hasResult) && (
          <GlassCard className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {(running ? slots : drawResult).map((name, i) => (
                <SlotMachine
                  key={i}
                  name={name}
                  index={i}
                  spinning={running && !revealed[i]}
                  revealed={!running || revealed[i]}
                />
              ))}
            </div>
          </GlassCard>
        )}

        {hasResult && (
          <Button variant="primary" onClick={onGoToTimer} className="w-full py-3 font-bold">
            ⏱️ Iniciar Apresentações
          </Button>
        )}

        {!running && !hasResult && (
          <GlassCard className="p-8 text-center">
            <p className="text-4xl mb-3">🎲</p>
            <p className="text-white/52 text-sm">
              Configure os presentes e clique em &ldquo;Iniciar Sorteio&rdquo; na aba Configurar.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
