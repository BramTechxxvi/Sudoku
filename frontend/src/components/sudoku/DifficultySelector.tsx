import { memo } from 'react';
import type { Difficulty } from '../../types/sudoku';

interface DifficultySelectorProps {
  current: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled: boolean;
}

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function DifficultySelectorInner({ current, onChange, disabled }: DifficultySelectorProps) {
  return (
    <div
      className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1"
      role="group"
      aria-label="Select difficulty"
    >
      {OPTIONS.map(({ value, label }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`${label} difficulty`}
            className={[
              'flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export const DifficultySelector = memo(DifficultySelectorInner);
