import { createContext } from 'react';

export const GetOrderedColumnIdsContext = createContext<() => string[]>(() => []);
