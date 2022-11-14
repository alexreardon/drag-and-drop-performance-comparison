import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { GetOrderedColumnIdsContext } from './get-ordered-column-ids-context';

export function WithOrderedColumnIds({
  orderedColumnIds,
  children,
}: {
  orderedColumnIds: string[];
  children: ReactNode;
}) {
  const orderedColumnIdsRef = useRef<string[]>(orderedColumnIds);
  useEffect(() => {
    orderedColumnIdsRef.current = orderedColumnIds;
  }, [orderedColumnIds]);
  const getOrderedColumnIds = useCallback(() => orderedColumnIdsRef.current, []);

  return (
    <GetOrderedColumnIdsContext.Provider value={getOrderedColumnIds}>
      {children}
    </GetOrderedColumnIdsContext.Provider>
  );
}
