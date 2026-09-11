import React, { useState, useEffect } from 'react';
import { OnionSprite } from './OnionSprite';
import { sound } from '../utils/sound';
import { Folder, FileText, Lock, FileVideo, HardDrive } from 'lucide-react';

interface OnionStealAnimationProps {
  onAnimationComplete: () => void;
}

type StealStage =
  | 'sneaking'
  | 'grabbing'
  | 'hauling'
  | 'stopping'
  | 'inspecting'
  | 'returning'
  | 'putting_back'
  | 'finished';

export const OnionStealAnimation: React.FC<OnionStealAnimationProps> = ({
  onAnimationComplete,
}) => {
  const [stage, setStage] = useState<StealStage>('sneaking');
  const [xPos, setXPos] = useState<number>(5);
  const [speech, setSpeech] = useState<string>('Хе-хе... Пока ты не видишь, заберу всё ценное!');

  useEffect(() => {
    // Sequence Timeline:

    // 1. Sneaking (0 to 2.5s): Creeps in from 5% to 15%
    const sneakTimer = setTimeout(() => {
      setStage('grabbing');
      sound.playBouncePing();
      setSpeech('Опачки! Дипломная работа, пароли, видео — всё забираю!');

      // 2. Grabbing files into bag (2.5s to 5.0s)
      const grabTimer = setTimeout(() => {
        setStage('hauling');
        sound.playClick();
        setSpeech('Ух... тяжёлые файлы! Но теперь ты мне заплатишь!');

        // 3. Hauling files across the screen slowly (5.0s to 10.0s)
        let curX = 15;
        const haulInterval = setInterval(() => {
          curX += 0.45; // Slow, deliberate waddle across screen
          setXPos(curX);

          if (curX >= 52) {
            clearInterval(haulInterval);

            // 4. Sudden Stop (10.0s to 12.5s)
            setStage('stopping');
            sound.playError();
            setSpeech('СТОП... Погоди секунду! 😳');

            // 5. Inspecting bag (12.5s to 16.0s)
            const inspectTimer = setTimeout(() => {
              setStage('inspecting');
              sound.playBouncePing();
              setSpeech('Это что... картинки с котиками и рецепты?! Я перепутал папки!');

              // 6. Returning files (16.0s to 20.0s)
              const returnTimer = setTimeout(() => {
                setStage('returning');
                sound.playClick();
                setSpeech('Кхм... Ладно, несу всё обратно! Я ничего не брал!');

                let retX = 52;
                const retInterval = setInterval(() => {
                  retX -= 0.55;
                  setXPos(retX);

                  if (retX <= 12) {
                    clearInterval(retInterval);

                    // 7. Putting files back (20.0s to 23.0s)
                    setStage('putting_back');
                    sound.playUsbPlugChime();
                    setSpeech('Вот, держи, всё на месте! Но мы ещё не закончили...');

                    // 8. Finished
                    const finishTimer = setTimeout(() => {
                      setStage('finished');
                      onAnimationComplete();
                    }, 2500);

                    return () => clearTimeout(finishTimer);
                  }
                }, 40);
              }, 3000);

              return () => clearTimeout(returnTimer);
            }, 2500);

            return () => clearTimeout(inspectTimer);
          }
        }, 40);

        return () => clearInterval(haulInterval);
      }, 2800);

      return () => clearTimeout(grabTimer);
    }, 1500);

    return () => clearTimeout(sneakTimer);
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-start select-none overflow-hidden bg-black/20 backdrop-blur-[2px] transition-all">
      {/* Visual Indicator of Desktop Theft in progress */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-red-950/90 border-2 border-red-500/80 px-6 py-2 rounded-2xl shadow-2xl text-center">
        <span className="text-red-300 font-mono text-xs uppercase font-bold tracking-widest animate-pulse">
          ⚠️ ONION.EXE ВЗАИМОДЕЙСТВУЕТ С ФАЙЛАМИ СИСТЕМЫ...
        </span>
      </div>

      <div
        style={{
          left: `${xPos}%`,
          transform: stage === 'returning' ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'left 0.05s linear',
        }}
        className="absolute bottom-24 flex flex-col items-center select-none"
      >
        {/* Large, Clear Comic Speech Bubble */}
        <div
          style={{
            transform: stage === 'returning' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
          className="mb-3 bg-white text-slate-950 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-2xl border-3 border-amber-500 max-w-sm text-center leading-snug animate-in fade-in zoom-in duration-200"
        >
          {speech}
          {/* Bubble tail */}
          <div className="w-3.5 h-3.5 bg-white border-r-3 border-b-3 border-amber-500 rotate-45 mx-auto -mb-4.5" />
        </div>

        {/* Character & Stolen Goods */}
        <div className="relative flex items-center">
          {/* Onion Sprite with dynamic mood */}
          <OnionSprite
            mood={
              stage === 'sneaking'
                ? 'sly'
                : stage === 'grabbing'
                ? 'happy'
                : stage === 'hauling'
                ? 'sly'
                : stage === 'stopping'
                ? 'shocked'
                : stage === 'inspecting'
                ? 'shocked'
                : stage === 'returning'
                ? 'sly'
                : 'happy'
            }
            size={130}
            className={
              stage === 'hauling' || stage === 'returning'
                ? 'animate-bounce'
                : stage === 'stopping'
                ? 'animate-ping'
                : ''
            }
          />

          {/* Stolen Bundle of Files in Bag */}
          {(stage === 'grabbing' || stage === 'hauling' || stage === 'stopping' || stage === 'inspecting' || stage === 'returning') && (
            <div
              className={`absolute -right-10 bottom-2 bg-linear-to-br from-amber-900 to-amber-950 border-2 border-amber-400 p-2.5 rounded-2xl shadow-2xl flex items-center space-x-1.5 ${
                stage === 'hauling' ? 'rotate-6' : ''
              }`}
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/90 flex items-center justify-center border border-white/40 shadow">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/90 flex items-center justify-center border border-white/40 shadow">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/90 flex items-center justify-center border border-white/40 shadow">
                  <FileVideo className="w-5 h-5 text-white" />
                </div>
              </div>
              <Lock className="w-5 h-5 text-red-400 animate-pulse ml-1" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono font-black text-amber-200 uppercase">
                  МЕШОК ФАЙЛОВ
                </span>
                <span className="text-[9px] font-mono text-red-300">
                  3.4 GB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
