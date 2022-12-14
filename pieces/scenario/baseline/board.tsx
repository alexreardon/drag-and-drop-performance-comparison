import { css } from '@emotion/react';
import { useRef, useState } from 'react';

import { ColumnMap, Data, getInitialData } from '../../data/tasks';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

export default function Board() {
  const [data, setData] = useState<Data>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div css={boardStyles} ref={ref}>
      {data.orderedColumnIds.map((columnId) => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
      })}
    </div>
  );
}
