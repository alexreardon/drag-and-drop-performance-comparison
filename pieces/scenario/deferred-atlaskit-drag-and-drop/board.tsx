import { css } from '@emotion/react';
import { useState } from 'react';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { WithOrderedColumnIds } from '../../shared/with-ordered-column-ids';
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

  return (
    <WithOrderedColumnIds orderedColumnIds={data.orderedColumnIds}>
      <div css={boardStyles}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
    </WithOrderedColumnIds>
  );
}
