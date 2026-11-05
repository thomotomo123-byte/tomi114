import React, { useState, useMemo } from 'react';
import { TaskItem, TaskCategory, TaskPriority } from '../types';
import { playChime } from '../utils/audio';
import { 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  Check, 
  AlertCircle,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface TodoListProps {
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  pekerjaan: 'Pekerjaan',
  pribadi: 'Pribadi',
  belanja: 'Belanja',
  belajar: 'Belajar',
  kesehatan: 'Kesehatan',
};

const PRIORITY_LABELS: Record<TaskPriority, { label: string; color: string }> = {
  rendah: { label: 'Rendah', color: 'text-slate-500 dark:text-slate-400' },
  sedang: { label: 'Sedang', color: 'text-amber-600 dark:text-amber-400' },
  tinggi: { label: 'Tinggi', color: 'text-rose-600 dark:text-rose-400' },
};

export const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('pekerjaan');
  const [priority, setPriority] = useState<TaskPriority>('sedang');
  const [dueDate, setDueDate] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'active'
            ? !task.completed
            : task.completed;

        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        // Active tasks first, then by priority (tinggi > sedang > rendah), then by creation
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const weight = { tinggi: 3, sedang: 2, rendah: 1 };
        if (weight[a.priority] !== weight[b.priority]) {
          return weight[b.priority] - weight[a.priority];
        }
        return b.createdAt - a.createdAt;
      });
  }, [tasks, search, statusFilter, categoryFilter, priorityFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsFormExpanded(false);
    playChime('success');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            playChime('complete');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    if (confirm('Hapus semua tugas yang telah selesai?')) {
      setTasks((prev) => prev.filter((t) => !t.completed));
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards - 1-level elevation, clean typography & tabular-nums */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tugas</span>
            <span className="text-xs text-slate-400">Semua entri</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {totalTasks}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">tugas terdata</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Perlu Dikerjakan</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Aktif</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {activeTasks}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">tugas tersisa</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat Penyelesaian</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">progres total</span>
          </div>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <form onSubmit={handleAddTask} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tuliskan tugas atau agenda baru hari ini..."
              onFocus={() => setIsFormExpanded(true)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Form Options (Expanded) */}
          {isFormExpanded && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="pekerjaan">Pekerjaan</option>
                  <option value="pribadi">Pribadi</option>
                  <option value="belanja">Belanja</option>
                  <option value="belajar">Belajar</option>
                  <option value="kesehatan">Kesehatan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Prioritas
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="rendah">Rendah</option>
                  <option value="sedang">Sedang</option>
                  <option value="tinggi">Tinggi (Penting)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Tenggat Waktu (Opsional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan tambahan / rincian langkah tugas (opsional)..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs (Segmented Control with proper handlers) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Semua ({totalTasks})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Aktif ({activeTasks})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Selesai ({completedTasks})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">Semua Kategori</option>
            <option value="pekerjaan">Pekerjaan</option>
            <option value="pribadi">Pribadi</option>
            <option value="belanja">Belanja</option>
            <option value="belajar">Belajar</option>
            <option value="kesehatan">Kesehatan</option>
          </select>
        </div>
      </div>

      {/* Task List Items */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <CheckCircle2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {search ? 'Tidak ada tugas yang cocok dengan pencarian' : 'Belum ada agenda tugas'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {search
                ? 'Coba ganti kata kunci atau reset filter'
                : 'Mulai harimu dengan menambahkan agenda di atas'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              !task.completed &&
              new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={task.id}
                className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-150 ${
                  task.completed
                    ? 'border-slate-200 bg-slate-50/70 opacity-75 dark:border-slate-800/80 dark:bg-slate-900/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* Custom Accessible Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  aria-label={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    task.completed
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600 dark:hover:border-indigo-400'
                  }`}
                >
                  {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-medium leading-snug break-words ${
                        task.completed
                          ? 'text-slate-400 line-through dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  {task.description && (
                    <p
                      className={`mt-1 text-xs break-words ${
                        task.completed
                          ? 'text-slate-400 dark:text-slate-600'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Clean unboxed metadata with typographic separators (Anti-Slop Zero-Pill discipline) */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {CATEGORY_LABELS[task.category]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={PRIORITY_LABELS[task.priority].color}>
                      Prioritas {PRIORITY_LABELS[task.priority].label}
                    </span>

                    {task.dueDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`flex items-center gap-1 font-mono tabular-nums ${
                            isOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-medium'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Calendar className="h-3 w-3 inline" />
                          <span>{task.dueDate}</span>
                          {isOverdue && <span className="text-[11px] font-sans">(Lewat)</span>}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete Action */}
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="Hapus tugas"
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      {completedTasks > 0 && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleClearCompleted}
            className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
          >
            Bersihkan semua tugas selesai ({completedTasks})
          </button>
        </div>
      )}
    </div>
  );
};
