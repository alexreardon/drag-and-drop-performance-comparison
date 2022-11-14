import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import { Data, getInitialData } from '../../data/tasks';
import { WithOrderedColumnIds } from '../../shared/with-ordered-column-ids';
import { Column } from './column';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

export default function Board() {
  const [data, setData] = useState<Data>(() => getInitialData());

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const { attachReordering } = await import('./attach-reordering');
      if (controller.signal.aborted) {
        return;
      }
      const cleanup = attachReordering({ setData, data });
      controller.signal.addEventListener('abort', cleanup, { once: true });
    })();

    return () => {
      controller.abort();
    };
  }, [data]);

  return (
    <WithOrderedColumnIds orderedColumnIds={data.orderedColumnIds}>
      <div css={boardStyles}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
    </WithOrderedColumnIds>
  );
}
