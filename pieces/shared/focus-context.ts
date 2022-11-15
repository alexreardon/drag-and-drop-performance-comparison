import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Data } from '../data/tasks';

export type FocusContextValue = {
  shouldFocus: ({ itemId }: { itemId: string }) => boolean;
  aboutToMove: ({ itemId }: { itemId: string }) => void;
};

function create(): FocusContextValue {
  let movedItemId: string | null = null;

  function shouldFocus({ itemId }: { itemId: string }) {
    const result: boolean = itemId === movedItemId;
    // any check will purge registry
    movedItemId = null;
    return result;
  }

  function aboutToMove({ itemId }: { itemId: string }) {
    console.log('about to move', itemId);
    movedItemId = itemId;
  }

  return { shouldFocus, aboutToMove };
}

export const FocusContext = createContext<FocusContextValue | null>(null);

export function useStableFocusContextValue(): FocusContextValue {
  const [value] = useState(() => create());
  return value;
}
