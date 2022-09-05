import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { columnGap, gridSize } from '../../util/constants';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: columnGap,
  justifyContent: 'center',
  gap: columnGap,
  flexDirection: 'row',
});

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div css={boardStyles} ref={ref}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
    </DndProvider>
  );
}
