'use client';
import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { TIMER_DURATION } from '@/lib/constants';
import { playTick, playBoom } from '@/lib/audio';
import TimerCircle from '@/components/ui/TimerCircle';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

interface TimerViewProps {
  drawResult: string[];
  onSessionEnd: (names: string[]) => void;
}

export default function TimerView({ drawResult, onSessionEnd }: TimerViewProps) {
  const [current, setCurrent] = useState(0);
  const [secs, setSecs] = useState(TIMER_DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<boolean[]>([]);
  const [exploding, setExploding] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when draw changes
  useEffect(() => {
    setCurrent(0);
    setSecs(TIMER_DURATION);
    setRunning(false);
    setDone([]);
    setFinished(false);
    setExploding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [drawResult]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecs(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          handleTimeUp();
          return 0;
        }
        if (prev <= 6) playTick();
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function handleTimeUp() {
    playBoom();
    setExploding(true);

    // Massive multi-origin confetti burst
    const burst = (origin: { x: number; y: number }) => {
      confetti({ particleCount: 120, spread: 160, startVelocity: 60, origin, ticks: 200, gravity: 0.8 });
    };
    burst({ x: 0.5, y: 0.5 });
    setTimeout(() => { burst({ x: 0.2, y: 0.3 }); burst({ x: 0.8, y: 0.3 }); }, 80);
    setTimeout(() => { burst({ x: 0.1, y: 0.6 }); burst({ x: 0.9, y: 0.6 }); }, 180);
    setTimeout(() => { burst({ x: 0.5, y: 0.2 }); }, 280);

    setTimeout(() => setExploding(false), 1400);

    setTimeout(() => {
      setDone(prev => {
        const next = [...prev];
        next[current] = true;
        return next;
      });

      const next = current + 1;
      if (next >= drawResult.length) {
        setFinished(true);
        onSessionEnd(drawResult);
      } else {
        setCurrent(next);
        setSecs(TIMER_DURATION);
        setRunning(false);
      }
    }, 1800);
  }

  function goNext() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);

    setDone(prev => {
      const next = [...prev];
      next[current] = true;
      return next;
    });

    const next = current + 1;
    if (next >= drawResult.length) {
      setFinished(true);
      onSessionEnd(drawResult);
    } else {
      setCurrent(next);
      setSecs(TIMER_DURATION);
    }
  }

  if (drawResult.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 max-w-3xl mx-auto">
        <GlassCard className="p-8 text-center w-full">
          <p className="text-4xl mb-3">⏱️</p>
          <p className="text-white/52 text-sm">Realize um sorteio primeiro para usar o timer.</p>
        </GlassCard>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 max-w-3xl mx-auto">
        <GlassCard className="p-8 text-center w-full">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-syne)' }}>
            Apresentações concluídas!
          </p>
          <p className="text-white/52 text-sm">Todos os {drawResult.length} sorteados apresentaram.</p>
        </GlassCard>
      </div>
    );
  }

  const urgent = secs <= 5 && running;
  const presenter = drawResult[current];

  return (
    <>
      {exploding && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {/* White flash */}
          <div className="absolute inset-0 animate-[explodeFlash_0.15s_ease-out_forwards]" style={{ background: 'white' }} />
          {/* Core fireball */}
          <div
            className="absolute inset-0 animate-[explodeCore_1.4s_ease-out_forwards]"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,240,100,1) 0%, rgba(255,140,0,0.9) 20%, rgba(255,50,0,0.7) 45%, rgba(120,0,80,0.3) 65%, transparent 80%)' }}
          />
          {/* Shockwave ring 1 */}
          <div className="absolute inset-0 flex items-center justify-center animate-[shockwave_0.8s_cubic-bezier(0,0.5,0.5,1)_forwards]">
            <div className="w-4 h-4 rounded-full border-4 border-orange-400 opacity-80" />
          </div>
          {/* Shockwave ring 2 delayed */}
          <div className="absolute inset-0 flex items-center justify-center animate-[shockwave_0.9s_cubic-bezier(0,0.5,0.5,1)_0.1s_forwards]">
            <div className="w-4 h-4 rounded-full border-4 border-yellow-200 opacity-60" />
          </div>
          {/* Shockwave ring 3 */}
          <div className="absolute inset-0 flex items-center justify-center animate-[shockwave_1.1s_cubic-bezier(0,0.5,0.5,1)_0.2s_forwards]">
            <div className="w-4 h-4 rounded-full border-[6px] border-white opacity-40" />
          </div>
          {/* Screen shake overlay */}
          <div className="absolute inset-0 animate-[screenShake_0.4s_ease-out_forwards]" />
        </div>
      )}

      <div className="flex flex-col items-center gap-5 p-4 max-w-3xl mx-auto">
        {/* Presenter info */}
        <div className="text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Apresentando agora</p>
          <h2
            className="text-2xl font-bold text-white mb-0.5"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {presenter}
          </h2>
          <p className="text-sm text-white/52">
            Apresentador {current + 1} de {drawResult.length}
          </p>
        </div>

        {/* Timer circle */}
        <TimerCircle seconds={secs} total={TIMER_DURATION} urgent={urgent} />

        {/* Controls */}
        <div className="flex gap-3">
          {!running ? (
            <Button variant="timer-start" onClick={() => setRunning(true)} className="px-8 py-3 font-bold">
              ▶ Iniciar
            </Button>
          ) : (
            <Button variant="timer-pause" onClick={() => setRunning(false)} className="px-8 py-3 font-bold">
              ⏸ Pausar
            </Button>
          )}
          <Button variant="timer-next" onClick={goNext} className="px-6 py-3 font-bold">
            Próximo →
          </Button>
        </div>

        {/* Queue */}
        <GlassCard className="w-full p-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Fila</p>
          <div className="flex flex-wrap gap-2">
            {drawResult.map((name, i) => (
              <div
                key={i}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-[100px] text-xs font-medium
                  transition-all duration-300
                  ${i === current
                    ? 'bg-[#0A84FF] text-white shadow-[0_0_12px_rgba(10,132,255,0.4)]'
                    : done[i]
                      ? 'bg-[rgba(48,209,88,0.15)] text-[#30D158] line-through'
                      : 'bg-white/7 text-white/52'}
                `}
              >
                <span className="opacity-60">#{i + 1}</span>
                {name}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
