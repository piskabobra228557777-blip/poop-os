import React, { useEffect, useRef, useState } from 'react';
import { OnionSprite } from './OnionSprite';
import { sound } from '../utils/sound';

interface OnionEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  quoteIndex: number;
}

interface BouncingOnionsProps {
  isActive: boolean;
  onFirstSplit?: () => void;
}

const ONION_QUOTES = [
  'Тик-так! ⏱️',
  '3 Биткойна! 💸',
  'Где твои файлы? 😈',
  'Я повсюду! 🧅',
  'Время уходит! ⌛',
  'Деление! 💥',
];

export const BouncingOnions: React.FC<BouncingOnionsProps> = ({
  isActive,
  onFirstSplit,
}) => {
  const [onions, setOnions] = useState<OnionEntity[]>([
    {
      id: 1,
      x: window.innerWidth / 2 - 90,
      y: window.innerHeight / 2 - 90,
      vx: 3.5,
      vy: 2.8,
      size: 160,
      quoteIndex: 0,
    },
  ]);
  const [isStopped, setIsStopped] = useState(false);

  const onionsRef = useRef(onions);
  onionsRef.current = onions;

  const isStoppedRef = useRef(isStopped);
  isStoppedRef.current = isStopped;

  const hasFirstSplitTriggered = useRef(false);

  // Animation Loop (requestAnimationFrame) for DVD bounce physics
  useEffect(() => {
    if (!isActive) return;

    let animId: number;

    const loop = () => {
      if (!isStoppedRef.current) {
        const topBound = 40; // Top bar height
        const bottomBound = window.innerHeight - 70; // Dock boundary
        const leftBound = 10;
        const rightBound = window.innerWidth - 10;

        setOnions((prevOnions) =>
          prevOnions.map((onion) => {
            let nextX = onion.x + onion.vx;
            let nextY = onion.y + onion.vy;
            let nextVx = onion.vx;
            let nextVy = onion.vy;

            // Bounce X
            if (nextX <= leftBound) {
              nextX = leftBound;
              nextVx = Math.abs(onion.vx);
              sound.playBouncePing();
            } else if (nextX + onion.size >= rightBound) {
              nextX = rightBound - onion.size;
              nextVx = -Math.abs(onion.vx);
              sound.playBouncePing();
            }

            // Bounce Y
            if (nextY <= topBound) {
              nextY = topBound;
              nextVy = Math.abs(onion.vy);
              sound.playBouncePing();
            } else if (nextY + onion.size >= bottomBound) {
              nextY = bottomBound - onion.size;
              nextVy = -Math.abs(onion.vy);
              sound.playBouncePing();
            }

            return {
              ...onion,
              x: nextX,
              y: nextY,
              vx: nextVx,
              vy: nextVy,
            };
          })
        );
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  // Every 10 seconds: stop for 1 second, then split!
  useEffect(() => {
    if (!isActive) return;

    const splitTimer = setInterval(() => {
      // 1) Stop for 1 second
      setIsStopped(true);
      sound.playSplitGlitch();

      setTimeout(() => {
        // 2) Split each onion into 2 slightly smaller clones!
        setOnions((prev) => {
          // Cap total onions at 16 to avoid performance drop
          if (prev.length >= 16) {
            setIsStopped(false);
            return prev;
          }

          const newBatch: OnionEntity[] = [];
          prev.forEach((item, idx) => {
            const nextSize = Math.max(85, item.size * 0.82);
            // Clone 1
            newBatch.push({
              ...item,
              size: nextSize,
              vx: (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 2),
              vy: (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 2),
              quoteIndex: (item.quoteIndex + 1) % ONION_QUOTES.length,
            });
            // Clone 2 (new direction)
            newBatch.push({
              id: Date.now() + idx + Math.random(),
              x: Math.min(window.innerWidth - nextSize - 20, item.x + 20),
              y: Math.min(window.innerHeight - nextSize - 80, item.y + 20),
              size: nextSize,
              vx: (Math.random() > 0.5 ? 1 : -1) * (3.0 + Math.random() * 2),
              vy: (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 2),
              quoteIndex: Math.floor(Math.random() * ONION_QUOTES.length),
            });
          });

          setIsStopped(false);
          return newBatch;
        });

        // Trigger ransom banner on first split if not already
        if (!hasFirstSplitTriggered.current) {
          hasFirstSplitTriggered.current = true;
          onFirstSplit?.();
        }
      }, 1000);
    }, 10000);

    return () => clearInterval(splitTimer);
  }, [isActive, onFirstSplit]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {onions.map((onion) => (
        <div
          key={onion.id}
          style={{
            transform: `translate3d(${onion.x}px, ${onion.y}px, 0)`,
            width: `${onion.size}px`,
            height: `${onion.size + 36}px`,
            transition: isStopped ? 'filter 0.3s' : 'none',
          }}
          className={`absolute pointer-events-auto rounded-xl overflow-hidden liquid-glass-dark border-2 border-red-500/80 shadow-2xl flex flex-col items-center select-none ${
            isStopped ? 'filter saturate(200%) brightness(1.5) scale-105' : ''
          }`}
        >
          {/* Mini Window Bar */}
          <div className="w-full h-5 bg-red-950/80 px-2 flex items-center justify-between border-b border-red-500/40">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-[9px] font-mono text-red-200 truncate font-bold">
              🧅 onion.exe
            </span>
          </div>

          {/* Onion Body */}
          <div className="flex-1 flex flex-col items-center justify-center p-1 relative w-full">
            <OnionSprite
              mood={isStopped ? 'shocked' : 'evil'}
              size={onion.size * 0.65}
              className={isStopped ? 'animate-ping' : ''}
            />
            {/* Quote badge */}
            <div className="text-[9px] font-bold text-red-300 bg-red-950/90 border border-red-600/50 px-1.5 py-0.5 rounded-full font-mono mt-0.5 max-w-[90%] truncate text-center">
              {ONION_QUOTES[onion.quoteIndex]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
