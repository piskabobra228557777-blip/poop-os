import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';
import { Lock } from 'lucide-react';

interface TerminalWindowProps {
  isAutoTyping: boolean;
  onCommandExecuted: () => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isAutoTyping,
  onCommandExecuted,
}) => {
  const [typedText, setTypedText] = useState('');
  const [outputLines, setOutputLines] = useState<string[]>([
    'poopOS Terminal v15.4 (Darwin poop-kernel 24.1.0)',
    'Type "help" for a list of commands.',
    '',
  ]);

  const targetCommand = 'onion.exe give system access';
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (!isAutoTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < targetCommand.length) {
        setTypedText(targetCommand.slice(0, currentIndex + 1));
        sound.playTypingKey();
        currentIndex++;
      } else {
        clearInterval(interval);
        // Press Enter & Execute
        setTimeout(() => {
          if (hasExecutedRef.current) return;
          hasExecutedRef.current = true;

          sound.playGlitchZap();
          setOutputLines((prev) => [
            ...prev,
            `poopos-user@poop-macbook ~ % ${targetCommand}`,
            '[+] Взлом системного ядра poopOS...',
            '[+] Отключение системной защиты System Integrity Protection...',
            '[+] Предоставление прав суперпользователя (Root) вирусу ONION.EXE...',
            '[!] ПОЛНЫЙ ДОСТУП ПЕРЕДАН! ПЕРЕХВАТ СИСТЕМЫ POOPOS...',
          ]);
          setTypedText('');

          // Trigger blackout & transition
          setTimeout(() => {
            onCommandExecuted();
          }, 1200);
        }, 500);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isAutoTyping, onCommandExecuted]);

  return (
    <div className="h-full bg-black/95 text-green-400 font-mono text-xs p-4 flex flex-col select-text overflow-y-auto relative">
      {/* Banner if auto-typing is active */}
      {isAutoTyping && (
        <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-red-950/80 text-red-300 border border-red-500/40 px-2.5 py-1 rounded text-[10px]">
          <Lock className="w-3 h-3 text-red-400 animate-pulse" />
          <span>СИСТЕМНЫЙ ВВОД (ОКНО ЗАБЛОКИРОВАНО)</span>
        </div>
      )}

      {outputLines.map((line, idx) => (
        <div key={idx} className="leading-relaxed whitespace-pre-wrap">
          {line}
        </div>
      ))}

      {/* Active input line */}
      <div className="flex items-center space-x-2 leading-relaxed">
        <span className="text-emerald-500 font-bold">poopos-user@poop-macbook ~ %</span>
        <span className="text-white">{typedText}</span>
        <span className="w-2 h-4 bg-green-400 inline-block animate-pulse" />
      </div>
    </div>
  );
};
