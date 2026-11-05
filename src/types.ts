export type TaskPriority = 'rendah' | 'sedang' | 'tinggi';

export type TaskCategory = 'pekerjaan' | 'pribadi' | 'belanja' | 'belajar' | 'kesehatan';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
}

export type NoteColor = 'default' | 'amber' | 'emerald' | 'sky' | 'rose' | 'purple';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface TransactionItem {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: number;
}

export type ActiveTab = 'todos' | 'notes' | 'finance' | 'pomodoro' | 'calculator';
