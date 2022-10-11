import { forwardRef, memo, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Card } from './card';
import { SortableCard } from './sortable-card';
import { CSS } from '@dnd-kit/utilities';

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
  gap: 'var(--card-gap)',
  flexDirection: 'column',
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

const isDraggingOverColumnStyles = css({
  background: token('color.background.selected.hovered', fallbackColor),
});

// An additional memoization layer to prevent Card memoization checks when
// entering and leaving a list
const CardList = memo(
  forwardRef<HTMLDivElement, { column: ColumnType }>(function CardList({ column }, ref) {
    return (
      <div css={cardListStyles} ref={ref}>
        {column.items.map((item) => (
          <SortableCard itemId={item.itemId} key={item.itemId} />
        ))}
      </div>
    );
  }),
);

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const itemIds = useMemo(() => column.items.map((item) => item.itemId), [column.items]);

  const { attributes, listeners, setNodeRef, isDragging, transform, transition, isSorting } =
    useSortable({
      id: column.columnId,
    });

  const style = {
    opacity: isDragging ? '0' : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      css={[columnStyles, isSorting ? isDraggingOverColumnStyles : undefined]}
      style={style}
      ref={setNodeRef}
    >
      <div css={columnHeaderStyles} {...attributes} {...listeners}>
        <h6>{column.title}</h6>
        <MenuButton label={`controls for column ${column.columnId}`}>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Share</MenuItem>
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <CardList column={column} />
        </SortableContext>
      </div>
    </div>
  );
});
