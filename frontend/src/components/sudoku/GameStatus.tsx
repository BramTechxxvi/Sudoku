import { X } from 'lucide-react';
import { memo } from 'react';
import type { StatusMessage } from '../../types/sudoku';




interface GameStatusProps {
  messages: StatusMessage[];
  onDismiss: (id: number) => void;
}

const TYPE_STYLES: Record<StatusMessage['type'], string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
};

const TYPE_ICON: Record<StatusMessage['type'], string> = {
  info: '●',
  success: '✓',
  error: '✕',
  warning: '⚠',
};

function GameStatusInner({ messages, onDismiss }: GameStatusProps) {
  if (messages.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-1.5 w-full"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={[
            'flex items-center justify-between gap-2',
            'px-3 py-2 rounded-lg border text-sm',
            'animate-fade-in',
            TYPE_STYLES[msg.type],
          ].join(' ')}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 text-xs font-bold" aria-hidden="true">
              {TYPE_ICON[msg.type]}
            </span>
            <span className="truncate">{msg.text}</span>
          </span>
          <button
            type="button"
            onClick={() => onDismiss(msg.id)}
            aria-label="Dismiss message"
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export const GameStatus = memo(GameStatusInner);
