import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import { Data, getInitialData } from '../../data/tasks';
import { WithOrderedColumnIds } from '../../shared/with-ordered-column-ids';
import { Column } from './column';
import { createKeyboardActions, KeyboardActionContext } from './keyboard-actions';
import { reorder } from './reorder';

const boardStyles = css({
  display: 'flex',
  padding: 'var(--column-gap)',
  justifyContent: 'center',
  gap: 'var(--column-gap)',
  flexDirection: 'row',
});

function useStableGetData(data: Data): () => Data {
  const last = useRef<Data>(data);
  const getData = useRef<() => Data>(() => last.current);
  useEffect(() => {
    last.current = data;
  }, [data]);
  return getData.current;
}

export default function Board() {
  const [data, setData] = useState<Data>(() => getInitialData());
  const getData = useStableGetData(data);
  const [api] = useState(() => createKeyboardActions({ setData, getData }));

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
    <KeyboardActionContext.Provider value={api}>
      <WithOrderedColumnIds orderedColumnIds={data.orderedColumnIds}>
        <div css={boardStyles}>
          {data.orderedColumnIds.map((columnId) => {
            return <Column column={data.columnMap[columnId]} key={columnId} />;
          })}
        </div>
      </WithOrderedColumnIds>
    </KeyboardActionContext.Provider>
  );
}
