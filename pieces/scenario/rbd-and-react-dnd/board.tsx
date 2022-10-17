import { css } from '@emotion/react';
import { useState } from 'react';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { Column } from './column';

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
    <DndProvider backend={HTML5Backend}>
      <DragDropContext onDragEnd={() => {}}>
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
    </DndProvider>
  );
}
