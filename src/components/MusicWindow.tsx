import React, { useState, useEffect, useRef } from 'react';
import { sound, MUSIC_PLAYLIST, MusicTrackInfo, MusicTrackId } from '../utils/sound';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Radio,
  Music2,
  Sparkles
} from 'lucide-react';

export const MusicWindow: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(sound.getIsPlayingBgm());
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(15);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTrack = MUSIC_PLAYLIST[currentTrackIndex];

  // Sync state with global audio engine
  useEffect(() => {
    const checkPlaying = () => {
      setIsPlaying(sound.getIsPlayingBgm());
      const curId = sound.getCurrentTrack();
      const idx = MUSIC_PLAYLIST.findIndex((t) => t.id === curId);
      if (idx !== -1) setCurrentTrackIndex(idx);
    };
    checkPlaying();
    const interval = setInterval(checkPlaying, 500);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    sound.playClick();
    if (isPlaying) {
      sound.stopBgm();
      setIsPlaying(false);
    } else {
      sound.playBgm(activeTrack.id);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (index: number) => {
    sound.playClick();
    setCurrentTrackIndex(index);
    sound.playBgm(MUSIC_PLAYLIST[index].id);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleNext = () => {
    sound.playClick();
    const nextIdx = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrev = () => {
    sound.playClick();
    const prevIdx = (currentTrackIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
    handleSelectTrack(prevIdx);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sound.setBgmVolume(newVol);
  };

  // Real-time canvas audio visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const freqData = sound.getAnalyserData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 28;
      const barWidth = canvas.width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? freqData[i % freqData.length] || Math.sin(Date.now() * 0.005 + i) * 30 + 40 : 6;
        const barHeight = Math.max(4, (val / 255) * (canvas.height - 8));
        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(0.5, '#8b5cf6');
        grad.addColorStop(1, '#ec4899');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="h-full flex flex-col bg-slate-950/95 backdrop-blur-3xl text-slate-100 select-none overflow-hidden justify-between p-4">
      {/* Top Track & Album Info */}
      <div className="flex items-center space-x-4 bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-xl">
        {/* Spinning Vinyl Graphic */}
        <div className="relative shrink-0">
          <div
            className={`w-20 h-20 rounded-full bg-linear-to-tr from-slate-950 via-slate-800 to-slate-900 border-2 border-white/20 flex items-center justify-center shadow-2xl ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            {/* Vinyl grooves */}
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-500 to-indigo-600 flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/40" />
              </div>
            </div>
          </div>
          {isPlaying && (
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {activeTrack.genre}
            </span>
            {isPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white truncate mt-1">
            {activeTrack.title}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {activeTrack.artist}
          </p>
        </div>
      </div>

      {/* Real-time Frequency Spectrum Visualizer */}
      <div className="my-2 bg-slate-900/60 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
        <canvas
          ref={canvasRef}
          width={420}
          height={64}
          className="w-full h-16 rounded-lg"
        />
      </div>

      {/* Playlist Tracks */}
      <div className="flex-1 overflow-y-auto space-y-1 my-1 pr-1 max-h-40">
        {MUSIC_PLAYLIST.map((track, idx) => {
          const isSelected = idx === currentTrackIndex;
          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(idx)}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border text-xs ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400/50 text-white font-medium shadow-md'
                  : 'hover:bg-white/5 border-transparent text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Music2 className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="truncate">{track.title}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">
                {track.duration}
              </span>
            </div>
          );
        })}
      </div>

      {/* Player Controls Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-white/10 shadow-2xl flex flex-col space-y-2 mt-2">
        <div className="flex items-center justify-between">
          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Предыдущий трек"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="p-3 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/40 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Пауза' : 'Воспроизведение'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Следующий трек"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-blue-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
