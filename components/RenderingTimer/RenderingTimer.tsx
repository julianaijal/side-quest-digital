'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './RenderingTimer.module.scss';

const MILESTONES = [100, 250, 500, 1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000] as const;
const MAX_MS = MILESTONES[MILESTONES.length - 1];

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const remainder = Math.floor(ms % 1000);
  return s > 0 ? `${s}s ${remainder}ms` : `${remainder}ms`;
}

function formatMilestone(ms: number): string {
  return ms >= 1000 ? `${ms / 1000} s` : `${ms} ms`;
}

interface Props {
  startLabel: string;
  resetLabel: string;
  completeLabel: string;
}

export function RenderingTimer({ startLabel, resetLabel, completeLabel }: Props) {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [reached, setReached] = useState<number[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const start = useCallback(() => {
    setStatus('running');
    setElapsed(0);
    setReached([]);
    startRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const ms = now - startRef.current;
      setElapsed(ms);
      if (ms < MAX_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    timersRef.current = MILESTONES.map((ms) =>
      setTimeout(() => {
        setReached((prev) => [...prev, ms]);
        if (ms === MAX_MS) {
          setStatus('complete');
          cancelAnimationFrame(rafRef.current);
        }
      }, ms),
    );
  }, []);

  const reset = useCallback(() => {
    stop();
    setStatus('idle');
    setElapsed(0);
    setReached([]);
  }, [stop]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('auto')) {
      queueMicrotask(start);
    }
    return stop;
  }, [start, stop]);

  return (
    <div className={styles.timer}>
      {status !== 'running' && (
        <button
          type="button"
          className={styles.button}
          onClick={status === 'complete' ? reset : start}
        >
          {status === 'complete' ? resetLabel : startLabel}
        </button>
      )}

      {status !== 'idle' && (
        <p className={styles.counter} aria-live="off">
          {formatTime(elapsed)}
        </p>
      )}

      <ol className={styles.milestones} aria-label="Milestones">
        {MILESTONES.map((ms, i) => {
          const prev = i === 0 ? 0 : MILESTONES[i - 1];
          const gap = ms - prev;
          const widthPct = (gap / MAX_MS) * 100;
          const active = reached.includes(ms);
          return (
            <li key={ms} className={styles.milestone}>
              <span
                className={`${styles.bar} ${active ? styles.barActive : ''}`}
                style={{ width: `${widthPct}%` }}
              />
              <span className={styles.label}>
                {formatMilestone(ms)}
              </span>
              {active && (
                <span className={styles.marker}>sqd-render-{ms}</span>
              )}
            </li>
          );
        })}
      </ol>

      {status === 'complete' && (
        <p className={styles.status} aria-live="polite" role="status">
          {completeLabel}
        </p>
      )}
    </div>
  );
}
