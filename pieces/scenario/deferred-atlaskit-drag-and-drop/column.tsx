import { memo, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';
import { ColumnType } from '../../data/tasks';
import { cardGap, columnGap } from '../../util/constants';
import { fallbackColor } from '../../util/fallback';

import dynamic from 'next/dynamic';
import { Card } from './card';

const LazyDropIndicator = dynamic(() => import('./drop-indicator'), {
  ssr: false,
  suspense: true,
});

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
  gap: cardGap,
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

const columnHeaderIdStyles = css({
  color: token('color.text.disabled', fallbackColor),
  fontSize: '10px',
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
      const modules = await Promise.all([
        await import('@atlaskit/drag-and-drop-hitbox/addon/closest-edge'),
        await import('@atlaskit/drag-and-drop/adapter/element'),
        await import('@atlaskit/drag-and-drop/util/combine'),
      ]);

      if (controller.signal.aborted) {
        return;
      }

      const [
        { attachClosestEdge, extractClosestEdge },
        { draggable, dropTargetForElements },
        { combine },
      ] = modules;

      invariant(columnRef.current);
      invariant(headerRef.current);
      invariant(cardListRef.current);

      const cleanup = combine(
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

      controller.signal.addEventListener('abort', cleanup, { once: true });

      return () => {
        controller.abort();
      };
    })();
  }, [columnId]);

  return (
    <div css={[columnStyles, isDraggingOver && isDraggingOverColumnStyles]} ref={columnRef}>
      <div css={columnHeaderStyles} ref={headerRef} data-testid={`column-${columnId}--header`}>
        <h6>{column.title}</h6>
        <span css={columnHeaderIdStyles}>ID: {column.columnId}</span>
      </div>
      <div css={scrollContainerStyles}>
        <div css={cardListStyles} ref={cardListRef}>
          {column.items.map((item) => (
            <Card item={item} key={item.itemId} />
          ))}
        </div>
      </div>
      <LazyDropIndicator edge={closestEdge} gap={columnGap} />
    </div>
  );
});
