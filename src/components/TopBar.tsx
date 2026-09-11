import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Search,
  ShieldAlert,
  Music2,
  Disc3
} from 'lucide-react';
import { sound, MUSIC_PLAYLIST, MusicTrackId } from '../utils/sound';

interface TopBarProps {
  activeAppTitle: string;
  isMuted: boolean;
  onToggleMute: () => void;
  isRansomwareActive: boolean;
  onOpenMusicApp?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeAppTitle,
  isMuted,
  onToggleMute,
  isRansomwareActive,
  onOpenMusicApp,
}) => {
  const [time, setTime] = useState<string>('');
  const [showPoopMenu, setShowPoopMenu] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(sound.getIsPlayingBgm());
  const [currentTrackTitle, setCurrentTrackTitle] = useState('poopMusic');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }) +
        ' ' +
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor music state
  useEffect(() => {
    const checkMusic = () => {
      setIsPlayingMusic(sound.getIsPlayingBgm());
      const curId = sound.getCurrentTrack();
      const track = MUSIC_PLAYLIST.find((t) => t.id === curId);
      if (track) setCurrentTrackTitle(track.title);
    };
    const musicInterval = setInterval(checkMusic, 600);
    return () => clearInterval(musicInterval);
  }, []);

  const handleToggleMusic = () => {
    sound.playClick();
    if (isPlayingMusic) {
      sound.stopBgm();
      setIsPlayingMusic(false);
    } else {
      sound.playBgm('lofi');
      setIsPlayingMusic(true);
    }
  };

  return (
    <header
      id="poopos-topbar"
      className={`fixed top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-3 text-xs select-none transition-colors duration-500 ${
        isRansomwareActive
          ? 'bg-red-950/80 text-red-200 border-b border-red-800/40 backdrop-blur-md'
          : 'bg-white/40 dark:bg-black/40 text-slate-800 dark:text-slate-100 border-b border-white/20 dark:border-white/10 backdrop-blur-xl shadow-xs'
      }`}
    >
      {/* Left items */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            id="poopos-menu-btn"
            onClick={() => {
              sound.playClick();
              setShowPoopMenu(!showPoopMenu);
            }}
            className="flex items-center space-x-1.5 font-bold hover:opacity-80 px-1 py-0.5 rounded transition-opacity cursor-pointer"
            title="Меню poopOS"
          >
            <span className="text-sm">💩</span>
            <span className="tracking-tight">poopOS</span>
          </button>

          {showPoopMenu && (
            <div
              id="poopos-dropdown"
              className="absolute left-0 top-7 w-56 rounded-lg bg-slate-950/90 text-slate-200 py-1.5 shadow-2xl border border-white/15 z-50 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-2xl"
            >
              <div className="px-3 py-1 font-semibold text-white/90 border-b border-white/10 flex items-center justify-between">
                <span>Об этой системе</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded">v15.4 Liquid</span>
              </div>
              <div className="px-3 py-1.5 text-[11px] text-slate-400">
                Ядро: LiquidGlass OS<br />
                Звуковой движок: Web Audio Synthesizer<br />
                Безопасность: {isRansomwareActive ? '💀 СКОМПРОМЕТИРОВАНО' : '✅ Активна'}
              </div>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  sound.playClick();
                  setShowPoopMenu(false);
                  if (onOpenMusicApp) onOpenMusicApp();
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600/60 text-slate-200 text-xs transition-colors cursor-pointer"
              >
                Открыть poopMusic...
              </button>
            </div>
          )}
        </div>

        <span className="font-semibold">{activeAppTitle || 'Finder'}</span>
        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 hover:text-slate-200 cursor-default">Файл</span>
        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 hover:text-slate-200 cursor-default">Правка</span>
        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 hover:text-slate-200 cursor-default">Вид</span>
        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 hover:text-slate-200 cursor-default">Окно</span>
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Quick BGM Synthesizer Widget */}
        <div className="flex items-center space-x-1.5 bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full border border-white/10 transition-colors">
          <button
            onClick={handleToggleMusic}
            className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer"
            title={isPlayingMusic ? 'Остановить музыку' : 'Включить фоновую музыку'}
          >
            <Music2 className={`w-3.5 h-3.5 ${isPlayingMusic ? 'text-pink-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="text-[10px] hidden md:inline font-mono truncate max-w-[100px]">
              {isPlayingMusic ? currentTrackTitle : 'Музыка выкл'}
            </span>
          </button>
        </div>

        {isRansomwareActive && (
          <div className="flex items-center space-x-1 text-red-400 animate-pulse font-mono font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-600/50">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>ONION-CRYPT</span>
          </div>
        )}

        <button
          id="btn-toggle-sound"
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="hover:opacity-80 p-1 rounded transition-opacity cursor-pointer"
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center space-x-1" title="Wi-Fi: Подключено к PoopNet_5G">
          <Wifi className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center space-x-1" title="Батарея: 98%">
          <span className="text-[10px]">98%</span>
          <Battery className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center space-x-1 font-mono tracking-tight pl-1">
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
};
