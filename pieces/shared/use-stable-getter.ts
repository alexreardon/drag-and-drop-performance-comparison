import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { GetOrderedColumnIdsContext } from './get-ordered-column-ids-context';

export function useStableGetter<Value>(value: Value): () => Value {
  const last = useRef<Value>(value);
  const getValue = useRef<() => Value>(() => last.current);
  useEffect(() => {
    last.current = value;
  }, [value]);

  return getValue.current;
}
