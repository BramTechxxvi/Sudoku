import { memo } from 'react';
import type { SudokuBoard } from '../../types/sudoku';
import { countDigits } from '../../utils/board';

interface NumberPadProps {
  board: SudokuBoard;
  onNumber: (n: number) => void;
  disabled: boolean;
}

function NumberPadInner({ board, onNumber, disabled }: NumberPadProps) {
  const counts = countDigits(board);

  return (
    <div
      className="grid grid-cols-9 gap-1.5 w-full"
      role="group"
      aria-label="Number pad"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const count = counts.get(n) ?? 0;
        const completed = count >= 9;

        return (
          <button
            key={n}
            type="button"
            onClick={() => onNumber(n)}
            disabled={disabled}
            aria-label={`Enter ${n}${completed ? ', all placed' : ''}`}
            className={[
              // Base layout
              'flex items-center justify-center',
              'aspect-square rounded-lg',
              'text-[clamp(16px,3.5vw,24px)] font-semibold leading-none',
              'border transition-all duration-150',
              // States
              disabled
                ? 'opacity-40 cursor-not-allowed bg-white border-slate-200 text-slate-400'
                : completed
                ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-default'
                : [
                    'bg-white border-slate-200 text-slate-800',
                    'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
                    'active:bg-blue-100 active:scale-95',
                    'shadow-sm hover:shadow',
                  ].join(' '),
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export const NumberPad = memo(NumberPadInner);
