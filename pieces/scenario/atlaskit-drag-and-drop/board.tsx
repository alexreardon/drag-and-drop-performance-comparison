import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { bind, bindAll } from 'bind-event-listener';
import { ColumnMap, getInitialData } from '../../data/tasks';
import { Column } from './column';
import { useCounter } from '../../shared/use-counter';

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
  useCounter();

  return (
    <div css={boardStyles}>
      {data.orderedColumnIds.map((columnId) => {
        return (
          <Column
            column={data.columnMap[columnId]}
            key={columnId}
            orderedColumnIds={data.orderedColumnIds}
          />
        );
      })}
    </div>
  );
}
