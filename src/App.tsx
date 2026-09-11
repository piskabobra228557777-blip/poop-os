/**
 * poopOS - Onion.exe Interactive Desktop Horror Game
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { FileExplorer } from './components/FileExplorer';
import { Browser } from './components/Browser';
import { TerminalWindow } from './components/TerminalWindow';
import { OnionWindow } from './components/OnionWindow';
import { OnionStealAnimation } from './components/OnionStealAnimation';
import { GhostCursor } from './components/GhostCursor';
import { BouncingOnions } from './components/BouncingOnions';
import { RansomwareBanner } from './components/RansomwareBanner';
import { Room3DCutscene } from './components/Room3DCutscene';
import { Jumpscare } from './components/Jumpscare';
import { VictoryModal } from './components/VictoryModal';
import { CalculatorWindow } from './components/CalculatorWindow';
import { NotesWindow } from './components/NotesWindow';
import { MusicWindow } from './components/MusicWindow';
import { PhotosWindow } from './components/PhotosWindow';
import { PaintWindow } from './components/PaintWindow';
import { INITIAL_FILES, RANSOMWARE_FILES, USB_FILES } from './data/initialFiles';
import { GamePhase, FileItem, WindowState } from './types/game';
import { sound } from './utils/sound';
import {
  HardDrive,
  Folder,
  Key,
  ShieldAlert,
  Calculator,
  FileText,
  Music,
  Image as ImageIcon,
  Paintbrush
} from 'lucide-react';

export default function App() {
  // Game Phase
  const [phase, setPhase] = useState<GamePhase>('NORMAL');
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [wallpaperMode, setWallpaperMode] = useState<'liquid' | 'psychedelic'>('liquid');
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);

  // Files State
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [currentFolder, setCurrentFolder] = useState<'root' | 'documents' | 'downloads' | 'videos' | 'usb'>('root');
  const [collectedBtc, setCollectedBtc] = useState<string[]>([]);
  const [isUsbMounted, setIsUsbMounted] = useState(false);

  // Browser & Infection State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [hasOnionOnDesktop, setHasOnionOnDesktop] = useState(false);

  // Ghost Mouse State
  const [ghostPos, setGhostPos] = useState({ x: 300, y: 300 });
  const [isGhostClicking, setIsGhostClicking] = useState(false);
  const [isGhostVisible, setIsGhostVisible] = useState(false);

  // Windows State
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    finder: {
      id: 'finder',
      title: 'Finder — Файлы',
      type: 'finder',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 80, y: 70 },
      size: { width: 720, height: 460 },
      zIndex: 10,
    },
    browser: {
      id: 'browser',
      title: 'Safari — PoopBrowse',
      type: 'browser',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 180, y: 60 },
      size: { width: 780, height: 490 },
      zIndex: 11,
    },
    terminal: {
      id: 'terminal',
      title: 'Терминал — zsh (cmd)',
      type: 'terminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 260, y: 140 },
      size: { width: 620, height: 380 },
      zIndex: 12,
    },
    onion: {
      id: 'onion',
      title: '🧅 Onion.exe — Мастер установки',
      type: 'onion',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 220, y: 100 },
      size: { width: 560, height: 420 },
      zIndex: 13,
    },
    calculator: {
      id: 'calculator',
      title: 'Калькулятор',
      type: 'calculator',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 300, y: 90 },
      size: { width: 340, height: 470 },
      zIndex: 14,
    },
    notes: {
      id: 'notes',
      title: 'Заметки — poopNotes',
      type: 'notes',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 190, y: 80 },
      size: { width: 680, height: 450 },
      zIndex: 15,
    },
    music: {
      id: 'music',
      title: 'Музыка — poopMusic',
      type: 'music',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 230, y: 70 },
      size: { width: 490, height: 500 },
      zIndex: 16,
    },
    photos: {
      id: 'photos',
      title: 'Фото — poopPhotos',
      type: 'photos',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 150, y: 65 },
      size: { width: 730, height: 490 },
      zIndex: 17,
    },
    paint: {
      id: 'paint',
      title: 'Рисование — poopPaint',
      type: 'paint',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 110, y: 55 },
      size: { width: 750, height: 530 },
      zIndex: 18,
    },
  });

  const [highestZIndex, setHighestZIndex] = useState(15);
  const [activeAppTitle, setActiveAppTitle] = useState('Finder');

  // Ransomware Timer & Clues
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [failedBtcIds, setFailedBtcIds] = useState<string[]>([]);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isOfferDeclinedGlitch, setIsOfferDeclinedGlitch] = useState(false);
  const [systemNotification, setSystemNotification] = useState<{
    title: string;
    message: string;
    icon: string;
  } | null>(null);

  // Audio mute toggle
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Window Focus Helper
  const bringToFront = (windowId: string) => {
    const nextZ = highestZIndex + 1;
    setHighestZIndex(nextZ);
    setWindows((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], zIndex: nextZ },
    }));
    setActiveAppTitle(windows[windowId]?.title.split('—')[0].trim() || 'poopOS');
  };

  // Toggle Window Open
  const openWindow = (id: string, folder?: 'root' | 'documents' | 'downloads' | 'videos' | 'usb') => {
    if (folder) setCurrentFolder(folder);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false },
    }));
    bringToFront(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  };

  // Screen Shake Action when user tries to close during download
  const handleBlockedAction = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => {
      setIsScreenShaking(false);
    }, 400);
  }, []);

  // 1. Browser Search Bar Click -> Ad pops up -> Downloads onion.exe
  const handleBrowserSearchClick = () => {
    if (phase === 'NORMAL') {
      sound.playPopAd();
      setShowAd(true);
      setPhase('DOWNLOADING');
      setIsDownloading(true);

      let current = 0;
      const interval = setInterval(() => {
        current += 2.5;
        setDownloadProgress(Math.min(100, current));
        if (current >= 100) {
          clearInterval(interval);
          handleDownloadFinished();
        }
      }, 100);
    }
  };

  // 2. Download finished -> Ghost mouse takes over!
  const handleDownloadFinished = () => {
    setHasOnionOnDesktop(true);
    setPhase('GHOST_CLOSING_WINDOWS');
    setIsGhostVisible(true);

    // Ghost cursor glides to browser close button
    setTimeout(() => {
      const browserWin = windows.browser;
      setGhostPos({ x: browserWin.position.x + 20, y: browserWin.position.y + 18 });

      // Click close on browser
      setTimeout(() => {
        setIsGhostClicking(true);
        sound.playClick();
        closeWindow('browser');

        // Close any other open window
        closeWindow('finder');

        // Ghost cursor glides to desktop icon onion.exe
        setTimeout(() => {
          setIsGhostClicking(false);
          setPhase('GHOST_OPENING_ONION');
          setGhostPos({ x: 60, y: 180 }); // Onion desktop icon position

          // Double click onion.exe
          setTimeout(() => {
            setIsGhostClicking(true);
            sound.playClick();
            setTimeout(() => {
              sound.playClick();
              setIsGhostClicking(false);
              setIsGhostVisible(false);

              // Open Onion.exe Intro Window!
              setPhase('ONION_INTRO');
              openWindow('onion');
              sound.playPopAd();

              // Open Terminal automatically
              setTimeout(() => {
                openWindow('terminal');
                setPhase('CMD_TYPING');
              }, 3000);
            }, 200);
          }, 800);
        }, 800);
      }, 700);
    }, 600);
  };

  // 3. Command typed in Terminal -> Screen Blackout -> Onion steals files
  const handleCommandExecuted = () => {
    closeWindow('terminal');
    closeWindow('onion');
    setIsBlackout(true);
    sound.playBlackout();

    setTimeout(() => {
      setIsBlackout(false);
      sound.playGlitchZap();
      setPhase('ONION_STEALING_FILES');
    }, 2500);
  };

  // 4. Onion finishes returning files -> Offers game
  const handleStealFinished = () => {
    setPhase('ONION_OFFER');
    openWindow('onion');
  };

  // 5. User clicks "Да" in Onion offer -> Starts Ransomware Game
  const startRansomwareGame = () => {
    closeWindow('onion');
    setWallpaperMode('psychedelic');
    sound.playGlitchZap();
    sound.startHorrorDrone();
    setPhase('RANSOMWARE_ACTIVE');

    // Inject ransomware fake & real bitcoin files into files state
    setFiles((prev) => [...prev, ...RANSOMWARE_FILES]);

    // Open Finder to let player explore files on desktop
    openWindow('finder', 'root');

    setSystemNotification({
      title: '🚨 poopOS ЗАШИФРОВАН!',
      message: 'Найди 3 подлинных ключа (.btc) в папках диска poopOS HD за 3 минуты!',
      icon: '🔐',
    });
    setTimeout(() => setSystemNotification(null), 7000);
  };

  // User clicks "Нет" in Onion offer:
  // "а если нажмёшь нет то на секунду экран погаснет а как появится опять то мышь будет на кнопке да и обои будут поменяты на красно чёрные психоделические и начнётся игра"
  const handleRejectGame = () => {
    setIsBlackout(true);
    sound.playGlitchZap();

    setTimeout(() => {
      setIsBlackout(false);
      setIsOfferDeclinedGlitch(true);
      setWallpaperMode('psychedelic');

      setSystemNotification({
        title: '🧅 Onion.exe: Отказ отклонен!',
        message: 'Ха-ха! У тебя нет выбора! Вирус сам нажал кнопку "Да"!',
        icon: '⚠️',
      });
      setTimeout(() => setSystemNotification(null), 5000);

      // Ghost mouse hovers over YES button and clicks it automatically!
      setTimeout(() => {
        startRansomwareGame();
      }, 1200);
    }, 1000);
  };

  // 6. Ransomware 3:00 Countdown Timer
  useEffect(() => {
    if (phase !== 'RANSOMWARE_ACTIVE') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.stopHorrorDrone();
          setPhase('JUMPSCARE');
          return 0;
        }

        const next = prev - 1;

        // At 1:00 remaining (60s), if USB is not yet mounted, force entity cutscene behind player!
        if (next === 60 && !isUsbMounted) {
          sound.playBouncePing();
          setTimeout(() => {
            setPhase('CUTSCENE_3D');
          }, 1500);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isUsbMounted]);

  // 7. Clicking a Bitcoin File in Finder
  const handleBtcClick = (file: FileItem) => {
    if (file.isRealBtc) {
      if (!collectedBtc.includes(file.id)) {
        sound.playFoundBitcoin();
        const nextCollected = [...collectedBtc, file.id];
        setCollectedBtc(nextCollected);

        if (nextCollected.length === 1) {
          setSystemNotification({
            title: '🔑 1-й ключ найден!',
            message: 'Отлично! Ищи 2-й золотой биткоин-ключ в других папках!',
            icon: '✨',
          });
          setTimeout(() => setSystemNotification(null), 4500);
        } else if (nextCollected.length === 2 && !isUsbMounted) {
          setSystemNotification({
            title: '🔑 2-й ключ найден!',
            message: 'Внимание: 3-го ключа нет на диске! Оглянись назад в комнате!',
            icon: '👀',
          });
          setTimeout(() => setSystemNotification(null), 5000);
          // Trigger 3D cutscene to get the 3rd key from behind you!
          setTimeout(() => {
            setPhase('CUTSCENE_3D');
          }, 1500);
        } else if (nextCollected.length === 3) {
          // ALL 3 AUTHENTIC KEYS FOUND! VICTORY!
          sound.stopHorrorDrone();
          setWallpaperMode('liquid');
          setPhase('VICTORY');
        }
      }
    } else {
      // Fake bitcoin clicked: register as failed, buzz sound & slight shake
      sound.playError();
      if (!failedBtcIds.includes(file.id)) {
        setFailedBtcIds((prev) => [...prev, file.id]);
      }
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 300);
    }
  };

  // 8. 3D Cutscene Completed -> Flash drive mounted on poopOS
  const handleCutsceneComplete = () => {
    setPhase('RANSOMWARE_ACTIVE');
    setIsUsbMounted(true);
    setFiles((prev) => [...prev, ...USB_FILES]);
    sound.playUsbPlugChime();

    // Automatically navigate Finder to USB drive so user can search the drive!
    openWindow('finder', 'usb');

    setSystemNotification({
      title: '💾 USB-накопитель подключен к poopOS!',
      message: 'Папка флешки открыта! Найди и дважды кликни по последнему 3-му золотому ключу!',
      icon: '💾',
    });
    setTimeout(() => setSystemNotification(null), 8000);
  };

  // Restart Game from Jumpscare or Victory
  const handleRestartGame = () => {
    sound.stopHorrorDrone();
    setPhase('NORMAL');
    setWallpaperMode('liquid');
    setTimeLeft(180);
    setFiles(INITIAL_FILES);
    setCollectedBtc([]);
    setFailedBtcIds([]);
    setIsUsbMounted(false);
    setIsDownloading(false);
    setDownloadProgress(0);
    setShowAd(false);
    setHasOnionOnDesktop(false);
    setIsGhostVisible(false);
    setIsBlackout(false);
    setIsOfferDeclinedGlitch(false);
    setCurrentFolder('root');

    setWindows((prev) => ({
      finder: { ...prev.finder, isOpen: false },
      browser: { ...prev.browser, isOpen: false },
      terminal: { ...prev.terminal, isOpen: false },
      onion: { ...prev.onion, isOpen: false },
      calculator: { ...prev.calculator, isOpen: false },
      notes: { ...prev.notes, isOpen: false },
      music: { ...prev.music, isOpen: false },
      photos: { ...prev.photos, isOpen: false },
      paint: { ...prev.paint, isOpen: false },
    }));
  };

  return (
    <div
      id="poopos-desktop-root"
      className={`relative w-screen h-screen overflow-hidden select-none transition-all duration-700 ${
        wallpaperMode === 'psychedelic' ? 'psychedelic-bg' : 'bg-slate-900'
      } ${isScreenShaking ? 'shake-screen' : ''}`}
    >
      {/* Custom Selected Wallpaper */}
      {customWallpaper && wallpaperMode === 'liquid' && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-90"
          style={{ backgroundImage: `url(${customWallpaper})` }}
        />
      )}

      {/* Default Liquid Glass Sonoma Wallpaper Mesh */}
      {wallpaperMode === 'liquid' && !customWallpaper && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Glowing colorful glass orbs */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-600/30 blur-[120px]" />
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[140px]" />
          <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full bg-amber-500/20 blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/15 blur-[150px]" />
        </div>
      )}

      {/* Psychedelic Glitched Red-Black Wallpaper when Infected */}
      {wallpaperMode === 'psychedelic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-red-700/40 blur-[130px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-red-950/70 blur-[110px]" />
        </div>
      )}

      {/* Top Bar */}
      <TopBar
        activeAppTitle={activeAppTitle}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        onOpenMusicApp={() => openWindow('music')}
      />

      {/* Ransomware Warning Header Banner */}
      {phase === 'RANSOMWARE_ACTIVE' && (
        <RansomwareBanner
          timeLeftSeconds={timeLeft}
          btcCount={collectedBtc.length}
        />
      )}

      {/* Desktop Icons Grid (macOS multi-column layout) */}
      <div
        id="desktop-icons-container"
        className="absolute top-12 left-4 z-10 flex flex-col flex-wrap max-h-[82vh] gap-3 select-none"
      >
        {/* Macintosh HD / poopOS HD */}
        <button
          id="desktop-icon-hd"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('finder', 'root');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-slate-200 to-slate-400 flex items-center justify-center shadow-lg border border-white/40">
            <HardDrive className="w-7 h-7 text-slate-800" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            poopOS HD
          </span>
        </button>

        {/* Documents */}
        <button
          id="desktop-icon-docs"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('finder', 'documents');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-lg border border-white/40">
            <Folder className="w-7 h-7 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Документы
          </span>
        </button>

        {/* Downloads */}
        <button
          id="desktop-icon-downloads"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('finder', 'downloads');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border border-white/40">
            <Folder className="w-7 h-7 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Загрузки
          </span>
        </button>

        {/* Videos */}
        <button
          id="desktop-icon-videos"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('finder', 'videos');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-purple-400 to-purple-600 flex items-center justify-center shadow-lg border border-white/40">
            <Folder className="w-7 h-7 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Видео
          </span>
        </button>

        {/* Calculator */}
        <button
          id="desktop-icon-calculator"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('calculator');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-amber-500 to-orange-600 flex items-center justify-center shadow-lg border border-white/40">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Калькулятор
          </span>
        </button>

        {/* Notes */}
        <button
          id="desktop-icon-notes"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('notes');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-amber-300 to-yellow-500 flex items-center justify-center shadow-lg border border-white/40">
            <FileText className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Заметки
          </span>
        </button>

        {/* Music */}
        <button
          id="desktop-icon-music"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('music');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-pink-500 to-rose-600 flex items-center justify-center shadow-lg border border-white/40">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Музыка
          </span>
        </button>

        {/* Photos */}
        <button
          id="desktop-icon-photos"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('photos');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg border border-white/40">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Фото
          </span>
        </button>

        {/* Paint */}
        <button
          id="desktop-icon-paint"
          onDoubleClick={() => {
            sound.playClick();
            openWindow('paint');
          }}
          className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-b from-purple-500 to-violet-700 flex items-center justify-center shadow-lg border border-white/40">
            <Paintbrush className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white drop-shadow-md mt-1.5 leading-tight">
            Paint
          </span>
        </button>

        {/* Onion.exe Desktop App icon (Appears after download) */}
        {hasOnionOnDesktop && (
          <button
            id="desktop-icon-onion"
            onDoubleClick={() => {
              sound.playClick();
              openWindow('onion');
            }}
            className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-center cursor-pointer animate-bounce"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-b from-amber-500 to-red-600 flex items-center justify-center shadow-xl border border-red-300 text-2xl relative">
              <span>🧅</span>
            </div>
            <span className="text-[11px] font-bold text-red-300 drop-shadow-md mt-1.5 leading-tight">
              onion.exe
            </span>
          </button>
        )}

        {/* Mounted USB Drive (After 3D cutscene) */}
        {isUsbMounted && (
          <button
            id="desktop-icon-usb"
            onDoubleClick={() => {
              sound.playClick();
              openWindow('finder', 'usb');
            }}
            className="group flex flex-col items-center w-20 p-2 rounded-xl bg-emerald-950/60 border border-emerald-400 hover:bg-emerald-900/60 active:scale-95 transition-all text-center cursor-pointer animate-pulse"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-b from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl border border-emerald-300 text-white">
              <Key className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 drop-shadow-md mt-1.5 leading-tight">
              USB (F:)
            </span>
          </button>
        )}
      </div>

      {/* --- WINDOWS --- */}

      {/* Finder Window */}
      <Window
        id="finder"
        title={windows.finder.title}
        isOpen={windows.finder.isOpen}
        isMinimized={windows.finder.isMinimized}
        isMaximized={windows.finder.isMaximized}
        zIndex={windows.finder.zIndex}
        initialPosition={windows.finder.position}
        initialSize={windows.finder.size}
        onClose={() => closeWindow('finder')}
        onMinimize={() => minimizeWindow('finder')}
        onMaximize={() => maximizeWindow('finder')}
        onFocus={() => bringToFront('finder')}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
      >
        <FileExplorer
          files={files}
          currentFolder={currentFolder}
          onNavigate={(f) => setCurrentFolder(f)}
          onBtcClick={handleBtcClick}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
          collectedBtcIds={collectedBtc}
          isUsbMounted={isUsbMounted}
          failedBtcIds={failedBtcIds}
        />
      </Window>

      {/* Browser Window */}
      <Window
        id="browser"
        title={windows.browser.title}
        isOpen={windows.browser.isOpen}
        isMinimized={windows.browser.isMinimized}
        isMaximized={windows.browser.isMaximized}
        zIndex={windows.browser.zIndex}
        initialPosition={windows.browser.position}
        initialSize={windows.browser.size}
        onClose={() => closeWindow('browser')}
        onMinimize={() => minimizeWindow('browser')}
        onMaximize={() => maximizeWindow('browser')}
        onFocus={() => bringToFront('browser')}
        canCloseOrMinimize={phase !== 'DOWNLOADING'}
        onBlockedAction={handleBlockedAction}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
      >
        <Browser
          onSearchClick={handleBrowserSearchClick}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
          showAd={showAd}
        />
      </Window>

      {/* Terminal Window (cmd) */}
      <Window
        id="terminal"
        title={windows.terminal.title}
        isOpen={windows.terminal.isOpen}
        isMinimized={windows.terminal.isMinimized}
        isMaximized={windows.terminal.isMaximized}
        zIndex={windows.terminal.zIndex}
        initialPosition={windows.terminal.position}
        initialSize={windows.terminal.size}
        onClose={() => {
          if (phase === 'CMD_TYPING') {
            handleBlockedAction();
            return;
          }
          closeWindow('terminal');
        }}
        onMinimize={() => {
          if (phase === 'CMD_TYPING') {
            handleBlockedAction();
            return;
          }
          minimizeWindow('terminal');
        }}
        onMaximize={() => maximizeWindow('terminal')}
        onFocus={() => bringToFront('terminal')}
        canCloseOrMinimize={phase !== 'CMD_TYPING'}
        onBlockedAction={handleBlockedAction}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
      >
        <TerminalWindow
          isAutoTyping={phase === 'CMD_TYPING'}
          onCommandExecuted={handleCommandExecuted}
        />
      </Window>

      {/* Onion Setup / Offer Window */}
      <Window
        id="onion"
        title={windows.onion.title}
        isOpen={windows.onion.isOpen}
        isMinimized={windows.onion.isMinimized}
        isMaximized={windows.onion.isMaximized}
        zIndex={windows.onion.zIndex}
        initialPosition={windows.onion.position}
        initialSize={windows.onion.size}
        onClose={() => closeWindow('onion')}
        onMinimize={() => minimizeWindow('onion')}
        onMaximize={() => maximizeWindow('onion')}
        onFocus={() => bringToFront('onion')}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
      >
        <OnionWindow
          phase={phase === 'ONION_OFFER' ? 'offer' : 'intro'}
          onAcceptGame={startRansomwareGame}
          onRejectGame={handleRejectGame}
          isOfferDeclinedGlitch={isOfferDeclinedGlitch}
        />
      </Window>

      {/* Calculator Window */}
      {windows.calculator && (
        <Window
          id="calculator"
          title={windows.calculator.title}
          isOpen={windows.calculator.isOpen}
          isMinimized={windows.calculator.isMinimized}
          isMaximized={windows.calculator.isMaximized}
          zIndex={windows.calculator.zIndex}
          initialPosition={windows.calculator.position}
          initialSize={windows.calculator.size}
          onClose={() => closeWindow('calculator')}
          onMinimize={() => minimizeWindow('calculator')}
          onMaximize={() => maximizeWindow('calculator')}
          onFocus={() => bringToFront('calculator')}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        >
          <CalculatorWindow />
        </Window>
      )}

      {/* Notes Window */}
      {windows.notes && (
        <Window
          id="notes"
          title={windows.notes.title}
          isOpen={windows.notes.isOpen}
          isMinimized={windows.notes.isMinimized}
          isMaximized={windows.notes.isMaximized}
          zIndex={windows.notes.zIndex}
          initialPosition={windows.notes.position}
          initialSize={windows.notes.size}
          onClose={() => closeWindow('notes')}
          onMinimize={() => minimizeWindow('notes')}
          onMaximize={() => maximizeWindow('notes')}
          onFocus={() => bringToFront('notes')}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        >
          <NotesWindow />
        </Window>
      )}

      {/* Music Window */}
      {windows.music && (
        <Window
          id="music"
          title={windows.music.title}
          isOpen={windows.music.isOpen}
          isMinimized={windows.music.isMinimized}
          isMaximized={windows.music.isMaximized}
          zIndex={windows.music.zIndex}
          initialPosition={windows.music.position}
          initialSize={windows.music.size}
          onClose={() => closeWindow('music')}
          onMinimize={() => minimizeWindow('music')}
          onMaximize={() => maximizeWindow('music')}
          onFocus={() => bringToFront('music')}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        >
          <MusicWindow />
        </Window>
      )}

      {/* Photos Window */}
      {windows.photos && (
        <Window
          id="photos"
          title={windows.photos.title}
          isOpen={windows.photos.isOpen}
          isMinimized={windows.photos.isMinimized}
          isMaximized={windows.photos.isMaximized}
          zIndex={windows.photos.zIndex}
          initialPosition={windows.photos.position}
          initialSize={windows.photos.size}
          onClose={() => closeWindow('photos')}
          onMinimize={() => minimizeWindow('photos')}
          onMaximize={() => maximizeWindow('photos')}
          onFocus={() => bringToFront('photos')}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        >
          <PhotosWindow onSetWallpaper={(url) => setCustomWallpaper(url)} />
        </Window>
      )}

      {/* Paint Window */}
      {windows.paint && (
        <Window
          id="paint"
          title={windows.paint.title}
          isOpen={windows.paint.isOpen}
          isMinimized={windows.paint.isMinimized}
          isMaximized={windows.paint.isMaximized}
          zIndex={windows.paint.zIndex}
          initialPosition={windows.paint.position}
          initialSize={windows.paint.size}
          onClose={() => closeWindow('paint')}
          onMinimize={() => minimizeWindow('paint')}
          onMaximize={() => maximizeWindow('paint')}
          onFocus={() => bringToFront('paint')}
          isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
        >
          <PaintWindow />
        </Window>
      )}

      {/* Onion Stealing Files Animation */}
      {phase === 'ONION_STEALING_FILES' && (
        <OnionStealAnimation onAnimationComplete={handleStealFinished} />
      )}

      {/* DVD Screensaver Bouncing Onions in Ransomware Phase */}
      <BouncingOnions
        isActive={phase === 'RANSOMWARE_ACTIVE'}
        onFirstSplit={() => {
          sound.playGlitchZap();
        }}
      />

      {/* Simulated Ghost Cursor Taking Control */}
      <GhostCursor
        x={ghostPos.x}
        y={ghostPos.y}
        isClicking={isGhostClicking}
        isVisible={isGhostVisible}
      />

      {/* Screen Blackout effect */}
      {isBlackout && (
        <div className="fixed inset-0 bg-black z-90 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      )}

      {/* 3D Three.js Cutscene (Behind You) */}
      {phase === 'CUTSCENE_3D' && (
        <Room3DCutscene onComplete={handleCutsceneComplete} />
      )}

      {/* Jumpscare / Game Over */}
      {phase === 'JUMPSCARE' && (
        <Jumpscare onRestart={handleRestartGame} />
      )}

      {/* Victory Modal */}
      {phase === 'VICTORY' && (
        <VictoryModal
          timeTakenSeconds={180 - timeLeft}
          onRestart={handleRestartGame}
          onClose={() => setPhase('NORMAL')}
        />
      )}

      {/* Floating System / Story Notification Card */}
      {systemNotification && (
        <div
          id="system-story-notification"
          className="fixed top-12 right-6 z-60 max-w-sm w-full bg-slate-900/95 border-2 border-cyan-500/50 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300 pointer-events-auto flex items-start space-x-3"
        >
          <div className="text-2xl p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 shrink-0">
            {systemNotification.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-cyan-200 leading-tight">
              {systemNotification.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              {systemNotification.message}
            </p>
          </div>
          <button
            onClick={() => setSystemNotification(null)}
            className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Dock */}
      <Dock
        onOpenApp={(type) => {
          openWindow(type);
        }}
        openWindows={{
          finder: windows.finder.isOpen,
          browser: windows.browser.isOpen,
          terminal: windows.terminal.isOpen,
          onion: windows.onion.isOpen,
          calculator: windows.calculator?.isOpen || false,
          notes: windows.notes?.isOpen || false,
          music: windows.music?.isOpen || false,
          photos: windows.photos?.isOpen || false,
          paint: windows.paint?.isOpen || false,
        }}
        hasOnionDownloaded={hasOnionOnDesktop}
        isRansomwareActive={phase === 'RANSOMWARE_ACTIVE'}
      />
    </div>
  );
}
