import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  resetServerContext,
} from 'react-beautiful-dnd';
import invariant from 'tiny-invariant';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { useCounter } from '../../shared/use-counter';
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
  useCounter();

  return (
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
  );
}
