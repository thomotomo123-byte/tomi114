import React from 'react';
import { ActiveTab } from '../types';
import { CheckSquare, StickyNote, Wallet, Timer, Calculator, Sun, Moon, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleDark: () => void;
  openDataModal: () => void;
  taskCounts: { active: number; total: number };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  openDataModal,
  taskCounts,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand Wordmark (Single line, strictly no attached taglines in brand element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            CatatYuk
          </span>
        </div>

        {/* Zone 2: Navigation Links / Workspace Tabs (Single line, whitespace-nowrap shrink-0) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'todos'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tugas ({taskCounts.active})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <StickyNote className="h-4 w-4" />
            <span>Catatan</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'finance'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>Keuangan</span>
          </button>

          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'pomodoro'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Timer className="h-4 w-4" />
            <span>Fokus</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'calculator'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Kalkulator</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openDataModal}
            title="Kelola Data & Cadangan"
            aria-label="Cadangkan data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Data</span>
          </button>

          <button
            onClick={toggleDark}
            title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle mode gelap atau terang"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-2 py-1 justify-around bg-slate-50 dark:bg-slate-900/90 overflow-x-auto">
        <button
          onClick={() => setActiveTab('todos')}
          className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
            activeTab === 'todos' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="h-4 w-4 mb-0.5" />
          <span>Tugas</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
            activeTab === 'notes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <StickyNote className="h-4 w-4 mb-0.5" />
          <span>Catatan</span>
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
            activeTab === 'finance' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Wallet className="h-4 w-4 mb-0.5" />
          <span>Keuangan</span>
        </button>
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
            activeTab === 'pomodoro' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Timer className="h-4 w-4 mb-0.5" />
          <span>Fokus</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center py-1.5 px-2 text-xs font-medium ${
            activeTab === 'calculator' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calculator className="h-4 w-4 mb-0.5" />
          <span>Kalkulator</span>
        </button>
      </div>
    </header>
  );
};
