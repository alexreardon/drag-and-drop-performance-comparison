import { forwardRef, memo, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';

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
  height: '80vh',
  overflowY: 'auto',
});

const cardListStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: '100%',
  padding: 'var(--grid)',
  // gap: cardGap,
  flexDirection: 'column',
  '> *': {
    marginBottom: 'var(--card-gap)',
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

// An additional memoization layer to prevent Card memoization checks when
// entering and leaving a list
const CardList = memo(
  forwardRef<HTMLDivElement, { column: ColumnType }>(function CardList({ column }, ref) {
    return (
      <div css={cardListStyles} ref={ref}>
        {column.items.map((item, index) => (
          <Card item={item} key={item.itemId} index={index} />
        ))}
      </div>
    );
  }),
);

const isDraggingOverCardListStyles = css({
  background: token('color.background.selected.hovered', fallbackColor),
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
          <div css={columnHeaderStyles} {...draggableProvided.dragHandleProps}>
            <h6>{column.title}</h6>
            <MenuButton label={`controls for column ${column.columnId}`}>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Share</MenuItem>
            </MenuButton>
          </div>
          <Droppable droppableId={column.columnId} type="QUOTE" direction="vertical">
            {(droppableProvided: DroppableProvided, droppableSnapshot: DroppableStateSnapshot) => (
              <div
                css={[
                  scrollContainerStyles,
                  droppableSnapshot.isDraggingOver ? isDraggingOverCardListStyles : undefined,
                ]}
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                <CardList column={column} />
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
});
