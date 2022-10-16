import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { autoScroller } from '@atlaskit/drag-and-drop-autoscroll';

import { ColumnMap, getInitialData } from '../../data/tasks';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

export default function Board() {
  const [data] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());

  // useEffect(() => {
  //   return monitorForElements({
  //     onDragStart: ({ location }) => {
  //       autoScroller.start({ input: location.current.input });
  //     },
  //     onDrop: () => {
  //       autoScroller.stop();
  //     },
  //     onDrag: ({ location }) => {
  //       autoScroller.updateInput({
  //         input: location.current.input,
  //       });
  //     },
  //   });
  // }, []);

  return (
    <div css={boardStyles}>
      {data.orderedColumnIds.map((columnId) => {
        return (
          <Column
            column={data.columnMap[columnId]}
            key={columnId}
            orderedColumnIds={data.orderedColumnIds}
          />
        );
      })}
    </div>
  );
}
