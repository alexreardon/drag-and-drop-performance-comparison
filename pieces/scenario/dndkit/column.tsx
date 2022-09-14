import { memo, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { fallbackColor } from '../../shared/fallback';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Card } from './card';
import { SortableCard } from './sortable-card';

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

const columnHeaderIdStyles = css({
  color: token('color.text.disabled', fallbackColor),
  fontSize: '10px',
});

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const itemIds = useMemo(() => column.items.map((item) => item.itemId), [column.items]);

  return (
    <div css={[columnStyles]}>
      <div css={columnHeaderStyles} data-testid={`column-${column.columnId}--header`}>
        <h6>{column.title}</h6>
        <span css={columnHeaderIdStyles}>ID: {column.columnId}</span>
      </div>
      <div css={scrollContainerStyles}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div css={cardListStyles}>
            {column.items.map((item) => (
              <SortableCard itemId={item.itemId} key={item.itemId} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
});