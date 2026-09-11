import React from 'react';
import { OnionSprite } from './OnionSprite';
import { sound } from '../utils/sound';

interface OnionWindowProps {
  phase: 'intro' | 'offer';
  onAcceptGame: () => void;
  onRejectGame: () => void;
  isOfferDeclinedGlitch?: boolean;
}

export const OnionWindow: React.FC<OnionWindowProps> = ({
  phase,
  onAcceptGame,
  onRejectGame,
  isOfferDeclinedGlitch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 h-full bg-linear-to-b from-amber-950/80 via-slate-900 to-black text-white text-center select-none relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Onion character */}
      <div className="relative mb-3 animate-bounce">
        <OnionSprite
          mood={phase === 'intro' ? 'happy' : isOfferDeclinedGlitch ? 'evil' : 'sly'}
          size={140}
        />
      </div>

      {phase === 'intro' ? (
        <div className="max-w-md space-y-3 z-10">
          <div className="inline-block bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full font-mono border border-amber-500/30">
            🧅 Onion System Optimizer v1.0
          </div>
          <h2 className="text-xl font-bold tracking-tight text-yellow-200">
            Привет! Я Лук (Onion)!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Я твой новый персональный помощник в poopOS. Чтобы твой компьютер летал и очистился от мусора, мне нужны системные права администратора!
          </p>
          <div className="text-[11px] text-amber-400/90 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20 animate-pulse">
            [ Сейчас системный терминал выдаст мне доступ root... ]
          </div>
        </div>
      ) : (
        <div className="max-w-md space-y-3.5 z-10">
          <div className="inline-block bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full font-mono border border-red-500/30">
            🧅 ONION.EXE: ВЫЗОВ ВЫМОГАТЕЛЯ
          </div>
          <h2 className="text-xl font-bold tracking-tight text-red-200">
            ХА-ХА! Твоя система poopOS заблокирована!
          </h2>

          <div className="text-xs text-slate-200 bg-red-950/60 p-3.5 rounded-xl border border-red-500/30 text-left space-y-1.5 leading-relaxed font-sans shadow-inner">
            <p className="font-bold text-yellow-300 uppercase tracking-wide text-[11px]">Правила игры на спасение системы:</p>
            <p>1. 🔐 Я зашифровал систему. Чтобы спасти её, найди <span className="text-yellow-300 font-bold">3 ЗОЛОТЫХ КЛЮЧА (.btc)</span>.</p>
            <p>2. 📁 Открывай папки на диске <span className="text-cyan-300 font-bold">poopOS HD</span> (Документы, Загрузки, Видео).</p>
            <p>3. ⚠️ Остерегайся десятков <span className="text-red-400 font-bold">фальшивых ключей-обманок</span>!</p>
            <p>4. ⏳ У тебя ровно <span className="text-red-400 font-bold">3 минуты</span>, иначе система самоуничтожится!</p>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            Ты готов начать поиски и спасти poopOS?
          </p>

          <div className="flex items-center justify-center space-x-4 pt-1">
            <button
              id="btn-onion-yes"
              onClick={() => {
                sound.playClick();
                onAcceptGame();
              }}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-lg shadow-green-950/50 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
            >
              ✅ Да, спасти poopOS!
            </button>
            <button
              id="btn-onion-no"
              onClick={() => {
                onRejectGame();
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-red-900/80 text-slate-300 hover:text-white font-medium text-xs border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              ❌ Нет, я боюсь!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
