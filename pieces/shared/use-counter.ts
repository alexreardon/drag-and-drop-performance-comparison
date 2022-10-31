import { bindAll } from 'bind-event-listener';
import { useEffect, useState } from 'react';

function getCounter() {
  let active: { startMs: number; frameCount: number; frameId: number | null } | null = null;

  function run() {
    if (!active) {
      return;
    }
    active.frameId = requestAnimationFrame(() => {
      if (!active) {
        return;
      }
      active.frameCount++;
      active.frameId = null;
      run();
    });
  }

  function start(): void {
    console.log('starting to record fps');
    active = {
      startMs: Date.now(),
      frameCount: 0,
      frameId: null,
    };
    run();
  }
  function end(): void {
    if (!active) {
      return;
    }
    if (active.frameId) {
      cancelAnimationFrame(active.frameId);
    }
    const endMs = Date.now();
    const durationMs = endMs - active.startMs;
    const durationSeconds = durationMs / 1000;

    const fps = active.frameCount / durationSeconds;
    console.log({ fps });
    active = null;
  }
  return { start, end };
}

export function useCounter() {
  const [counter] = useState(() => getCounter());

  useEffect(() => {
    return bindAll(window, [
      {
        type: 'pointerdown',
        listener: () => counter.start(),
        options: { capture: true },
      },
      {
        type: 'dragend',
        listener: () =>
          requestAnimationFrame(() => {
            console.log('ending with dragend');
            counter.end();
          }),
        options: { capture: true },
      },
      {
        type: 'pointerup',
        listener: () => {
          console.log('ending with pointerup');
          counter.end();
        },
        options: { capture: true },
      },
    ]);
  }, []);
}
