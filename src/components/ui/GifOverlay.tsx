'use client';

interface GifOverlayProps {
  visible: boolean;
  gifUrl: string;
  loading: boolean;
}

export default function GifOverlay({ visible, gifUrl, loading }: GifOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,8,15,0.80)] backdrop-blur-[24px]">
      <div className="flex flex-col items-center gap-4 animate-[gifPop_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        <p className="text-white/60 text-sm font-medium tracking-wide">Sorteando...</p>
        {loading ? (
          <div className="w-[280px] h-[280px] rounded-[22px] bg-white/7 flex items-center justify-center">
            <span className="text-5xl animate-[spinnerPulse_0.9s_ease-in-out_infinite_alternate]">🎲</span>
          </div>
        ) : (
          <img
            src={gifUrl}
            alt="celebration"
            className="w-[280px] h-[280px] object-cover rounded-[22px]"
            style={{ boxShadow: '0 0 40px rgba(10,132,255,0.5)' }}
          />
        )}
      </div>
    </div>
  );
}
