import { memo, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { draggable, dropTargetForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import DropIndicator from '@atlaskit/drag-and-drop-indicator/box';
import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';

import { Card } from './card';

const columnStyles = css({
  display: 'flex',
  width: '250px',
  flexDirection: 'column',
  background: token('elevation.surface.sunken', fallbackColor),
  borderRadius: 'calc(var(--grid) * 2)',
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

export const Column = memo(function Column({
  column,
  orderedColumnIds,
}: {
  column: ColumnType;
  orderedColumnIds: string[];
}) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    invariant(columnRef.current);
    invariant(headerRef.current);
    invariant(cardListRef.current);
    return combine(
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: 'column' }),
      }),
      dropTargetForElements({
        element: cardListRef.current,
        getData: () => ({ columnId }),
        canDrop: (args) => args.source.data.type === 'card',
        getIsSticky: () => true,
        onDragEnter: () => setIsDraggingOver(true),
        onDragLeave: () => setIsDraggingOver(false),
        onDragStart: () => setIsDraggingOver(true),
        onDrop: () => setIsDraggingOver(false),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: (args) => args.source.data.type === 'column',
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        onDragEnter: (args) => {
          setClosestEdge(extractClosestEdge(args.self.data));
        },
        onDrag: (args) => {
          setClosestEdge(extractClosestEdge(args.self.data));
        },
        onDragLeave: (args) => {
          setClosestEdge(null);
        },
        onDrop: (args) => {
          setClosestEdge(null);
        },
      }),
    );
  }, [columnId]);

  return (
    <div css={[columnStyles, isDraggingOver && isDraggingOverColumnStyles]} ref={columnRef}>
      <div css={columnHeaderStyles} ref={headerRef}>
        <h6>{column.title}</h6>
        <MenuButton label={`controls for column ${columnId}`}>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Share</MenuItem>
          <MenuItem>Move left</MenuItem>
          <MenuItem>Move right</MenuItem>
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <div css={cardListStyles} ref={cardListRef}>
          {column.items.map((item) => (
            <Card
              item={item}
              key={item.itemId}
              columnId={columnId}
              /**
               * Passing this down to Cards means that every card will re-render
               * if a column changes order.
               *
               * If we end up implementing re-order behavior we should refactor
               * this.
               *
               * One approach is to pass down a stable function (or use context)
               * which will return the current ids. This uses laziness to
               * avoid unnecessary re-renders.
               */
              orderedColumnIds={orderedColumnIds}
            />
          ))}
        </div>
      </div>
      <DropIndicator edge={closestEdge} gap={'var(--column-gap)'} />
    </div>
  );
});
