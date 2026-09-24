import { Eraser, Lightbulb, Pencil, RotateCcw, Undo2 } from 'lucide-react';
import { memo } from 'react';




interface GameControlsProps {
  notesMode: boolean;
  canUndo: boolean;
  hintLoading: boolean;
  solveLoading: boolean;
  disabled: boolean; 
  onUndo: () => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  onSolve: () => void;
}

interface ControlButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  loading?: boolean;
  danger?: boolean;
}

function ControlButton({
  label,
  icon,
  onClick,
  disabled = false,
  active = false,
  loading = false,
  danger = false,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      aria-pressed={active}
      className={[
        'flex flex-col items-center justify-center gap-1',
        'px-2 py-2.5 rounded-xl',
        'text-xs font-medium',
        'border transition-all duration-150',
        'min-w-[56px] flex-1',
        disabled || loading
          ? 'opacity-40 cursor-not-allowed bg-white border-slate-200 text-slate-400'
          : active
          ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
          : danger
          ? 'bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={loading ? 'animate-spin' : ''}>{icon}</span>
      <span className="leading-none">{loading ? '…' : label}</span>
    </button>
  );
}

function GameControlsInner({
  notesMode,
  canUndo,
  hintLoading,
  solveLoading,
  disabled,
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  onSolve,
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-2 w-full" role="toolbar" aria-label="Game controls">
      <ControlButton
        label="Undo"
        icon={<Undo2 size={18} />}
        onClick={onUndo}
        disabled={disabled || !canUndo}
      />
      <ControlButton
        label="Erase"
        icon={<Eraser size={18} />}
        onClick={onErase}
        disabled={disabled}
      />
      <ControlButton
        label="Notes"
        icon={<Pencil size={18} />}
        onClick={onToggleNotes}
        active={notesMode}
        disabled={disabled}
      />
      <ControlButton
        label="Hint"
        icon={<Lightbulb size={18} />}
        onClick={onHint}
        disabled={disabled}
        loading={hintLoading}
      />
      <ControlButton
        label="Solve"
        icon={<RotateCcw size={18} />}
        onClick={onSolve}
        disabled={disabled}
        loading={solveLoading}
        danger
      />
    </div>
  );
}

export const GameControls = memo(GameControlsInner);
