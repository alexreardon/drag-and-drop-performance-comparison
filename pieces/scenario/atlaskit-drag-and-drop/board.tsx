import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Data, getInitialData } from '../../data/tasks';
import { DataContext, DataContextValue } from '../../shared/data-context';
import { Column } from './column';
import { reorder } from './reorder';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

function useStableDataContextValue(data: Data, setData: (value: Data) => void): DataContextValue {
  const last = useRef<Data>(data);
  useEffect(() => {
    last.current = data;
  }, [data]);
  const stable: DataContextValue = useMemo(
    () => ({
      setData,
      getData: () => last.current,
    }),
    [],
  );
  return stable;
}

export default function Board() {
  const [data, setData] = useState<Data>(() => getInitialData());
  const dataContext: DataContextValue = useStableDataContextValue(data, setData);

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
    <DataContext.Provider value={dataContext}>
      <div css={boardStyles}>
        {data.orderedColumnIds.map((columnId) => {
          return <Column column={data.columnMap[columnId]} key={columnId} />;
        })}
      </div>
    </DataContext.Provider>
  );
}
