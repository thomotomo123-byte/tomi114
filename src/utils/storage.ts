import { TaskItem, NoteItem, TransactionItem } from '../types';

const STORAGE_KEYS = {
  TASKS: 'catatyuk_tasks_v1',
  NOTES: 'catatyuk_notes_v1',
  TRANSACTIONS: 'catatyuk_transactions_v1',
  THEME: 'catatyuk_theme_v1',
  POMODORO_CYCLES: 'catatyuk_pomo_cycles_v1',
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Siapkan laporan mingguan proyek',
    description: 'Kumpulkan rekap capaian tim dan kendala teknis',
    category: 'pekerjaan',
    priority: 'tinggi',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'task-2',
    title: 'Belanja bahan dapur mingguan',
    description: 'Sayur mayur, telur, buah segar, susu',
    category: 'belanja',
    priority: 'sedang',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'task-3',
    title: 'Membaca buku 20 halaman',
    description: 'Bab 4 tentang manajemen waktu efektif',
    category: 'belajar',
    priority: 'rendah',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'task-4',
    title: 'Jadwal jalan santai 30 menit',
    description: 'Target 5000 langkah sebelum sore',
    category: 'kesehatan',
    priority: 'sedang',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000 * 6,
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Ide Liburan Akhir Pekan',
    content: '1. Pantai Sawarna atau Curug Leuwi Hejo\n2. Bawa bekal camilan dan tumbler air\n3. Periksa tekanan ban sebelum berangkat\n4. Kamera cadangan baterai',
    color: 'amber',
    isPinned: true,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'note-2',
    title: 'Rumus Produktivitas 2 Menit',
    content: 'Jika ada pekerjaan kecil yang memakan waktu kurang dari 2 menit untuk diselesaikan, lakukan langsung sekarang juga tanpa menundanya ke to-do list.',
    color: 'emerald',
    isPinned: true,
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 72,
  },
  {
    id: 'note-3',
    title: 'Rekomendasi Menu Masakan Cepat',
    content: '• Tumis kangkung terasi\n• Telur dadar padang tebal\n• Sup ayam jagung manis segar',
    color: 'sky',
    isPinned: false,
    createdAt: Date.now() - 3600000 * 20,
    updatedAt: Date.now() - 3600000 * 20,
  },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'trx-1',
    type: 'pemasukan',
    category: 'Gaji Pokok',
    amount: 5500000,
    description: 'Gaji bulanan kantor',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'trx-2',
    type: 'pengeluaran',
    category: 'Belanja Bulanan',
    amount: 450000,
    description: 'Belanja sembako di supermarket',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'trx-3',
    type: 'pengeluaran',
    category: 'Makan & Minum',
    amount: 65000,
    description: 'Makan siang dan es kopi',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'trx-4',
    type: 'pemasukan',
    category: 'Freelance',
    amount: 750000,
    description: 'Honor desain logo mini',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 86400000,
  },
];

export function loadTasks(): TaskItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: TaskItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadNotes(): NoteItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: NoteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadTransactions(): TransactionItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: TransactionItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch {
    // Ignore storage quota errors
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function exportAppData(tasks: TaskItem[], notes: NoteItem[], transactions: TransactionItem[]) {
  const data = {
    app: 'CatatYuk',
    exportedAt: new Date().toISOString(),
    tasks,
    notes,
    transactions,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `catatyuk_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
