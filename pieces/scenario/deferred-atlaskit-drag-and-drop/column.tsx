import { memo, Suspense, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';
import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { MenuButton, MenuItem } from '../../shared/menu-button';

import dynamic from 'next/dynamic';
import { Card } from './card';

const LazyDropIndicator = dynamic(() => import('@atlaskit/drag-and-drop-indicator/box'));

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
          <MenuItem>Edit</MenuItem>
          <MenuItem>Share</MenuItem>
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <div css={cardListStyles} ref={cardListRef}>
          {column.items.map((item) => (
            <Card item={item} key={item.itemId} />
          ))}
        </div>
      </div>
      <Suspense>
        <LazyDropIndicator edge={closestEdge} gap={'var(--column-gap)'} />
      </Suspense>
    </div>
  );
});
