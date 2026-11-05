import React, { useState, useMemo } from 'react';
import { NoteItem, NoteColor } from '../types';
import { playChime } from '../utils/audio';
import { 
  Plus, 
  Search, 
  Pin, 
  PinOff, 
  Trash2, 
  Copy, 
  Check, 
  StickyNote,
  Edit2
} from 'lucide-react';

interface NotesListProps {
  notes: NoteItem[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItem[]>>;
}

const COLOR_MAP: Record<NoteColor, { bg: string; border: string; darkBg: string; darkBorder: string }> = {
  default: {
    bg: 'bg-white',
    border: 'border-slate-200',
    darkBg: 'dark:bg-slate-900',
    darkBorder: 'dark:border-slate-800',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-200',
    darkBg: 'dark:bg-amber-950/20',
    darkBorder: 'dark:border-amber-900/40',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    darkBg: 'dark:bg-emerald-950/20',
    darkBorder: 'dark:border-emerald-900/40',
  },
  sky: {
    bg: 'bg-sky-50/70',
    border: 'border-sky-200',
    darkBg: 'dark:bg-sky-950/20',
    darkBorder: 'dark:border-sky-900/40',
  },
  rose: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-200',
    darkBg: 'dark:bg-rose-950/20',
    darkBorder: 'dark:border-rose-900/40',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-200',
    darkBg: 'dark:bg-purple-950/20',
    darkBorder: 'dark:border-purple-900/40',
  },
};

export const NotesList: React.FC<NotesListProps> = ({ notes, setNotes }) => {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const query = search.toLowerCase();
        return n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, search]);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title: title.trim() || 'Tanpa Judul',
                content: content.trim(),
                color,
                isPinned,
                updatedAt: Date.now(),
              }
            : n
        )
      );
      setEditingId(null);
    } else {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: title.trim() || 'Tanpa Judul',
        content: content.trim(),
        color,
        isPinned,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setTitle('');
    setContent('');
    setColor('default');
    setIsPinned(false);
    setIsCreating(false);
    playChime('success');
  };

  const handleStartEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setIsPinned(note.isPinned);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setColor('default');
    setIsPinned(false);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n))
    );
  };

  const handleCopy = (note: NoteItem) => {
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const countWords = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Catatan & Memo Cepat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Simpan ide, draft tulisan, atau informasi penting kapan saja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari catatan..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Buat Catatan</span>
            </button>
          )}
        </div>
      </div>

      {/* Note Editor Drawer / Form */}
      {isCreating && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <form onSubmit={handleSaveNote} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {editingId ? 'Edit Catatan' : 'Catatan Baru'}
              </span>
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                  isPinned
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {isPinned ? <Pin className="h-3.5 w-3.5 fill-current" /> : <PinOff className="h-3.5 w-3.5" />}
                <span>{isPinned ? 'Tersemat di atas' : 'Sematkan'}</span>
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul catatan..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi catatan, memo, atau daftar poin di sini..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />

            {/* Color selection & action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Warna Aksen:</span>
                <div className="flex items-center gap-1.5">
                  {(['default', 'amber', 'emerald', 'sky', 'rose', 'purple'] as NoteColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={`Warna ${c}`}
                      className={`h-5 w-5 rounded-full border ${
                        c === 'default'
                          ? 'bg-slate-200 border-slate-400 dark:bg-slate-700'
                          : c === 'amber'
                          ? 'bg-amber-300 border-amber-400'
                          : c === 'emerald'
                          ? 'bg-emerald-300 border-emerald-400'
                          : c === 'sky'
                          ? 'bg-sky-300 border-sky-400'
                          : c === 'rose'
                          ? 'bg-rose-300 border-rose-400'
                          : 'bg-purple-300 border-purple-400'
                      } ${color === c ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() && !content.trim()}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <StickyNote className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {search ? 'Tidak ada catatan yang sesuai dengan kata kunci' : 'Belum ada catatan tersimpan'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Klik tombol "Buat Catatan" untuk mulai menulis memo atau ide baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const style = COLOR_MAP[note.color] || COLOR_MAP.default;
            const words = countWords(note.content);
            const chars = note.content.length;

            return (
              <div
                key={note.id}
                className={`flex flex-col justify-between rounded-xl border p-4.5 transition-shadow hover:shadow-sm ${style.bg} ${style.border} ${style.darkBg} ${style.darkBorder}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words">
                      {note.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleTogglePin(note.id)}
                      title={note.isPinned ? 'Lepas sematan' : 'Sematkan ke atas'}
                      className={`text-slate-400 hover:text-amber-600 transition-colors shrink-0 p-0.5 ${
                        note.isPinned ? 'text-amber-500 dark:text-amber-400' : ''
                      }`}
                    >
                      <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed break-words">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  {/* Clean unboxed metadata (anti-slop rule) */}
                  <div className="flex items-center gap-1.5 font-mono tabular-nums text-[11px]">
                    <span>{words} kata</span>
                    <span aria-hidden="true">·</span>
                    <span>{chars} kar</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(note)}
                      title="Salin isi catatan"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                    >
                      {copiedId === note.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(note)}
                      title="Ubah catatan"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      title="Hapus catatan"
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
