import React, { useEffect, useState, useRef } from 'react';
import { sound } from '../utils/sound';
import { RotateCcw, Skull } from 'lucide-react';

interface JumpscareProps {
  onRestart: () => void;
}

export const Jumpscare: React.FC<JumpscareProps> = ({ onRestart }) => {
  const [stage, setStage] = useState<'screamer' | 'bsod'>('screamer');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    sound.playJumpscareScreech();

    // After 3.5 seconds of terrifying jumpscare, transition to BSOD
    const timer = setTimeout(() => {
      setStage('bsod');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Animated glitch canvas for jumpscare
  useEffect(() => {
    if (stage !== 'screamer') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Draw red/black static noise
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() > 0.5 ? 255 : 0;
        data[i] = noise; // Red
        data[i + 1] = noise > 200 && Math.random() > 0.8 ? 50 : 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      // Invert flicker
      if (frame % 3 === 0) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center select-none overflow-hidden bg-black">
      {stage === 'screamer' ? (
        <div className="relative w-full h-full flex items-center justify-center violent-shake">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

          {/* Terrifying 3D Giant Evil Onion Jumpscare Face */}
          <div className="relative z-10 flex flex-col items-center scale-150 animate-ping">
            <svg
              width="480"
              height="480"
              viewBox="0 0 200 200"
              className="drop-shadow-[0_0_80px_rgba(255,0,0,1)] filter contrast-200"
            >
              {/* Spikes / Tentacles */}
              <path d="M95 30 Q 50 -30, 20 20 Q 70 40, 95 48 Z" fill="#7f1d1d" stroke="#ef4444" strokeWidth="4" />
              <path d="M105 30 Q 150 -30, 180 20 Q 130 40, 105 48 Z" fill="#991b1b" stroke="#ef4444" strokeWidth="4" />
              <path d="M100 35 Q 100 -50, 95 -60 Q 110 -20, 100 45 Z" fill="#450a0a" stroke="#b91c1c" strokeWidth="4" />

              {/* Distorted Onion Body with Blood Veins */}
              <path
                d="M100 45 C 170 50, 205 100, 195 160 C 185 210, 140 215, 100 215 C 60 215, 15 210, 5 160 C -5 100, 30 50, 100 45 Z"
                fill="#1c0000"
                stroke="#dc2626"
                strokeWidth="6"
              />

              {/* Bloody Veins */}
              <path d="M60 80 Q 40 120, 70 160" stroke="#ef4444" strokeWidth="4" fill="none" />
              <path d="M140 80 Q 160 120, 130 160" stroke="#ef4444" strokeWidth="4" fill="none" />
              <path d="M100 60 Q 100 110, 90 140" stroke="#b91c1c" strokeWidth="5" fill="none" />

              {/* Horrific Demonic Eyes */}
              <polygon points="45,95 90,115 55,130" fill="#fef08a" stroke="#ffffff" strokeWidth="3" />
              <polygon points="155,95 110,115 145,130" fill="#fef08a" stroke="#ffffff" strokeWidth="3" />
              <circle cx="68" cy="112" r="7" fill="#000000" />
              <circle cx="132" cy="112" r="7" fill="#000000" />
              <circle cx="68" cy="112" r="2" fill="#ff0000" />
              <circle cx="132" cy="112" r="2" fill="#ff0000" />

              {/* Gaping Monstrous Mouth Full of Razor Sharp Teeth */}
              <path
                d="M40 135 Q 100 195, 160 135 Q 100 150, 40 135 Z"
                fill="#000000"
                stroke="#ff0000"
                strokeWidth="4"
              />
              {/* Sharp Teeth Rows */}
              <polygon points="55,140 65,160 75,142" fill="#ffffff" />
              <polygon points="75,142 85,165 95,143" fill="#ffffff" />
              <polygon points="95,143 105,168 115,143" fill="#ffffff" />
              <polygon points="115,143 125,165 135,142" fill="#ffffff" />
              <polygon points="135,142 145,158 150,138" fill="#ffffff" />

              <polygon points="60,158 70,146 80,162" fill="#ffffff" />
              <polygon points="80,162 90,147 100,165" fill="#ffffff" />
              <polygon points="100,165 110,147 120,162" fill="#ffffff" />
              <polygon points="120,162 130,148 140,158" fill="#ffffff" />
            </svg>
            <h1 className="text-6xl font-black text-red-500 font-mono tracking-widest mt-4 uppercase drop-shadow-[0_0_30px_rgba(255,0,0,1)]">
              ВРЕМЯ ВЫШЛО!
            </h1>
          </div>
        </div>
      ) : (
        /* Red/Black Screen of Death */
        <div className="w-full h-full bg-linear-to-b from-red-950 via-black to-slate-950 p-8 flex flex-col justify-between text-red-400 font-mono select-text">
          <div className="max-w-3xl mx-auto space-y-6 pt-12">
            <div className="flex items-center space-x-3 text-red-500 border-b border-red-800 pb-4">
              <Skull className="w-10 h-10 animate-pulse" />
              <div>
                <h1 className="text-2xl font-black tracking-wider">
                  POOPOS KERNEL PANIC: FATAL_ONION_CRYPT_EXTINCTION
                </h1>
                <p className="text-xs text-red-400/80">
                  STOP: 0x000000666 (0xDEADDEAD, 0x00000003, 0x00000000, 0xONIONEXE)
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Операционная система poopOS была полностью уничтожена вирусом Onion.exe.
              Все системные разделы, пользовательские файлы, пароли и видео зашифрованы и стёрты навсегда.
            </p>

            <div className="bg-black/70 p-4 rounded-xl border border-red-900/50 text-xs text-red-300 space-y-1">
              <div>&gt; Decryption key: NOT PROVIDED</div>
              <div>&gt; Bitcoins recovered: 0/3 (Time expired: 3:00)</div>
              <div>&gt; Entity behind monitor: CONSUMED YOUR DATA</div>
              <div>&gt; Dump written to: /dev/null</div>
            </div>

            <div className="pt-6">
              <button
                id="btn-restart-game"
                onClick={() => {
                  sound.playClick();
                  onRestart();
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-red-950/80 transition-all cursor-pointer flex items-center space-x-2 border border-red-400"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Перезагрузить poopOS и попробовать снова</span>
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-red-500/50">
            poopOS 15.4 • Onion.exe Survival Horror Experience
          </div>
        </div>
      )}
    </div>
  );
};
