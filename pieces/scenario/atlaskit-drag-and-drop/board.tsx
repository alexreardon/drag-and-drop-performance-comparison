import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { Data, getInitialData } from '../../data/tasks';
import { WithOrderedColumnIds } from '../../shared/with-ordered-column-ids';
import { Column } from './column';
import { reorder } from './reorder';

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
    return monitorForElements({
      onDrop(args) {
        const updated = reorder({ data, result: args });
        if (updated) {
          setData(updated);
        }
      },
    });
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
