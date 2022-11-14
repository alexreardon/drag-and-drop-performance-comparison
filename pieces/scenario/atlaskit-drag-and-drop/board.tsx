import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ColumnMap, Data, getInitialData } from '../../data/tasks';
import { GetOrderedColumnIdsContext } from '../../shared/get-ordered-column-ids-context';
import { Column } from './column';
import { reorder } from './reorder';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

export default function Board() {
  const [data, setData] = useState<Data>(() => getInitialData());
  const orderedColumnIdsRef = useRef<string[]>(data.orderedColumnIds);
  useEffect(() => {
    orderedColumnIdsRef.current = data.orderedColumnIds;
  }, [data.orderedColumnIds]);
  const getOrderedColumnIds = useCallback(() => orderedColumnIdsRef.current, []);

  useEffect(() => {
    return monitorForElements({
      onDrop(args) {
        const updated = reorder({ data, result: args });
        if (updated) {
          setData(updated);
        }
      },
    });
  }, [data]);

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
