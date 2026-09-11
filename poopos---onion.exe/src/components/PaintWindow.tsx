import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../utils/sound';
import {
  Paintbrush,
  Pencil,
  Eraser,
  RotateCcw,
  Download,
  Palette,
  Check
} from 'lucide-react';

const COLORS = [
  '#000000',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#78716c',
  '#0f172a',
];

export const PaintWindow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(6);
  const [currentTool, setCurrentTool] = useState<'brush' | 'pencil' | 'eraser'>('brush');
  const [savedNotice, setSavedNotice] = useState(false);

  // Initialize canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playPaintStroke();
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2.5;
    } else if (currentTool === 'pencil') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = Math.max(1, brushSize * 0.5);
    } else {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    sound.playBouncePing();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `poopOS_art_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/95 backdrop-blur-2xl text-slate-100 select-none overflow-hidden justify-between">
      {/* Liquid Glass Toolbar */}
      <div className="h-12 border-b border-white/10 px-3 bg-slate-900/90 flex items-center justify-between shrink-0">
        {/* Tool Selectors */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              sound.playClick();
              setCurrentTool('brush');
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              currentTool === 'brush' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Кисть"
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCurrentTool('pencil');
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              currentTool === 'pencil' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Карандаш"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCurrentTool('eraser');
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              currentTool === 'eraser' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Ластик"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Brush Size Slider */}
          <div className="flex items-center space-x-2 pl-3 border-l border-white/10">
            <span className="text-[10px] text-slate-400 font-mono">{brushSize}px</span>
            <input
              type="range"
              min={2}
              max={32}
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-16 accent-blue-500 cursor-pointer h-1 rounded-lg bg-slate-800"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex items-center space-x-1.5">
          {COLORS.map((col) => (
            <button
              key={col}
              onClick={() => {
                sound.playClick();
                setCurrentColor(col);
                if (currentTool === 'eraser') setCurrentTool('brush');
              }}
              style={{ backgroundColor: col }}
              className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                currentColor === col && currentTool !== 'eraser'
                  ? 'border-white scale-125 shadow-lg ring-2 ring-blue-500/50'
                  : 'border-white/20 hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Actions: Clear & Save */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Очистить холст"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={saveDrawing}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            title="Сохранить рисунок"
          >
            {savedNotice ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
            <span>{savedNotice ? 'Сохранено!' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Surface */}
      <div className="flex-1 bg-slate-900/90 flex items-center justify-center p-3 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={700}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-xl shadow-2xl border border-white/20 cursor-crosshair max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};
