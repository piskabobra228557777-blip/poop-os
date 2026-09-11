import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Download, ShieldCheck, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/sound';

interface BrowserProps {
  onSearchClick: () => void;
  isDownloading: boolean;
  downloadProgress: number;
  showAd: boolean;
}

export const Browser: React.FC<BrowserProps> = ({
  onSearchClick,
  isDownloading,
  downloadProgress,
  showAd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePos, setMousePos] = useState({ x: 180, y: 120 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleInputClick = () => {
    sound.playClick();
    onSearchClick();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col h-full bg-slate-900/90 text-slate-100 select-none relative overflow-hidden"
    >
      {/* Browser Controls Bar */}
      <div className="h-11 bg-slate-800/80 px-3 flex items-center space-x-3 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <button className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address / Search Bar */}
        <div className="flex-1 relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="browser-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={handleInputClick}
              onFocus={handleInputClick}
              placeholder="Поиск в Интернете или введите адрес..."
              className="w-full bg-slate-950/70 text-xs text-white pl-9 pr-8 py-1.5 rounded-lg border border-white/15 focus:outline-hidden focus:border-blue-500/80 transition-all"
            />
            <div className="absolute right-2.5 text-[10px] text-slate-500 font-mono">
              PoopSearch
            </div>
          </div>
        </div>

        {/* Downloads status icon */}
        <div className="relative">
          <button
            className={`p-1.5 rounded-lg border transition-colors flex items-center space-x-1 ${
              isDownloading
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <Download className="w-4 h-4" />
            {isDownloading && (
              <span className="text-[10px] font-mono font-bold">{Math.floor(downloadProgress)}%</span>
            )}
          </button>
        </div>
      </div>

      {/* Download Floating Notification Banner */}
      {isDownloading && (
        <div className="bg-amber-950/90 border-b border-amber-600/50 px-4 py-2 flex items-center justify-between text-amber-200 text-xs backdrop-blur-md z-20 animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg animate-spin">🧅</span>
            <div>
              <div className="font-semibold text-amber-100 flex items-center space-x-1.5">
                <span>Скачивание: Onion.exe</span>
                <span className="text-[10px] bg-amber-800/80 px-1.5 py-0.2 rounded font-mono">64.2 MB</span>
              </div>
              <div className="w-64 h-1.5 bg-amber-950 rounded-full overflow-hidden mt-1 border border-amber-600/40">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-red-500 transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-[11px] text-amber-300/80 font-mono flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Не прерывайте загрузку!</span>
          </div>
        </div>
      )}

      {/* Main Browser Web Page Body */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-3">💩</div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            PoopSearch
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            Безопасный поиск нового поколения. Нажмите на строку поиска вверху для сёрфинга.
          </p>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5 flex flex-col items-center">
              <span className="text-xl mb-1">📰</span>
              <span>Новости poopOS</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5 flex flex-col items-center">
              <span className="text-xl mb-1">🌤️</span>
              <span>Погода +21°C</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5 flex flex-col items-center">
              <span className="text-xl mb-1">🎮</span>
              <span>Игры онлайн</span>
            </div>
          </div>
        </div>

        {/* INTRUSIVE POPUP AD: ONION.EXE APPEARS IN FRONT OF MOUSE! */}
        {showAd && (
          <div
            id="ad-onion-popup"
            style={{
              left: `${Math.min(mousePos.x + 10, 360)}px`,
              top: `${Math.min(mousePos.y + 10, 180)}px`,
            }}
            className="absolute z-30 w-72 p-3.5 rounded-xl bg-linear-to-br from-amber-900/95 via-yellow-950/95 to-red-950/95 border-2 border-amber-400 text-white shadow-2xl animate-bounce backdrop-blur-md"
          >
            <div className="flex items-start space-x-2.5">
              <span className="text-4xl animate-spin">🧅</span>
              <div>
                <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded tracking-wider uppercase">
                  ПОДОЗРИТЕЛЬНАЯ РЕКЛАМА
                </span>
                <h4 className="font-bold text-sm text-yellow-300 mt-1 leading-tight">
                  Onion.exe — Супер Ускоритель ПК!
                </h4>
                <p className="text-[11px] text-amber-200/90 mt-1 leading-snug">
                  Ускорь poopOS на 500%! Загрузка началась автоматически...
                </p>
              </div>
            </div>
            <div className="mt-2 text-center text-[10px] font-mono text-amber-400 animate-pulse">
              [ Идет автоматическая загрузка и запуск... ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
