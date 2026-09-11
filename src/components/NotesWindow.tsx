import React, { useState } from 'react';
import { sound } from '../utils/sound';
import { Plus, Trash2, Search, FileText, Lock, Clock } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '✨ Фичи обновления poopOS 15.4',
    body: '1. Новый движок эффектов Liquid Glass (жидкое стекло)\n2. Поддержка мультизадачности и быстрый Dock\n3. Встроенные приложения: Калькулятор, Фото, Музыка, Paint\n4. Безопасность системы: полная изоляция приложений!',
    date: 'Сегодня, 11:20',
  },
  {
    id: 'note-2',
    title: '🛒 Список покупок в магазине',
    body: '1. Молоко 3.2%\n2. Хлеб бородинский\n3. Сыр пармезан\n4. Чай с бергамотом\n5. Пельмени сибирские\n6. Мороженое пломбир',
    date: 'Вчера, 18:40',
  },
  {
    id: 'note-3',
    title: '🔑 Напоминания и пароли',
    body: 'Домофон в подъезде: 48К1293\nWi-Fi в кафе: SuperCoffee2026\nНе забыть скинуть другу ссылку на мою новую poopOS!',
    date: '05 Сен, 14:10',
  },
  {
    id: 'note-4',
    title: '🎵 Любимые треки для работы',
    body: '1. Liquid Glass Dreams — расслабляющий чилл\n2. Synthwave 80s для фокуса\nВключить в poopMusic во время работы!',
    date: '02 Сен, 09:15',
  },
];

export const NotesWindow: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedId, setSelectedId] = useState<string>('note-1');
  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find((n) => n.id === selectedId) || notes[0];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    sound.playClick();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Новая заметка',
      body: '',
      date: 'Только что',
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    sound.playClick();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedId === id && remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
  };

  const handleUpdateTitle = (text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedId ? { ...n, title: text || 'Без названия' } : n))
    );
  };

  const handleUpdateBody = (text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedId ? { ...n, body: text } : n))
    );
  };

  return (
    <div className="h-full flex bg-slate-900/90 backdrop-blur-2xl text-slate-100 select-none overflow-hidden">
      {/* Notes Sidebar */}
      <aside className="w-56 bg-slate-950/70 border-r border-white/10 flex flex-col">
        {/* Top Action & Search */}
        <div className="p-2.5 border-b border-white/10 space-y-2">
          <button
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Новая заметка</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск заметок..."
              className="w-full bg-slate-900/90 text-xs pl-8 pr-2 py-1 rounded-md border border-white/10 focus:outline-hidden focus:border-amber-500 text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Note Cards List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {filteredNotes.map((note) => {
            const isSelected = note.id === selectedId;
            return (
              <div
                key={note.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedId(note.id);
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-amber-600/30 border-amber-400/50 shadow-md'
                    : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate max-w-[150px]">
                    {note.title}
                  </h4>
                  {note.title.includes('ПАРОЛИ') && (
                    <Lock className="w-3 h-3 text-red-400 shrink-0 ml-1" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {note.body || 'Нет дополнительного текста'}
                </p>
                <div className="flex items-center space-x-1 mt-1 text-[9px] text-slate-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{note.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Note Editor Area */}
      <main className="flex-1 flex flex-col bg-slate-900/60">
        {activeNote ? (
          <>
            {/* Editor Header */}
            <div className="h-12 border-b border-white/10 px-5 flex items-center justify-between">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                placeholder="Заголовок заметки..."
                className="bg-transparent text-sm sm:text-base font-bold text-white focus:outline-hidden flex-1 mr-4"
              />
              <button
                onClick={() => handleDeleteNote(activeNote.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Удалить заметку"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Body */}
            <div className="flex-1 p-5 flex flex-col">
              <textarea
                value={activeNote.body}
                onChange={(e) => handleUpdateBody(e.target.value)}
                placeholder="Начните писать здесь..."
                className="w-full flex-1 bg-transparent text-xs sm:text-sm text-slate-200 resize-none focus:outline-hidden leading-relaxed font-sans"
              />
              <div className="text-[10px] text-slate-500 font-mono text-right pt-2 border-t border-white/5">
                {activeNote.body.length} символов
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
            <FileText className="w-12 h-12 stroke-1 mb-2 opacity-40" />
            <span>Выберите заметку или создайте новую</span>
          </div>
        )}
      </main>
    </div>
  );
};
