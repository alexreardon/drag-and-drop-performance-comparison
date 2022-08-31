import { memo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { cardGap } from '../../util/constants';
import { fallbackColor } from '../../util/fallback';

import { Card } from './card';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';

const columnStyles = css({
  display: 'flex',
  width: '250px',
  flexDirection: 'column',
  background: token('elevation.surface.sunken', fallbackColor),
  borderRadius: 'calc(var(--grid) * 2)',
  // transition: `background ${mediumDurationMs}ms ${easeInOut}`,
  position: 'relative',
});

const scrollContainerStyles = css({
  // height: '60vh',
  // overflowY: 'auto',
});

const cardListStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: '100%',
  padding: 'var(--grid)',
  // gap: cardGap,
  flexDirection: 'column',
  '> *': {
    marginBottom: cardGap,
  },
});

const columnHeaderStyles = css({
  display: 'flex',
  padding: 'calc(var(--grid) * 2) calc(var(--grid) * 2) calc(var(--grid) * 1)',
  justifyContent: 'space-between',
  flexDirection: 'row',
  color: token('color.text.subtlest', fallbackColor),
  // cursor: 'grab',
  userSelect: 'none',
});

const columnHeaderIdStyles = css({
  color: token('color.text.disabled', fallbackColor),
  fontSize: '10px',
});

export const Column = memo(function Column({
  column,
  index,
}: {
  column: ColumnType;
  index: number;
}) {
  return (
    <Draggable draggableId={column.columnId} index={index}>
      {(draggableProvided: DraggableProvided, draggableSnapshot: DraggableStateSnapshot) => (
        <div
          css={columnStyles}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
        >
          <div
            css={columnHeaderStyles}
            data-testid={`column-${column.columnId}--header`}
            {...draggableProvided.dragHandleProps}
          >
            <h6>{column.title}</h6>
            <span css={columnHeaderIdStyles}>ID: {column.columnId}</span>
          </div>
          <Droppable droppableId={column.columnId} type="QUOTE" direction="vertical">
            {(droppableProvided: DroppableProvided, droppableSnapshot: DroppableStateSnapshot) => (
              <div
                css={scrollContainerStyles}
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                <div css={cardListStyles}>
                  {column.items.map((item, index) => (
                    <Card item={item} key={item.itemId} index={index} />
                  ))}
                </div>
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
});
