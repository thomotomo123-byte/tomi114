import { useState, useEffect } from 'react';
import { ActiveTab, TaskItem, NoteItem, TransactionItem } from './types';
import {
  loadTasks,
  saveTasks,
  loadNotes,
  saveNotes,
  loadTransactions,
  saveTransactions,
} from './utils/storage';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { NotesList } from './components/NotesList';
import { FinanceTracker } from './components/FinanceTracker';
import { PomodoroTimer } from './components/PomodoroTimer';
import { QuickCalculator } from './components/QuickCalculator';
import { DataModal } from './components/DataModal';
import { Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('todos');
  const [tasks, setTasks] = useState<TaskItem[]>(loadTasks);
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
  const [transactions, setTransactions] = useState<TransactionItem[]>(loadTransactions);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Theme Management
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('catatyuk_theme_v1');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('catatyuk_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('catatyuk_theme_v1', 'light');
    }
  }, [isDark]);

  // Persistence effects
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // Task count helpers
  const activeTaskCount = tasks.filter((t) => !t.completed).length;

  // Format today's date in natural Indonesian
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Header adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        openDataModal={() => setIsDataModalOpen(true)}
        taskCounts={{ active: activeTaskCount, total: tasks.length }}
      />

      {/* Main Content Workspace Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Subtle greeting and date strip (human editorial typography, no fake code tags) */}
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {getGreeting()}, Semangat Beraktivitas!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Atur agenda harian, simpan catatan penting, dan pantau keuangan dengan mudah.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0 font-mono tabular-nums">
            <Calendar className="h-3.5 w-3.5 inline text-slate-400" />
            <span>{todayFormatted}</span>
          </div>
        </div>

        {/* Tab Viewport */}
        <div>
          {activeTab === 'todos' && <TodoList tasks={tasks} setTasks={setTasks} />}
          {activeTab === 'notes' && <NotesList notes={notes} setNotes={setNotes} />}
          {activeTab === 'finance' && (
            <FinanceTracker transactions={transactions} setTransactions={setTransactions} />
          )}
          {activeTab === 'pomodoro' && <PomodoroTimer />}
          {activeTab === 'calculator' && <QuickCalculator />}
        </div>
      </main>

      {/* Editorial Footer - Quiet and clean */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">CatatYuk</span>
            <span aria-hidden="true">·</span>
            <span>Aplikasi Produktivitas & Catatan Sederhana</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Cadangkan & Pulihkan
            </button>
            <span aria-hidden="true">·</span>
            <span>Data tersimpan lokal di perangkat</span>
          </div>
        </div>
      </footer>

      {/* Data Management Modal */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        tasks={tasks}
        notes={notes}
        transactions={transactions}
        setTasks={setTasks}
        setNotes={setNotes}
        setTransactions={setTransactions}
      />
    </div>
  );
}
