/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/** @jsx jsx */
import { memo, useRef } from 'react';

import { ColumnType } from '../../data/tasks';

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);

  return (
    <div css={[columnStyles]} ref={columnRef}>
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
    </div>
  );
});
