import { forwardRef, memo, Suspense, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';

import dynamic from 'next/dynamic';
import { Card } from './card';

const LazyDropIndicator = dynamic(
  () => import('@atlaskit/pragmatic-drag-and-drop-react-indicator/box'),
);
const LazyColumnActions = dynamic(() =>
  import('../../shared/column-actions').then((mod) => mod.ColumnActions),
);

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
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const { attachColumn } = await import('./attach-column');

      if (controller.signal.aborted) {
        return;
      }

      const cleanup = attachColumn({
        headerRef,
        columnRef,
        cardListRef,
        columnId,
        setIsDraggingOver,
        setClosestEdge,
      });
      controller.signal.addEventListener('abort', cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, [columnId]);

  return (
    <div css={[columnStyles, isDraggingOver && isDraggingOverColumnStyles]} ref={columnRef}>
      <div css={columnHeaderStyles} ref={headerRef}>
        <h6>{column.title}</h6>
        <MenuButton label={`controls for column ${column.columnId}`}>
          {() => (
            <>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Share</MenuItem>
              <LazyColumnActions columnId={columnId} />
            </>
          )}
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <CardList column={column} ref={cardListRef} />
      </div>
      <Suspense>
        {closestEdge && <LazyDropIndicator edge={closestEdge} gap={'var(--column-gap)'} />}
      </Suspense>
    </div>
  );
});
