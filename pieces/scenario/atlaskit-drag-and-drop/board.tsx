import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { bind } from 'bind-event-listener';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Data, getInitialData } from '../../data/tasks';
import {
  DataContext,
  DataContextValue,
  useStableDataContextValue,
} from '../../shared/data-context';
import {
  FocusContext,
  FocusContextValue,
  useStableFocusContextValue,
} from '../../shared/focus-context';
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
  const dataContext: DataContextValue = useStableDataContextValue(data, setData);
  const focusContext: FocusContextValue = useStableFocusContextValue();

  useEffect(() => {
    return monitorForElements({
      onDrop(args) {
        const updated = reorder({ data, result: args });
        if (updated) {
          setData(updated);
        }
        document.body.style.pointerEvents = 'none';
        bind(window, {
          type: 'pointermove',
          listener() {
            document.body.style.removeProperty('pointer-events');
          },
          options: { capture: true, once: true },
        });
      },
    });
  }, [data]);

  return (
    <FocusContext.Provider value={focusContext}>
      <DataContext.Provider value={dataContext}>
        <div css={boardStyles}>
          {data.orderedColumnIds.map((columnId) => {
            return <Column column={data.columnMap[columnId]} key={columnId} />;
          })}
        </div>
      </DataContext.Provider>
    </FocusContext.Provider>
  );
}
