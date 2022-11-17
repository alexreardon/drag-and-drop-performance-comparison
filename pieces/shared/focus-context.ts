import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type FocusContextValue = {
  shouldFocus: ({ entityId }: { entityId: string }) => boolean;
  aboutToMove: ({ entityId }: { entityId: string }) => void;
};

function create(): FocusContextValue {
  let movedEntityId: string | null = null;

  function shouldFocus({ entityId }: { entityId: string }) {
    const result: boolean = entityId === movedEntityId;
    // any check will purge registry
    movedEntityId = null;
    return result;
  }

  function aboutToMove({ entityId }: { entityId: string }) {
    movedEntityId = entityId;
  }

  return { shouldFocus, aboutToMove };
}

export const FocusContext = createContext<FocusContextValue | null>(null);

export function useStableFocusContextValue(): FocusContextValue {
  const [value] = useState(() => create());
  return value;
}
