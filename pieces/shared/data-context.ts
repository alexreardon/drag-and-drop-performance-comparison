import { createContext } from 'react';
import { Data } from '../data/tasks';

export type DataContextValue = {
  getData: () => Data;
  setData: (value: Data) => void;
};

export const DataContext = createContext<DataContextValue | null>(null);
