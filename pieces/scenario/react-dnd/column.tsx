import { memo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/tasks';
import { cardGap } from '../../util/constants';
import { fallbackColor } from '../../util/fallback';

import { Card } from './card';
import { useDrag, useDrop } from 'react-dnd';

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
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'CARD',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [{ isDragging }, dragHandleRef, draggableRef] = useDrag(() => ({
    type: 'COLUMN',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div css={[columnStyles, isOver && isDraggingOverColumnStyles]} ref={draggableRef}>
      <div
        css={columnHeaderStyles}
        ref={dragHandleRef}
        data-testid={`column-${column.columnId}--header`}
      >
        <h6>{column.title}</h6>
        <span css={columnHeaderIdStyles}>ID: {column.columnId}</span>
      </div>
      <div css={scrollContainerStyles}>
        <div css={cardListStyles} ref={dropRef}>
          {column.items.map((item) => (
            <Card item={item} key={item.itemId} />
          ))}
        </div>
      </div>
    </div>
  );
});
