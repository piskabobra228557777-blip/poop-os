import React, { useState } from 'react';
import {
  Folder,
  FileText,
  FileVideo,
  FileImage,
  FileArchive,
  Key,
  HardDrive,
  Download,
  Video,
  File,
  Search,
  CheckCircle2,
  XCircle,
  Usb,
  AlertTriangle
} from 'lucide-react';
import { FileItem } from '../types/game';
import { sound } from '../utils/sound';

interface FileExplorerProps {
  files: FileItem[];
  currentFolder: 'root' | 'documents' | 'downloads' | 'videos' | 'usb';
  onNavigate: (folder: 'root' | 'documents' | 'downloads' | 'videos' | 'usb') => void;
  onBtcClick: (file: FileItem) => void;
  isRansomwareActive: boolean;
  collectedBtcIds: string[];
  isUsbMounted: boolean;
  failedBtcIds?: string[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  currentFolder,
  onNavigate,
  onBtcClick,
  isRansomwareActive,
  collectedBtcIds,
  isUsbMounted,
  failedBtcIds = [],
}) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const folderFiles = files.filter((f) => {
    if (f.folder !== currentFolder) return false;
    if (searchFilter.trim() === '') return true;
    return f.name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const handleFileClick = (file: FileItem) => {
    sound.playClick();
    setSelectedFile(file);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      sound.playClick();
      if (file.id === 'f-doc') onNavigate('documents');
      else if (file.id === 'f-down') onNavigate('downloads');
      else if (file.id === 'f-vid') onNavigate('videos');
      return;
    }

    if (file.type === 'btc') {
      if (collectedBtcIds.includes(file.id)) {
        setStatusMessage('Этот ключ уже успешно активирован!');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }

      if (!file.isRealBtc) {
        setStatusMessage('❌ Ошибка проверки: Хеш ключа повреждён или подделка!');
        setTimeout(() => setStatusMessage(null), 2500);
      } else {
        setStatusMessage('✅ Подлинный крипто-ключ успешно расшифрован!');
        setTimeout(() => setStatusMessage(null), 2500);
      }
      onBtcClick(file);
      return;
    }

    if (file.type === 'text' && file.content) {
      sound.playClick();
      setPreviewContent(file.content);
      return;
    }

    sound.playClick();
  };

  const getIconForFile = (file: FileItem) => {
    const isCollected = collectedBtcIds.includes(file.id);
    const isFailed = failedBtcIds.includes(file.id);

    if (file.type === 'folder') return <Folder className="w-10 h-10 text-blue-400 fill-blue-400/20" />;
    if (file.type === 'btc') {
      return (
        <div className="relative">
          <Key
            className={`w-10 h-10 ${
              isCollected
                ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : isFailed
                ? 'text-red-400/70'
                : 'text-amber-400'
            }`}
          />
          {isCollected && (
            <CheckCircle2 className="w-4 h-4 text-emerald-300 absolute -top-1 -right-1 bg-black rounded-full" />
          )}
          {isFailed && !isCollected && (
            <XCircle className="w-4 h-4 text-red-500 absolute -top-1 -right-1 bg-black rounded-full" />
          )}
        </div>
      );
    }
    if (file.type === 'video') return <FileVideo className="w-10 h-10 text-purple-400" />;
    if (file.type === 'image') return <FileImage className="w-10 h-10 text-emerald-400" />;
    if (file.type === 'zip') return <FileArchive className="w-10 h-10 text-amber-400" />;
    if (file.type === 'text') return <FileText className="w-10 h-10 text-slate-300" />;
    return <File className="w-10 h-10 text-slate-400" />;
  };

  const folderNames: Record<string, string> = {
    root: 'Рабочий стол (Корень)',
    documents: 'Мои Документы',
    downloads: 'Загрузки (Downloads)',
    videos: 'Личные Видео',
    usb: 'USB Накопитель (F:)',
  };

  return (
    <div className="flex h-full bg-slate-900/95 text-slate-100 select-none">
      {/* Sidebar */}
      <aside className="w-48 bg-slate-950/70 border-r border-white/10 p-2.5 flex flex-col space-y-1 text-xs">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
          Избранное
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('root');
          }}
          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
            currentFolder === 'root' ? 'bg-blue-600/70 text-white font-medium' : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <HardDrive className="w-4 h-4 text-slate-400" />
          <span>Рабочий стол</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('documents');
          }}
          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
            currentFolder === 'documents' ? 'bg-blue-600/70 text-white font-medium' : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <Folder className="w-4 h-4 text-blue-400" />
          <span>Документы</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('downloads');
          }}
          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
            currentFolder === 'downloads' ? 'bg-blue-600/70 text-white font-medium' : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Загрузки</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onNavigate('videos');
          }}
          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
            currentFolder === 'videos' ? 'bg-blue-600/70 text-white font-medium' : 'hover:bg-white/10 text-slate-300'
          }`}
        >
          <Video className="w-4 h-4 text-purple-400" />
          <span>Видео</span>
        </button>

        {/* USB Drive Sidebar Item */}
        {isUsbMounted && (
          <div className="pt-2 border-t border-white/10 mt-2">
            <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider px-2 py-0.5 animate-pulse">
              Внешние устройства
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('usb');
              }}
              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg transition-all text-left ${
                currentFolder === 'usb'
                  ? 'bg-emerald-600/70 text-white font-bold'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
              }`}
            >
              <Usb className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Флешка (F:)</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Folder Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation & Search header */}
        <div className="h-10 border-b border-white/10 px-4 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <span>{folderNames[currentFolder] || currentFolder}</span>
            <span className="text-slate-400 text-[11px]">({folderFiles.length} объектов)</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Поиск файлов..."
              className="bg-slate-950/70 text-xs pl-8 pr-3 py-1 rounded-md border border-white/15 focus:outline-hidden focus:border-blue-500 text-slate-100 placeholder:text-slate-500 w-44"
            />
          </div>
        </div>

        {/* Ransomware Active Quick-Guide Banner */}
        {isRansomwareActive && (
          <div className="bg-red-950/70 border-b border-red-500/30 px-4 py-2 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center space-x-2">
              <span className="text-base">🔑</span>
              <span>
                <strong className="text-yellow-300">Подсказка:</strong> Открывай папки слева и кликай <strong className="text-white">дважды</strong> по файлам .btc!
              </span>
            </div>
            <span className="text-[11px] font-mono text-red-300 bg-black/40 px-2 py-0.5 rounded border border-red-500/20">
              Собрано: {collectedBtcIds.length}/3
            </span>
          </div>
        )}

        {/* Temporary verification status alert */}
        {statusMessage && (
          <div className="px-4 py-1.5 bg-slate-950 border-b border-white/10 text-xs font-mono flex items-center space-x-2 animate-in slide-in-from-top-1 duration-200">
            {statusMessage.startsWith('❌') ? (
              <span className="text-red-400 font-bold">{statusMessage}</span>
            ) : (
              <span className="text-emerald-400 font-bold">{statusMessage}</span>
            )}
          </div>
        )}

        {/* Files Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {folderFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <Folder className="w-12 h-12 stroke-1 mb-2 opacity-40" />
              <span>Папка пуста</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {folderFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                const isCollected = collectedBtcIds.includes(file.id);
                const isFailed = failedBtcIds.includes(file.id);

                return (
                  <div
                    key={file.id}
                    id={`file-item-${file.id}`}
                    onClick={() => handleFileClick(file)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                    className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/40 border border-blue-400/60 shadow-md'
                        : 'hover:bg-white/5 border border-transparent'
                    } ${isCollected ? 'bg-emerald-950/30 border-emerald-500/40' : ''} ${
                      isFailed && !isCollected ? 'opacity-40 grayscale-75' : ''
                    }`}
                    title={`${file.name} (${file.size})\nДважды кликните, чтобы проверить ключ`}
                  >
                    <div className="mb-1.5 flex items-center justify-center">
                      {getIconForFile(file)}
                    </div>
                    <span
                      className={`text-[11px] font-medium text-center line-clamp-2 break-all leading-tight ${
                        isCollected
                          ? 'text-emerald-300 font-bold'
                          : isFailed
                          ? 'text-red-300 line-through'
                          : 'text-slate-200'
                      }`}
                    >
                      {file.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {file.size}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-7 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/40">
          <span>
            {selectedFile ? `${selectedFile.name} — ${selectedFile.size}` : `${folderFiles.length} объектов`}
          </span>
          {isRansomwareActive && (
            <span className="text-amber-400 font-mono flex items-center space-x-1 font-semibold">
              <Key className="w-3.5 h-3.5" />
              <span>Проверяйте файлы .btc (двойной клик)</span>
            </span>
          )}
        </div>
      </div>

      {/* Text preview modal */}
      {previewContent && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/20 rounded-xl max-w-lg w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="font-semibold text-xs text-slate-200">{selectedFile?.name}</span>
              <button
                onClick={() => setPreviewContent(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/10 cursor-pointer"
              >
                Закрыть
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {previewContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
