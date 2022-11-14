import { css } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [data] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const orderedColumnIdsRef = useRef<string[]>(data.orderedColumnIds);
  useEffect(() => {
    orderedColumnIdsRef.current = data.orderedColumnIds;
  }, [data.orderedColumnIds]);
  const getOrderedColumnIds = useCallback(() => orderedColumnIdsRef.current, []);

  return (
    <GetOrderedColumnIdsContext.Provider value={getOrderedColumnIds}>
      <div css={boardStyles}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
    </GetOrderedColumnIdsContext.Provider>
  );
}
