import { css } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { GetOrderedColumnIdsContext } from '../../shared/get-ordered-column-ids-context';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  const orderedColumnIdsRef = useRef<string[]>(data.orderedColumnIds);
  useEffect(() => {
    orderedColumnIdsRef.current = data.orderedColumnIds;
  }, [data.orderedColumnIds]);
  const getOrderedColumnIds = useCallback(() => orderedColumnIdsRef.current, []);

  return (
    <GetOrderedColumnIdsContext.Provider value={getOrderedColumnIds}>
      <DndProvider backend={HTML5Backend}>
        <div css={boardStyles} ref={ref}>
          {data.orderedColumnIds.map((columnId) => {
            return <Column column={data.columnMap[columnId]} key={columnId} />;
          })}
        </div>
      </DndProvider>
    </GetOrderedColumnIdsContext.Provider>
  );
}
