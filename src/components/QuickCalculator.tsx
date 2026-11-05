import React, { useState, useEffect } from 'react';
import { Delete, Copy, Check, RotateCcw } from 'lucide-react';
import { playChime } from '../utils/audio';

export const QuickCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleNumber = (n: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(n);
    } else {
      setDisplay((prev) => prev + n);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (display === '0' || display === 'Error') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay((val / 100).toString());
    }
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const parts = equation.trim().split(' ');
      if (parts.length < 2) return;
      const num1 = parseFloat(parts[0]);
      const op = parts[1];
      const num2 = parseFloat(display);

      let res = 0;
      switch (op) {
        case '+':
          res = num1 + num2;
          break;
        case '-':
          res = num1 - num2;
          break;
        case '×':
          res = num1 * num2;
          break;
        case '÷':
          if (num2 === 0) {
            setDisplay('Error');
            setEquation('');
            return;
          }
          res = num1 / num2;
          break;
        default:
          return;
      }

      // Format result to prevent floating point inaccuracy
      const formatted = Math.round(res * 100000000) / 100000000;
      const historyEntry = `${equation}${display} = ${formatted}`;
      setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);
      setDisplay(formatted.toString());
      setEquation('');
      playChime('success');
    } catch {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+' || e.key === '-') {
        handleOperator(e.key);
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Kalkulator Cepat
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Hitung cepat rincian belanja, estimasi biaya, atau pembagian tagihan.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        {/* Screen */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 text-right mb-4">
          <div className="h-5 text-xs text-slate-400 font-mono tabular-nums truncate">
            {equation || '\u00A0'}
          </div>
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={handleCopy}
              title="Salin Angka"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white truncate max-w-[280px]">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="p-3 text-sm font-semibold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
          >
            AC
          </button>
          <button
            onClick={handleToggleSign}
            className="p-3 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            +/-
          </button>
          <button
            onClick={handlePercent}
            className="p-3 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="p-3 text-base font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 transition-colors"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleNumber('7')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            7
          </button>
          <button
            onClick={() => handleNumber('8')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            8
          </button>
          <button
            onClick={() => handleNumber('9')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className="p-3 text-base font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 transition-colors"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleNumber('4')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            4
          </button>
          <button
            onClick={() => handleNumber('5')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            5
          </button>
          <button
            onClick={() => handleNumber('6')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="p-3 text-base font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 transition-colors"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleNumber('1')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            1
          </button>
          <button
            onClick={() => handleNumber('2')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            2
          </button>
          <button
            onClick={() => handleNumber('3')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="p-3 text-base font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 transition-colors"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleNumber('0')}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="p-3 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            aria-label="Hapus satu angka"
            className="flex items-center justify-center p-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            <Delete className="h-4 w-4" />
          </button>
          <button
            onClick={handleCalculate}
            className="p-3 text-base font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            =
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Riwayat Perhitungan
            </span>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Hapus Riwayat
            </button>
          </div>
          <div className="space-y-1 font-mono tabular-nums text-xs text-slate-600 dark:text-slate-400">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const res = item.split('=')[1]?.trim();
                  if (res) setDisplay(res);
                }}
                className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 py-0.5 truncate"
                title="Klik untuk menggunakan hasil"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
