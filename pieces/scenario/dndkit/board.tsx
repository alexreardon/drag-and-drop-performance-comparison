import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { Column } from './column';
import { Card } from './card';
import invariant from 'tiny-invariant';

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
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DndContext
      onDragStart={(event) => {
        invariant(typeof event.active.id === 'string');
        setActiveId(event.active.id);
      }}
      onDragEnd={() => setActiveId(null)}
    >
      <div css={boardStyles} ref={ref}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
      <DragOverlay>{activeId ? <Card itemId={activeId} state="dragging" /> : null}</DragOverlay>
    </DndContext>
  );
}
