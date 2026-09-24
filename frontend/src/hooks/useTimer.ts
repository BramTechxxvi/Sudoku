import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerReturn {
  elapsed: number;       // total seconds elapsed
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (initialSeconds?: number) => void;
}

/**
 * A precise interval-based timer.
 * elapsed counts whole seconds. Resets cleanly on new game.
 */
export function useTimer(initialSeconds = 0): UseTimerReturn {
  const [elapsed, setElapsed] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    setIsRunning((prev) => {
      if (prev) return prev; // already running
      return true;
    });
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((initialSeconds = 0) => {
    setIsRunning(false);
    setElapsed(initialSeconds);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } else {
      clearTick();
    }
    return clearTick;
  }, [isRunning]);

  // Clean up on unmount
  useEffect(() => {
    return clearTick;
  }, []);

  return { elapsed, isRunning, start, pause, reset };
}
