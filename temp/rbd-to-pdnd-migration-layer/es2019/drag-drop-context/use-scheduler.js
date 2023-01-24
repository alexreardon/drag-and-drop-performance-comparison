import { useCallback, useRef } from 'react';
import invariant from 'tiny-invariant';

/**
 * Used to schedule callbacks inside of a `setTimeout(fn, 0)`.
 */
export function useScheduler() {
  const queueRef = useRef([]);
  const schedule = useCallback(scheduledFunction => {
    const id = setTimeout(() => {
      // Takes the first item, removing it from the queue
      const item = queueRef.current.shift();
      invariant(item, 'There was an item in the queue');
      invariant(item.id === id && item.scheduledFunction === scheduledFunction, 'The item is the expected item'); // Call the function and remove it from the queue

      scheduledFunction();
    }, 0);
    queueRef.current.push({
      id,
      scheduledFunction
    });
  }, []);
  const flush = useCallback(() => {
    while (queueRef.current.length > 0) {
      const item = queueRef.current.shift();
      invariant(item, 'There was an item in the queue');
      clearTimeout(item.id);
      item.scheduledFunction();
    }
  }, []);
  return {
    schedule,
    flush
  };
}