import React, { useState } from 'react';
import { sound } from '../utils/sound';
import {
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Monitor,
  Heart,
  Grid,
  Check
} from 'lucide-react';

export interface PhotoItem {
  id: string;
  title: string;
  category: 'wallpapers' | 'memes' | 'nature';
  url: string;
  author: string;
  likes: number;
}

const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    title: 'Liquid Glass Obsidian',
    category: 'wallpapers',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    author: 'poopOS Studio',
    likes: 342,
  },
  {
    id: 'p2',
    title: 'Neon Cyber Horizon',
    category: 'wallpapers',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    author: 'Tokyo Grid',
    likes: 819,
  },
  {
    id: 'p3',
    title: 'Кот системного администратора',
    category: 'memes',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    author: 'CatOps',
    likes: 1204,
  },
  {
    id: 'p4',
    title: 'Кофе и ночной код на poopOS',
    category: 'memes',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    author: 'DevLife',
    likes: 875,
  },
  {
    id: 'p5',
    title: 'Туманный лес в сумерках',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    author: 'Nordic Calm',
    likes: 520,
  },
  {
    id: 'p6',
    title: 'Liquid Aurora Glow',
    category: 'wallpapers',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    author: 'GlassWorks',
    likes: 955,
  },
];

interface PhotosWindowProps {
  onSetWallpaper?: (url: string) => void;
}

export const PhotosWindow: React.FC<PhotosWindowProps> = ({ onSetWallpaper }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'wallpapers' | 'memes' | 'nature'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const filtered = activeCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const handleOpenPhoto = (photo: PhotoItem) => {
    sound.playCameraClick();
    setSelectedPhoto(photo);
    setZoom(1);
    setRotation(0);
  };

  const handleSetWallpaper = (url: string) => {
    sound.playBouncePing();
    if (onSetWallpaper) {
      onSetWallpaper(url);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/95 backdrop-blur-2xl text-slate-100 select-none overflow-hidden">
      {/* Category Tabs Header */}
      <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center space-x-1 text-xs">
          {(['all', 'wallpapers', 'memes', 'nature'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600/70 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'Все фото' : cat === 'wallpapers' ? 'Обои' : cat === 'memes' ? 'Мемы и Котики' : 'Природа'}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          {filtered.length} фото
        </span>
      </div>

      {/* Grid of Photos */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handleOpenPhoto(photo)}
              className="group relative rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer bg-slate-900 aspect-video"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                <span className="text-xs font-bold text-white truncate">
                  {photo.title}
                </span>
                <span className="text-[10px] text-slate-300">
                  {photo.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Toolbar */}
          <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-slate-950/80">
            <span className="text-xs font-bold text-slate-200 truncate">
              {selectedPhoto.title}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
                title="Приблизить"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
                title="Отдалить"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
                title="Повернуть"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSetWallpaper(selectedPhoto.url)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer ml-2"
              >
                {appliedNotice ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Monitor className="w-3.5 h-3.5" />}
                <span>{appliedNotice ? 'Установлено!' : 'Сделать обоями'}</span>
              </button>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Large Image Canvas */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              className="max-h-[80%] max-w-[85%] object-contain rounded-xl shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
