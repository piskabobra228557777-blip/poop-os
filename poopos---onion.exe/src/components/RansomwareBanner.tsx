import React from 'react';
import { ShieldAlert, Clock, Key } from 'lucide-react';

interface RansomwareBannerProps {
  timeLeftSeconds: number;
  btcCount: number;
}

export const RansomwareBanner: React.FC<RansomwareBannerProps> = ({
  timeLeftSeconds,
  btcCount,
}) => {
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeftSeconds <= 60;

  // Dynamic helpful instruction depending on progress
  let hintText = '💡 Открывай папки "Документы", "Загрузки", "Видео" в окне poopOS HD и дважды кликай по файлам ключей (.btc)!';
  if (btcCount === 1) {
    hintText = '🔥 1-й ключ найден! Ищи 2-й ключ в других папках на диске!';
  } else if (btcCount === 2) {
    hintText = '🚨 2 ключа найдены! 3-го ключа нет в компьютере... Оглянись назад в комнате!';
  } else if (btcCount >= 3) {
    hintText = '🎉 Все 3 ключа активированы! Система спасена!';
  }

  return (
    <div
      id="ransomware-top-banner"
      className="fixed top-9 left-1/2 -translate-x-1/2 z-45 w-[94%] max-w-4xl animate-in slide-in-from-top-6 duration-500 select-none"
    >
      <div
        className={`rounded-2xl border-2 p-3.5 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isUrgent
            ? 'bg-red-950/95 border-red-500 shadow-red-600/50 animate-pulse'
            : 'bg-black/85 border-red-600/70 shadow-red-950/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Title & Warning */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-600/30 border border-red-500/50 text-red-400">
              <ShieldAlert className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded tracking-widest uppercase">
                  RANSOMWARE ONION.EXE
                </span>
                <span className="text-[11px] font-mono text-red-400">
                  ТРЕБУЕТСЯ: 3 ПОДЛИННЫХ КЛЮЧА (.BTC)
                </span>
              </div>
              <p className="text-xs font-semibold text-yellow-300 mt-1 flex items-center space-x-1">
                <span>{hintText}</span>
              </p>
            </div>
          </div>

          {/* Countdown Timer & Bitcoin slots */}
          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-500/40">
              <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400 animate-ping' : 'text-amber-400'}`} />
              <div className="font-mono text-lg font-black tracking-wider text-red-300">
                {timeFormatted}
              </div>
            </div>

            {/* Keys Progress */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10">
              <Key className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                {btcCount}/3 BTC
              </span>
              <div className="flex space-x-1 pl-1">
                <span className={`w-3 h-3 rounded-full border transition-colors ${btcCount >= 1 ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-600'}`} />
                <span className={`w-3 h-3 rounded-full border transition-colors ${btcCount >= 2 ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-600'}`} />
                <span className={`w-3 h-3 rounded-full border transition-colors ${btcCount >= 3 ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-600'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
