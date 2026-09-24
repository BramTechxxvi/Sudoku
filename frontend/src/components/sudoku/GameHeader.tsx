import { memo } from 'react';
import type { Difficulty } from '../../types/sudoku';
import { difficultyLabel, formatTime } from '../../utils/board';

interface GameHeaderProps {
  difficulty: Difficulty;
  elapsed: number;
  mistakes: number;
  loading: boolean;
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  hard: 'text-red-600 bg-red-50 border-red-200',
};

function GameHeaderInner({ difficulty, elapsed, mistakes, loading }: GameHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Difficulty badge */}
      <span
        className={[
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
          loading ? 'text-slate-400 bg-slate-50 border-slate-200' : DIFFICULTY_COLOR[difficulty],
        ].join(' ')}
      >
        {loading ? 'Loading…' : difficultyLabel(difficulty)}
      </span>

      {/* Timer + Mistakes */}
      <div className="flex items-center gap-4">
        {/* Timer */}
        <div className="flex items-center gap-1.5" aria-live="polite" aria-label={`Time: ${formatTime(elapsed)}`}>
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 7v5l3 3" />
          </svg>
          <span className="font-mono text-sm font-medium text-slate-600 tabular-nums min-w-[42px]">
            {formatTime(elapsed)}
          </span>
        </div>

        {/* Mistakes */}
        <div
          className="flex items-center gap-1.5"
          aria-live="polite"
          aria-label={`Mistakes: ${mistakes}`}
        >
          <svg
            className={['w-4 h-4', mistakes > 0 ? 'text-red-400' : 'text-slate-300'].join(' ')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <span
            className={[
              'text-sm font-medium tabular-nums',
              mistakes > 0 ? 'text-red-500' : 'text-slate-400',
            ].join(' ')}
          >
            {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
          </span>
        </div>
      </div>
    </div>
  );
}

export const GameHeader = memo(GameHeaderInner);
