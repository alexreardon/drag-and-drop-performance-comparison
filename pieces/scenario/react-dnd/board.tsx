import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ColumnMap, Data, getInitialData } from '../../data/tasks';
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
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <FocusContext.Provider value={focusContext}>
      <DataContext.Provider value={dataContext}>
        <DndProvider backend={HTML5Backend}>
          <div css={boardStyles} ref={ref}>
            {data.orderedColumnIds.map((columnId) => {
              return <Column column={data.columnMap[columnId]} key={columnId} />;
            })}
          </div>
        </DndProvider>
      </DataContext.Provider>
    </FocusContext.Provider>
  );
}
