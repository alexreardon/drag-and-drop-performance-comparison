import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { GetOrderedColumnIdsContext } from './get-ordered-column-ids-context';
import { useStableGetter } from './use-stable-getter';

export function WithOrderedColumnIds({
  orderedColumnIds,
  children,
}: {
  orderedColumnIds: string[];
  children: ReactNode;
}) {
  const getOrderedColumnIds = useStableGetter(orderedColumnIds);

  return (
    <GetOrderedColumnIdsContext.Provider value={getOrderedColumnIds}>
      {children}
    </GetOrderedColumnIdsContext.Provider>
  );
}
