import React, { useRef } from 'react';
import { TaskItem, NoteItem, TransactionItem } from '../types';
import { exportAppData, INITIAL_TASKS, INITIAL_NOTES, INITIAL_TRANSACTIONS } from '../utils/storage';
import { X, Download, Upload, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  notes: NoteItem[];
  transactions: TransactionItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  setNotes: React.Dispatch<React.SetStateAction<NoteItem[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionItem[]>>;
}

export const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  tasks,
  notes,
  transactions,
  setTasks,
  setNotes,
  setTransactions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportAppData(tasks, notes, transactions);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.notes)) setNotes(parsed.notes);
        if (Array.isArray(parsed.transactions)) setTransactions(parsed.transactions);
        alert('Data berhasil dipulihkan dari berkas cadangan!');
        onClose();
      } catch {
        alert('Gagal membaca berkas JSON cadangan. Format tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSample = () => {
    if (confirm('Kembalikan data ke contoh awal? Semua perubahan saat ini akan diganti dengan data sampel bawaan.')) {
      setTasks(INITIAL_TASKS);
      setNotes(INITIAL_NOTES);
      setTransactions(INITIAL_TRANSACTIONS);
      alert('Data telah dikembalikan ke contoh awal.');
      onClose();
    }
  };

  const handleClearAll = () => {
    if (confirm('HAPUS SEMUA DATA? Tindakan ini akan mengosongkan semua tugas, catatan, dan keuangan Anda!')) {
      setTasks([]);
      setNotes([]);
      setTransactions([]);
      alert('Semua data berhasil dibersihkan.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kelola & Cadangkan Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Semua tugas, catatan ide, dan catatan keuangan Anda tersimpan langsung di browser (localStorage) perangkat Anda secara pribadi dan aman.
        </p>

        <div className="mt-5 space-y-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Unduh Cadangan (JSON)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Simpan salinan data lengkap ke komputer / ponsel Anda
                </span>
              </div>
            </div>
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Upload className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Pulihkan Cadangan (JSON)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Unggah berkas JSON cadangan yang pernah diunduh
                </span>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          {/* Reset to sample data */}
          <button
            type="button"
            onClick={handleResetToSample}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Muat Ulang Data Contoh
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Isi kembali dengan tugas & catatan contoh bawaan
                </span>
              </div>
            </div>
          </button>

          {/* Clear all */}
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-100/60 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 block">
                  Hapus Seluruh Data
                </span>
                <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 block">
                  Kosongkan semua daftar tugas, catatan, dan keuangan
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
