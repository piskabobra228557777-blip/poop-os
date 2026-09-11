import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  onFocus: () => void;
  canCloseOrMinimize?: boolean;
  onBlockedAction?: () => void;
  children: React.ReactNode;
  isRansomwareActive?: boolean;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPosition = { x: 100, y: 80 },
  initialSize = { width: 680, height: 440 },
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  canCloseOrMinimize = true,
  onBlockedAction,
  children,
  isRansomwareActive = false,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: initialPosition.x,
    posY: initialPosition.y,
  });

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.posX + dx)),
        y: Math.max(32, Math.min(window.innerHeight - 80, dragRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen || isMinimized) return null;

  const handleCloseAttempt = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canCloseOrMinimize) {
      sound.playShakeBoom();
      onBlockedAction?.();
      return;
    }
    sound.playClick();
    onClose();
  };

  const handleMinimizeAttempt = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canCloseOrMinimize) {
      sound.playShakeBoom();
      onBlockedAction?.();
      return;
    }
    sound.playClick();
    onMinimize();
  };

  return (
    <div
      id={`window-${id}`}
      onMouseDown={onFocus}
      style={{
        position: 'fixed',
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? '32px' : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 32px)' : `${size.height}px`,
        zIndex,
      }}
      className={`flex flex-col rounded-xl overflow-hidden select-none transition-shadow duration-300 ${
        isRansomwareActive
          ? 'bg-slate-950/85 text-red-100 border border-red-500/40 shadow-2xl shadow-red-950/70 backdrop-blur-2xl'
          : 'liquid-glass text-slate-800 dark:text-slate-100 shadow-2xl'
      }`}
    >
      {/* Title Bar */}
      <div
        id={`titlebar-${id}`}
        onMouseDown={handleMouseDown}
        className={`h-9 px-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b ${
          isRansomwareActive
            ? 'bg-red-950/40 border-red-800/30'
            : 'bg-white/30 dark:bg-black/20 border-white/20'
        }`}
      >
        {/* macOS Traffic lights */}
        <div className="flex items-center space-x-2">
          <button
            id={`btn-close-${id}`}
            onClick={handleCloseAttempt}
            className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 flex items-center justify-center group shadow-xs transition-colors"
            title="Закрыть"
          >
            <X className="w-2 h-2 text-rose-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            id={`btn-min-${id}`}
            onClick={handleMinimizeAttempt}
            className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 flex items-center justify-center group shadow-xs transition-colors"
            title="Свернуть"
          >
            <Minus className="w-2 h-2 text-amber-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            id={`btn-max-${id}`}
            onClick={() => {
              sound.playClick();
              onMaximize?.();
            }}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 flex items-center justify-center group shadow-xs transition-colors"
            title="Развернуть"
          >
            <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Title */}
        <div className="font-semibold text-xs text-slate-700 dark:text-slate-200 truncate px-2">
          {title}
        </div>

        <div className="w-12" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>
    </div>
  );
};
