import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import {
  Globe,
  Lock,
  RotateCw,
  X,
  Minus,
  Square,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Laugh,
  Crosshair,
} from 'lucide-react';

interface FinalPrankBrowserProps {
  onComplete: () => void;
}

type PrankStep = 'opening' | 'evil' | 'friendly' | 'closing';

export const FinalPrankBrowser: React.FC<FinalPrankBrowserProps> = ({ onComplete }) => {
  const [step, setStep] = useState<PrankStep>('opening');
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse capture: clamp cursor to dead center like 3D games pointer lock
  useEffect(() => {
    // Hide default OS cursor
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Heavy magnetic spring resistance: cursor cannot leave the center!
      const dx = (e.clientX - centerX) * 0.08;
      const dy = (e.clientY - centerY) * 0.08;

      // Clamp to max 24px jitter radius
      const clampedX = Math.max(-24, Math.min(24, dx));
      const clampedY = Math.max(-24, Math.min(24, dy));

      setMouseOffset({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.style.cursor = originalCursor;
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main scripted timeline of the prank
  useEffect(() => {
    sound.playClick();

    // 1) Step: After 1.4s, glass shatters & evil onion crawls out
    const evilTimer = setTimeout(() => {
      setStep('evil');
      setIsShaking(true);
      sound.playGlassShatter();
      sound.playEvilLaugh();

      // Stop shake after 1s
      setTimeout(() => setIsShaking(false), 900);
    }, 1400);

    // 2) Step: After 5.4s, record scratch + morphs into friendly laughing onion
    const friendlyTimer = setTimeout(() => {
      setStep('friendly');
      sound.playRecordScratch();
      sound.playFunnyCartoonLaugh();

      // Fire victory confetti again!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 100000,
      });
    }, 5600);

    // 3) Step: After 10s, closes browser smoothly
    const closingTimer = setTimeout(() => {
      setStep('closing');
      sound.playWhooshClose();

      // Finish after slide-down transition
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 10200);

    return () => {
      clearTimeout(evilTimer);
      clearTimeout(friendlyTimer);
      clearTimeout(closingTimer);
    };
  }, [onComplete]);

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

  return (
    <div
      ref={containerRef}
      id="final-prank-browser-overlay"
      className={`fixed inset-0 z-120 flex flex-col bg-black select-none overflow-hidden transition-all duration-700 ${
        step === 'closing' ? 'opacity-0 scale-90 translate-y-16 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'
      } ${isShaking ? 'animate-shake' : ''}`}
      style={{ cursor: 'none' }}
    >
      {/* Fake Fullscreen Browser Chrome */}
      <div className="w-full bg-slate-900 border-b border-slate-700/80 flex flex-col shadow-2xl shrink-0">
        {/* Title Bar & Tabs */}
        <div className="h-10 bg-slate-950 flex items-center justify-between px-3">
          {/* macOS window controls */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center opacity-80">
              <X className="w-2 h-2 text-red-950" />
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 flex items-center justify-center">
              <Minus className="w-2 h-2 text-yellow-950" />
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-80 flex items-center justify-center">
              <Square className="w-1.5 h-1.5 text-green-950" />
            </div>
          </div>

          {/* Active Tab */}
          <div className="flex items-center space-x-2 bg-slate-900 px-4 py-1.5 rounded-t-lg border-t-2 border-red-500 text-xs text-white max-w-sm w-full font-mono">
            {step === 'friendly' ? (
              <Laugh className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
            )}
            <span className="truncate font-semibold">
              {step === 'friendly' ? '😂 poopOS — ЭТО БЫЛ ПРАНК!' : '⚠️ darkweb.onion/critical-root-payload'}
            </span>
          </div>

          <div className="w-12" />
        </div>

        {/* Address Bar */}
        <div className="h-11 bg-slate-900 px-4 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <ArrowLeft className="w-4 h-4 opacity-50" />
            <ArrowRight className="w-4 h-4 opacity-50" />
            <RotateCw className="w-4 h-4 animate-spin opacity-80 text-cyan-400" />
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg h-8 flex items-center px-3 space-x-2 text-xs font-mono">
            {step === 'friendly' ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            )}
            <span className={step === 'friendly' ? 'text-emerald-300' : 'text-red-400'}>
              {step === 'friendly'
                ? 'https://poopos.fun/congratulations-prank-revealed'
                : 'https://darkweb.onion/escape-is-impossible/root-payload.exe'}
            </span>
          </div>

          <Globe className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Browser Viewport Area */}
      <div className="relative flex-1 bg-radial from-slate-900 via-slate-950 to-black flex items-center justify-center overflow-hidden">
        {/* Atmospheric matrix/red grid background */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            step === 'friendly' ? 'opacity-30 bg-radial from-emerald-950 to-slate-950' : 'opacity-70 bg-radial from-red-950 via-slate-950 to-black'
          }`}
          style={{
            backgroundImage:
              step === 'friendly'
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)'
                : 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Realistic Shattered Glass Crack Lines (active in evil and friendly phases) */}
        {(step === 'evil' || step === 'friendly') && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 drop-shadow-2xl opacity-90 transition-opacity duration-1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center impact crater */}
            <circle
              cx="50%"
              cy="50%"
              r="60"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeDasharray="4 2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="95"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
            {/* Crack radial lines exploding from center */}
            <path
              d="M 50% 50% L 10% 15% M 50% 50% L 85% 10% M 50% 50% L 95% 60% M 50% 50% L 75% 90% M 50% 50% L 20% 85% M 50% 50% L 5% 55% M 50% 50% L 40% 5% M 50% 50% L 60% 95%"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 45% 42% L 25% 30% L 18% 40% M 55% 44% L 70% 35% L 80% 45% M 52% 58% L 65% 75% L 60% 88% M 46% 56% L 32% 70% L 15% 72%"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )}

        {/* Opening warning message (before glass shatters) */}
        {step === 'opening' && (
          <div className="z-10 text-center space-y-4 max-w-lg px-6 animate-pulse">
            <div className="text-6xl animate-bounce">🧅</div>
            <h2 className="text-3xl font-black text-red-500 font-mono tracking-tight">
              ПОПЫТКА ЗАКРЫТИЯ poopOS...
            </h2>
            <p className="text-slate-400 font-mono text-xs">
              Загрузка протокола перехвата устройства...
            </p>
          </div>
        )}

        {/* Evil Onion Character (Phase: EVIL) */}
        {step === 'evil' && (
          <div className="relative z-30 flex flex-col items-center animate-in zoom-in-50 duration-500 text-center max-w-2xl px-4">
            {/* Sinister glowing aura */}
            <div className="absolute -inset-10 bg-red-600/30 rounded-full blur-3xl animate-pulse pointer-events-none" />

            {/* Custom Evil Onion SVG with sharp fangs and terrifying glowing eyes */}
            <div className="relative mb-6 animate-wiggle">
              <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-2xl filter drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">
                <defs>
                  <linearGradient id="evilSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="60%" stopColor="#991b1b" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </linearGradient>
                </defs>
                {/* Sprouts */}
                <path d="M95 40 C 90 5, 65 0, 50 15 C 65 30, 85 45, 95 48 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="3" />
                <path d="M105 40 C 115 5, 140 0, 150 15 C 135 30, 115 45, 105 48 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="3" />
                <path d="M100 45 C 98 10, 102 5, 100 0 C 104 5, 108 20, 102 45 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
                {/* Bulb */}
                <path
                  d="M100 45 C 155 50, 185 100, 180 150 C 175 190, 135 198, 100 198 C 65 198, 25 190, 20 150 C 15 100, 45 50, 100 45 Z"
                  fill="url(#evilSkin)"
                  stroke="#450a0a"
                  strokeWidth="5"
                />
                {/* Red veins */}
                <path d="M70 70 Q 50 90 40 120" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M130 70 Q 150 90 160 120" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.6" />
                {/* Fierce angled evil eyebrows */}
                <path d="M50 85 L 85 100" stroke="#000" strokeWidth="6" strokeLinecap="round" />
                <path d="M150 85 L 115 100" stroke="#000" strokeWidth="6" strokeLinecap="round" />
                {/* Menacing glowing red eyes with yellow slits */}
                <ellipse cx="72" cy="110" rx="14" ry="10" fill="#000" />
                <ellipse cx="128" cy="110" rx="14" ry="10" fill="#000" />
                <ellipse cx="72" cy="110" rx="6" ry="9" fill="#facc15" className="animate-pulse" />
                <ellipse cx="128" cy="110" rx="6" ry="9" fill="#facc15" className="animate-pulse" />
                {/* Wide predatory grin with sharp teeth */}
                <path d="M 55 145 Q 100 190 145 145 Z" fill="#000" stroke="#450a0a" strokeWidth="3" />
                {/* Sharp jagged teeth */}
                <path d="M 65 147 L 72 160 L 80 147 L 90 162 L 100 147 L 110 162 L 120 147 L 128 160 L 135 147" fill="#fff" />
                <path d="M 70 168 L 78 155 L 88 168 L 98 155 L 108 168 L 118 155 L 126 168" fill="#fff" />
              </svg>

              <div className="absolute -top-3 -right-2 text-2xl animate-bounce">⚡</div>
            </div>

            {/* Menacing dialogue box */}
            <div className="bg-red-950/95 border-2 border-red-500 rounded-3xl p-5 text-white shadow-2xl backdrop-blur-md space-y-2 border-dashed">
              <span className="bg-red-600 text-[11px] font-mono font-black uppercase px-3 py-1 rounded-full text-white tracking-widest">
                💀 СИСТЕМА ПОЛНОСТЬЮ ЗАХВАЧЕНА
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-red-400 tracking-tight leading-tight">
                «ХА-ХА-ХА! ТЫ ДУМАЛ, ЧТО ЭТО ВСЁ?!»
              </h1>
              <p className="text-sm sm:text-base text-red-200 font-bold max-w-md mx-auto leading-snug">
                «ЭТО ЕЩЁ НЕ КОНЕЦ! ТВОЙ КОМПЬЮТЕР ТЕПЕРЬ МОЙ НАВСЕГДА!»
              </p>
            </div>
          </div>
        )}

        {/* Friendly Laughing Onion (Phase: FRIENDLY) */}
        {step === 'friendly' && (
          <div className="relative z-30 flex flex-col items-center animate-in zoom-in-75 duration-300 text-center max-w-2xl px-4">
            {/* Cheerful Golden Aura */}
            <div className="absolute -inset-10 bg-yellow-400/25 rounded-full blur-3xl pointer-events-none" />

            {/* Super cute anime laughing onion */}
            <div className="relative mb-6 animate-bounce">
              <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-2xl">
                <defs>
                  <radialGradient id="friendlySkin" cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#fde047" />
                    <stop offset="85%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </radialGradient>
                </defs>
                {/* Green happy sprouts with flower/star */}
                <path d="M95 40 C 90 10, 70 5, 55 15 C 65 30, 85 45, 95 48 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
                <path d="M105 40 C 110 5, 130 0, 145 10 C 135 28, 115 45, 105 48 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="3" />
                <path d="M100 45 C 98 15, 102 10, 100 0 C 103 10, 108 25, 102 45 Z" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
                {/* Bulb */}
                <path
                  d="M100 45 C 155 50, 185 100, 180 150 C 175 190, 135 198, 100 198 C 65 198, 25 190, 20 150 C 15 100, 45 50, 100 45 Z"
                  fill="url(#friendlySkin)"
                  stroke="#a16207"
                  strokeWidth="4"
                />
                {/* Rosy blush cheeks */}
                <circle cx="50" cy="135" r="14" fill="#f43f5e" opacity="0.65" />
                <circle cx="150" cy="135" r="14" fill="#f43f5e" opacity="0.65" />
                {/* Cute anime laughing closed eyes: ^^ */}
                <path d="M 55 110 Q 72 90 90 110" stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 110 110 Q 128 90 145 110" stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Big happy open mouth with pink tongue */}
                <path d="M 65 130 Q 100 185 135 130 Z" fill="#451a03" />
                <path d="M 80 150 Q 100 180 120 150 Z" fill="#fb7185" />
                {/* Teeth on top */}
                <rect x="88" y="130" width="24" height="8" rx="3" fill="#ffffff" />
              </svg>

              {/* Laughing emoji bubble */}
              <div className="absolute -top-4 -right-4 text-4xl animate-spin duration-3000">
                😂
              </div>
            </div>

            {/* Funny joke revelation speech card */}
            <div className="bg-slate-900/95 border-3 border-yellow-400 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-md space-y-2.5 max-w-lg">
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                🎉 ПРАНК УДАЛСЯ НА 100%!
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-yellow-300 tracking-tight leading-tight">
                «АХАХАХАХАХА! ДА ЛАДНО ТЕБЕ, РАССЛАБЬСЯ! 😂»
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                «ЭТО ВСЁ БЫЛ ПРИКОЛ! ТЫ БЫ ВИДЕЛ СВОЁ ЛИЦО, ХА-ХА-ХА! Твой друг просто решил подшутить над тобой. Ты красавчик, выжил и спас poopOS!»
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-300">
                [ Окно браузера закроется через пару секунд... 👋 ]
              </div>
            </div>
          </div>
        )}

        {/* 3D-Game Style Centered Locked Mouse Pointer */}
        <div
          className="fixed pointer-events-none z-150 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${centerX + mouseOffset.x}px`,
            top: `${centerY + mouseOffset.y}px`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing crosshair ring */}
            <div
              className={`w-10 h-10 rounded-full border-2 border-dashed animate-spin ${
                step === 'friendly' ? 'border-yellow-400' : 'border-red-500'
              }`}
            />
            {/* Center target crosshair icon */}
            <Crosshair
              className={`absolute w-6 h-6 ${
                step === 'friendly' ? 'text-yellow-300' : 'text-red-500'
              }`}
            />

            {/* Locked mouse label tag */}
            <div
              className={`absolute top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold whitespace-nowrap shadow-xl border flex items-center space-x-1 ${
                step === 'friendly'
                  ? 'bg-yellow-950 text-yellow-200 border-yellow-400'
                  : 'bg-red-950 text-red-200 border-red-500 animate-pulse'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>
                {step === 'friendly' ? 'КУРСОР РАЗБЛОКИРОВАН' : 'КУРСОР ЗАХВАЧЕН (ЦЕНТР)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
