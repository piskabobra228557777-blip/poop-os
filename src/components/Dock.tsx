import React from 'react';
import {
  Folder,
  Globe,
  Terminal,
  Trash2,
  Calculator,
  FileText,
  Music,
  Image as ImageIcon,
  Paintbrush
} from 'lucide-react';
import { sound } from '../utils/sound';

export type DockAppType =
  | 'finder'
  | 'browser'
  | 'terminal'
  | 'onion'
  | 'calculator'
  | 'notes'
  | 'music'
  | 'photos'
  | 'paint';

interface DockProps {
  onOpenApp: (type: DockAppType) => void;
  openWindows: {
    finder: boolean;
    browser: boolean;
    terminal: boolean;
    onion: boolean;
    calculator?: boolean;
    notes?: boolean;
    music?: boolean;
    photos?: boolean;
    paint?: boolean;
  };
  hasOnionDownloaded: boolean;
  isRansomwareActive: boolean;
}

export const Dock: React.FC<DockProps> = ({
  onOpenApp,
  openWindows,
  hasOnionDownloaded,
  isRansomwareActive,
}) => {
  return (
    <nav
      id="poopos-dock-container"
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] overflow-x-auto"
    >
      <div
        id="poopos-dock"
        className={`flex items-end space-x-2.5 px-3.5 py-2 rounded-2xl transition-all duration-300 ${
          isRansomwareActive
            ? 'bg-black/75 border border-red-500/40 shadow-2xl shadow-red-950/60 backdrop-blur-2xl'
            : 'liquid-glass-dock shadow-2xl backdrop-blur-2xl bg-slate-900/60 border border-white/20'
        }`}
      >
        {/* Finder */}
        <button
          id="dock-icon-finder"
          onClick={() => {
            sound.playClick();
            onOpenApp('finder');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Finder (Файлы)"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-lg border border-white/40">
            <Folder className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Файлы</span>
          {openWindows.finder && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Browser */}
        <button
          id="dock-icon-browser"
          onClick={() => {
            sound.playClick();
            onOpenApp('browser');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Safari PoopBrowse"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg border border-white/40">
            <Globe className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Браузер</span>
          {openWindows.browser && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Calculator */}
        <button
          id="dock-icon-calculator"
          onClick={() => {
            sound.playClick();
            onOpenApp('calculator');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Калькулятор"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-amber-500 to-orange-600 flex items-center justify-center shadow-lg border border-white/40">
            <Calculator className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Калькулятор</span>
          {openWindows.calculator && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Notes */}
        <button
          id="dock-icon-notes"
          onClick={() => {
            sound.playClick();
            onOpenApp('notes');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Заметки"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-amber-300 to-yellow-500 flex items-center justify-center shadow-lg border border-white/40">
            <FileText className="w-6 h-6 text-slate-900 drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Заметки</span>
          {openWindows.notes && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Music Player */}
        <button
          id="dock-icon-music"
          onClick={() => {
            sound.playClick();
            onOpenApp('music');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Музыка"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-pink-500 to-rose-600 flex items-center justify-center shadow-lg border border-white/40">
            <Music className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Музыка</span>
          {openWindows.music && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Photos */}
        <button
          id="dock-icon-photos"
          onClick={() => {
            sound.playClick();
            onOpenApp('photos');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Фото"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg border border-white/40">
            <ImageIcon className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Фото</span>
          {openWindows.photos && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Paint */}
        <button
          id="dock-icon-paint"
          onClick={() => {
            sound.playClick();
            onOpenApp('paint');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Рисование"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-purple-500 to-violet-700 flex items-center justify-center shadow-lg border border-white/40">
            <Paintbrush className="w-6 h-6 text-white drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Paint</span>
          {openWindows.paint && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Terminal */}
        <button
          id="dock-icon-terminal"
          onClick={() => {
            sound.playClick();
            onOpenApp('terminal');
          }}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Терминал (cmd)"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-slate-800 to-slate-950 flex items-center justify-center shadow-lg border border-white/20">
            <Terminal className="w-5 h-5 text-green-400 drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">cmd</span>
          {openWindows.terminal && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Onion.exe (Only shows once downloaded or infected) */}
        {hasOnionDownloaded && (
          <button
            id="dock-icon-onion"
            onClick={() => {
              sound.playClick();
              onOpenApp('onion');
            }}
            className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 animate-bounce cursor-pointer"
            title="Onion.exe (Запуск)"
          >
            <div className="w-11 h-11 rounded-xl bg-linear-to-b from-amber-500 to-red-600 flex items-center justify-center shadow-lg border border-red-300 text-2xl relative overflow-hidden">
              <span className="animate-pulse">🧅</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-red-300 drop-shadow mt-1">onion.exe</span>
            {openWindows.onion && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-0.5 shadow-sm" />
            )}
          </button>
        )}

        <div className="w-px h-7 bg-white/20 self-center" />

        {/* Trash */}
        <button
          id="dock-icon-trash"
          onClick={() => sound.playClick()}
          className="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-2 active:scale-95 cursor-pointer"
          title="Корзина"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-b from-slate-200/50 to-slate-400/50 flex items-center justify-center shadow-md border border-white/30 backdrop-blur-md">
            <Trash2 className="w-5 h-5 text-slate-700 dark:text-slate-200 drop-shadow" />
          </div>
          <span className="text-[10px] font-medium text-white/90 drop-shadow mt-1">Корзина</span>
        </button>
      </div>
    </nav>
  );
};
