import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { ShieldCheck, Trophy, RotateCcw, Laugh, RotateCw, Lock } from 'lucide-react';
import { FinalPrankBrowser } from './FinalPrankBrowser';

interface VictoryModalProps {
  timeTakenSeconds: number;
  onRestart: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  timeTakenSeconds,
  onRestart,
  onClose,
}) => {
  const [showFinalPrank, setShowFinalPrank] = useState(false);
  const [prankFinished, setPrankFinished] = useState(false);

  useEffect(() => {
    sound.playVictoryFanfare();

    // Confetti cannon
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // TRIGGER SECRET PRANK ENDING: After 4 seconds while the friend is reading the text!
    const prankTimer = setTimeout(() => {
      setShowFinalPrank(true);
    }, 4000);

    return () => {
      clearTimeout(prankTimer);
    };
  }, []);

  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;
  const timeFormatted = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-300">
        <div className="max-w-md w-full bg-linear-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-6 text-white text-center shadow-2xl shadow-emerald-950/60 relative overflow-hidden">
          {/* Decorative Top Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Big Trophy / Icon */}
          <div className="w-18 h-18 mx-auto mb-4 rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 border border-emerald-300">
            <Trophy className="w-10 h-10 text-white drop-shadow" />
          </div>

          <div className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🎉 ПРАНК УДАЛСЯ! СИСТЕМА СПАСЕНА!</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            ТЫ РАЗГАДАЛ РОЗЫГРЫШ!
          </h1>

          <p className="text-xs text-slate-300 mb-5 leading-relaxed">
            Твой друг создал эту операционную систему poopOS, чтобы разыграть тебя! Ты блестяще справился с неожиданным вирусом Onion.exe, нашёл подлинные биткоин-ключи и выхватил флешку у сущности в 3D комнате!
          </p>

          {/* After prank finished: funny joke badge */}
          {prankFinished && (
            <div className="mb-5 p-3 rounded-2xl bg-yellow-500/15 border-2 border-yellow-400/50 text-left flex items-start space-x-2.5 animate-in zoom-in-95 duration-300">
              <span className="text-2xl">😂</span>
              <div>
                <h4 className="text-xs font-bold text-yellow-300">Лук пошутил над тобой и ушёл!</h4>
                <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">
                  Финальный прикол окончен. Теперь poopOS полностью чист и безопасен!
                </p>
              </div>
            </div>
          )}

          {/* Stats card */}
          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-3.5 mb-5 grid grid-cols-2 gap-3 text-left">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Время спасения</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{timeFormatted}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Собрано Bitcoin</div>
              <div className="text-lg font-bold font-mono text-amber-400">3 / 3 BTC</div>
            </div>
          </div>

          <div className="flex flex-col space-y-2.5">
            <div className="flex items-center space-x-3">
              <button
                id="btn-play-again"
                disabled={!prankFinished}
                onClick={() => {
                  if (!prankFinished) {
                    sound.playBlockedAction();
                    return;
                  }
                  sound.playClick();
                  onRestart();
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                  !prankFinished
                    ? 'bg-slate-800/60 text-slate-500 border border-white/5 cursor-not-allowed opacity-50 select-none'
                    : 'bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-green-950/50 active:scale-95 cursor-pointer'
                }`}
              >
                {!prankFinished ? <Lock className="w-3.5 h-3.5 text-slate-500" /> : <RotateCcw className="w-4 h-4" />}
                <span>Сыграть снова</span>
              </button>
              <button
                id="btn-explore-clean"
                disabled={!prankFinished}
                onClick={() => {
                  if (!prankFinished) {
                    sound.playBlockedAction();
                    return;
                  }
                  sound.playClick();
                  onClose();
                }}
                className={`px-4 py-3 rounded-xl font-medium text-xs border transition-all ${
                  !prankFinished
                    ? 'bg-slate-800/40 text-slate-500 border-white/5 cursor-not-allowed opacity-40 select-none'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10 active:scale-95 cursor-pointer'
                }`}
              >
                Рабочий стол
              </button>
            </div>

            {/* Status while waiting for secret ending */}
            {!prankFinished ? (
              <div className="pt-1 text-[11px] font-mono text-emerald-400/80 flex items-center justify-center space-x-2 select-none animate-pulse">
                <RotateCw className="w-3 h-3 animate-spin text-emerald-400" />
                <span>Финализация безопасности poopOS... (подождите пару секунд)</span>
              </div>
            ) : (
              /* Replay prank button */
              <button
                onClick={() => {
                  sound.playClick();
                  setShowFinalPrank(true);
                }}
                className="w-full py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold text-xs border border-yellow-400/40 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Laugh className="w-3.5 h-3.5" />
                <span>Повторить финальный прикол с луком</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Surprise Final Prank Browser Overlay */}
      {showFinalPrank && (
        <FinalPrankBrowser
          onComplete={() => {
            setShowFinalPrank(false);
            setPrankFinished(true);
          }}
        />
      )}
    </>
  );
};
