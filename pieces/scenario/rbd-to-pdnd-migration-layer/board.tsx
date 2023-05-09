import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import type { DroppableProvided, DropResult } from 'react-beautiful-dnd';
import {
  DragDropContext,
  Droppable,
  resetServerContext,
} from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { Column } from './column';
import { reorder } from './reorder';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  flexDirection: 'row',

  // gap: 'var(--column-gap),
  '> *': {
    marginLeft: 'calc(var(--column-gap) / 2)',
    marginRight: 'calc(var(--column-gap) / 2)',
  },
});

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());

  return (
    <DragDropContext
      onDragEnd={(result: DropResult) => {
        const updated = reorder({ data, result });
        if (updated) {
          setData(updated);
        }
      }}
    >
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided: DroppableProvided) => (
          <div css={boardStyles} ref={provided.innerRef} {...provided.droppableProps}>
            {data.orderedColumnIds.map((columnId, index) => {
              return <Column column={data.columnMap[columnId]} key={columnId} index={index} />;
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
