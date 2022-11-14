import { createContext } from 'react';

/* We are putting a function to get the ordered column ids on the context.
We are putting a function so that the columnIds can be lazily collected when needed
This is done to avoid needing to re-render all cards after column reordering operations */
export const GetOrderedColumnIdsContext = createContext<() => string[]>(() => []);
