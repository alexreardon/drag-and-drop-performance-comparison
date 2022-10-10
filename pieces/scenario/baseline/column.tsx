import { memo } from 'react';

import { css } from '@emotion/react';

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

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  return (
    <div css={[columnStyles]}>
      <div css={columnHeaderStyles}>
        <h6>{column.title}</h6>
        <MenuButton label={`controls for column ${column.columnId}`}>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Share</MenuItem>
        </MenuButton>
      </div>
      <div css={scrollContainerStyles}>
        <div css={cardListStyles}>
          {column.items.map((item) => (
            <Card item={item} key={item.itemId} />
          ))}
        </div>
      </div>
    </div>
  );
});
