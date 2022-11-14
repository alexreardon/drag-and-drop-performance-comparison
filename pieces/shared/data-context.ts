import { createContext, useEffect, useMemo, useRef } from 'react';
import { Data } from '../data/tasks';

export type DataContextValue = {
  getData: () => Data;
  setData: (value: Data) => void;
};

export const DataContext = createContext<DataContextValue | null>(null);

export function useStableDataContextValue(
  data: Data,
  setData: (value: Data) => void,
): DataContextValue {
  const last = useRef<Data>(data);
  useEffect(() => {
    last.current = data;
  }, [data]);
  const stable: DataContextValue = useMemo(
    () => ({
      setData,
      getData: () => last.current,
    }),
    [],
  );
  return stable;
}
