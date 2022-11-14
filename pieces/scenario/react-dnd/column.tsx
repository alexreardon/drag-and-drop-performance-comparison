import { forwardRef, memo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';

import { useDrag, useDrop } from 'react-dnd';
import { Card } from './card';
import mergeRefs from './merge-refs';
import { Edge, getClosestEdge } from './get-closest-edge';
import DropIndicator from '@atlaskit/drag-and-drop-indicator/box';

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
          <Card item={item} key={item.itemId} columnId={column.columnId} />
        ))}
      </div>
    );
  }),
);

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const dropTargetRef = useRef<HTMLDivElement | null>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [{ isOver }, cardDropRef] = useDrop(() => ({
    accept: 'CARD',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [{ isColumnOver }, columnDropRef] = useDrop(() => ({
    accept: 'COLUMN',
    hover: (item, monitor) => {
      if (!monitor.canDrop()) {
        setClosestEdge(null);
        return;
      }
      const edge = getClosestEdge({
        ref: dropTargetRef,
        allowedEdges: ['left', 'right'],
        client: monitor.getClientOffset(),
      });
      setClosestEdge(edge);
    },
    canDrop(item, monitor) {
      if (typeof item === 'object' && item != null) {
        return (item as any).columnId !== column.columnId;
      }
      return true;
    },
    collect: (monitor) => ({
      isColumnOver: monitor.isOver(),
    }),
  }));

  const [{ isDragging }, dragHandleRef, draggableRef] = useDrag(() => ({
    type: 'COLUMN',
    item: { columnId: column.columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      css={[columnStyles, isOver && isDraggingOverColumnStyles]}
      ref={mergeRefs([draggableRef, columnDropRef, dropTargetRef])}
    >
      <div css={columnHeaderStyles} ref={dragHandleRef}>
        <h6>{column.title}</h6>
        <MenuButton label={`controls for column ${column.columnId}`}>
          {() => (
            <>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Share</MenuItem>
              <MenuItem>Move left</MenuItem>
              <MenuItem>Move right</MenuItem>
            </>
          )}
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <CardList column={column} ref={cardDropRef} />
      </div>
      {closestEdge && (
        <DropIndicator edge={isColumnOver ? closestEdge : null} gap={'var(--column-gap)'} />
      )}
    </div>
  );
});
