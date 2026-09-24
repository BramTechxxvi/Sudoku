import { Trophy } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import type { Difficulty } from '../../types/sudoku';
import { difficultyLabel, formatTime } from '../../utils/board';





interface CompletionModalProps {
  difficulty: Difficulty;
  elapsed: number;
  mistakes: number;
  hintsUsed: number;
  onNewGame: () => void;
  onPlayAgain: () => void;
}

function CompletionModalInner({
  difficulty,
  elapsed,
  mistakes,
  hintsUsed,
  onNewGame,
  onPlayAgain,
}: CompletionModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onNewGame();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNewGame]);

  const stats = [
    { label: 'Difficulty', value: difficultyLabel(difficulty) },
    { label: 'Time', value: formatTime(elapsed) },
    { label: 'Mistakes', value: String(mistakes) },
    { label: 'Hints used', value: String(hintsUsed) },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onNewGame();
      }}
    >
      <div
        ref={dialogRef}
        className="animate-fade-in bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 flex flex-col items-center gap-6"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500">
          <Trophy size={32} />
        </div>

        <div className="text-center">
          <h2
            id="completion-title"
            className="text-2xl font-semibold text-slate-900 tracking-tight"
          >
            Puzzle Complete
          </h2>
          <p className="mt-1 text-slate-500 text-sm">Well done — you solved it!</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
            >
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {label}
              </span>
              <span className="text-lg font-semibold text-slate-800 tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full gap-2">
          <button
            ref={firstBtnRef}
            type="button"
            onClick={onNewGame}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold text-sm
                       hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm
                       hover:bg-slate-200 active:bg-slate-300 transition-colors border border-slate-200"
          >
            Play Again (same difficulty)
          </button>
        </div>
      </div>
    </div>
  );
}

export const CompletionModal = memo(CompletionModalInner);
