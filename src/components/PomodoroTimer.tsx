import React, { useState, useEffect, useRef } from 'react';
import { playChime } from '../utils/audio';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, CheckCircle, Flame } from 'lucide-react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<Mode, { label: string; defaultMinutes: number }> = {
  work: { label: 'Sesi Fokus', defaultMinutes: 25 },
  shortBreak: { label: 'Istirahat Singkat', defaultMinutes: 5 },
  longBreak: { label: 'Istirahat Panjang', defaultMinutes: 15 },
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const totalTime = MODE_CONFIG[mode].defaultMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalTime - timeLeft) / totalTime) * 100));

  // Ref to track interval
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (soundEnabled) {
              playChime('complete');
            }
            if (mode === 'work') {
              setCompletedSessions((c) => c + 1);
              setMode('shortBreak');
              return MODE_CONFIG.shortBreak.defaultMinutes * 60;
            } else {
              setMode('work');
              return MODE_CONFIG.work.defaultMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, soundEnabled]);

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].defaultMinutes * 60);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning && soundEnabled) {
      playChime('alert');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].defaultMinutes * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('shortBreak');
      setTimeLeft(MODE_CONFIG.shortBreak.defaultMinutes * 60);
    } else {
      setMode('work');
      setTimeLeft(MODE_CONFIG.work.defaultMinutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Fokus & Manajemen Ritme Kerja
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gunakan siklus 25 menit fokus penuh tanpa distraksi untuk menyelesaikan tugas penting.
        </p>
      </div>

      {/* Main Timer Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        {/* Mode Segmented Switch */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Fokus (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'shortBreak'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Istirahat (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Istirahat Panjang (15m)
          </button>
        </div>

        {/* Big Tabular Time Display */}
        <div className="my-4">
          <div className="text-6xl sm:text-7xl font-bold tracking-tight font-mono tabular-nums text-slate-900 dark:text-white select-none">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {mode === 'work' ? 'Waktu Konsentrasi Penuh' : 'Waktu Relaksasi & Istirahat'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto my-6 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            title="Reset Waktu"
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleToggleTimer}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-current" />
                <span>Mulai Fokus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            title="Lewati Sesi"
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Sound toggle and Session stats */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Sesi selesai hari ini: </span>
            <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {completedSessions}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? 'Bunyi Aktif' : 'Bunyi Senyap'}</span>
          </button>
        </div>
      </div>

      {/* Productivity Advice Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Prinsip 25 Menit:
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pilih satu tugas prioritas di menu Tugas, jauhkan ponsel atau media sosial, lalu tekan tombol Mulai. Nikmati istirahat singkat 5 menit untuk minum air putih atau peregangan ringan setelah bel berbunyi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
