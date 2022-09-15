import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { ColumnMap, getInitialData, Item } from '../../data/tasks';
import { Column } from './column';
import { Card } from './card';
import invariant from 'tiny-invariant';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

type DragState =
  | {
      type: 'idle';
    }
  | {
      type: 'dragging-card';
      itemId: string;
    }
  | {
      type: 'dragging-column';
      columnId: string;
    };

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<DragState>({ type: 'idle' });

  return (
    <DndContext
      onDragStart={(event) => {
        const { id } = event.active;
        invariant(typeof id === 'string');

        const item: Item | undefined = data.orderedColumnIds
          .flatMap((columnId) => data.columnMap[columnId].items)
          .find((item) => item.itemId === event.active.id);

        if (item) {
          setState({ type: 'dragging-card', itemId: item.itemId });
          return;
        }

        const columnId: string | undefined = data.orderedColumnIds.includes(id) ? id : undefined;

        invariant(columnId);
        setState({ type: 'dragging-column', columnId });
      }}
      onDragEnd={() => setState({ type: 'idle' })}
    >
      <SortableContext items={data.orderedColumnIds} strategy={horizontalListSortingStrategy}>
        <div css={boardStyles} ref={ref}>
          {data.orderedColumnIds.map((columnId) => {
            return <Column column={data.columnMap[columnId]} key={columnId} />;
          })}
        </div>
      </SortableContext>
      <DragOverlay>
        {state.type === 'dragging-card' ? (
          <Card itemId={state.itemId} state="dragging" />
        ) : state.type === 'dragging-column' ? (
          <Column column={data.columnMap[state.columnId]} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
