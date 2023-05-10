import { memo, ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { Data } from '../data/tasks';
import { DataContext } from './data-context';
import { MenuItem } from './menu-button';
import { useRequiredContext } from './use-required-context';
import {
  getDataWithColumnReordering,
  getDataWithItemMovement,
} from '../scenario/pragmatic-drag-and-drop/reorder';
import { announce } from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { FocusContext } from './focus-context';

export const ColumnActions = memo(function ColumnActions({ columnId }: { columnId: string }) {
  const { getData, setData } = useRequiredContext(DataContext);
  const { aboutToMove } = useRequiredContext(FocusContext);

  const data: Data = getData();
  const startIndex = data.orderedColumnIds.indexOf(columnId);

  function moveColumnToPosition({ finishIndex }: { finishIndex: number }) {
    const result: Data | null = getDataWithColumnReordering({
      startIndex,
      finishIndex,
      data,
    });

    if (result == null) {
      return;
    }

    aboutToMove({ entityId: columnId });
    setData(result);
    announce(
      `Moving column ${columnId} from position ${startIndex + 1} to position ${finishIndex + 1}`,
    );
  }

  let actions: ReactNode[] = [];

  if (startIndex !== 0) {
    actions.push(
      <MenuItem
        key="left"
        onAction={() =>
          moveColumnToPosition({
            finishIndex: startIndex - 1,
          })
        }
      >
        Move left
      </MenuItem>,
    );
  }
  if (startIndex < data.orderedColumnIds.length - 1) {
    actions.push(
      <MenuItem
        key="right"
        onAction={() =>
          moveColumnToPosition({
            finishIndex: startIndex + 1,
          })
        }
      >
        Move right
      </MenuItem>,
    );
  }

  return <>{actions}</>;
});
