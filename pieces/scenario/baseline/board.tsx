import { css } from '@emotion/react';
import { useRef, useState } from 'react';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { columnGap, gridSize } from '../../util/constants';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: columnGap,
  justifyContent: 'center',
  gap: columnGap,
  flexDirection: 'row',
  '--grid': `${gridSize}px`,
});

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div css={boardStyles} ref={ref}>
      {data.orderedColumnIds.map((columnId) => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
      })}
    </div>
  );
}
