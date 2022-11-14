import { ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { Data } from '../data/tasks';
import { DataContext } from './data-context';
import { MenuItem } from './menu-button';
import { useRequiredContext } from './use-required-context';
import { getCardMoveResult } from '../scenario/atlaskit-drag-and-drop/reorder';
import { announce } from '@atlaskit/drag-and-drop-live-region';

export function CardActions({ itemId, columnId }: { itemId: string; columnId: string }) {
  const { getData, setData } = useRequiredContext(DataContext);

  const data: Data = getData();
  const column = data.columnMap[columnId];
  const index = column.items.findIndex((item) => item.itemId === itemId);

  function moveCardToPosition({
    itemId,
    columnId,
    startIndex,
    finishIndex,
  }: {
    itemId: string;
    columnId: string;
    startIndex: number;
    finishIndex: number;
  }) {
    const data = getData();
    const column = data.columnMap[columnId];
    const item = column.items.find((member) => member.itemId === itemId);
    invariant(item);
    const result: Data | null = getCardMoveResult({
      item,
      startIndex,
      finishIndex,
      source: column,
      destination: column,
      data,
    });

    if (result == null) {
      return;
    }

    // TODO: focus management
    setData(result);
    announce(
      `Moving card ${itemId} in column ${columnId} from position ${startIndex + 1} to position ${
        finishIndex + 1
      }`,
    );
  }

  function moveCardToColumn({
    itemId,
    sourceColumnId,
    destinationColumnId,
  }: {
    itemId: string;
    sourceColumnId: string;
    destinationColumnId: string;
  }) {
    const data = getData();
    const source = data.columnMap[sourceColumnId];
    const destination = data.columnMap[destinationColumnId];
    const startIndex = source.items.findIndex((member) => member.itemId === itemId);
    const item = source.items[startIndex];

    invariant(item);
    const result: Data | null = getCardMoveResult({
      item,
      startIndex,
      // going into first position in new column
      finishIndex: 0,
      source,
      destination,
      data,
    });

    if (result == null) {
      return;
    }

    // TODO: focus management
    setData(result);
    announce(
      `Moving card ${itemId} from column ${sourceColumnId} to the start of column ${destinationColumnId}`,
    );
  }

  let actions: ReactNode[] = [];

  if (index !== 0) {
    actions.push(
      <MenuItem
        key="up"
        onAction={() =>
          moveCardToPosition({ itemId, columnId, startIndex: index, finishIndex: index - 1 })
        }
      >
        Move up
      </MenuItem>,
    );
  }
  if (index < column.items.length - 1) {
    actions.push(
      <MenuItem
        key="down"
        onAction={() =>
          moveCardToPosition({ itemId, columnId, startIndex: index, finishIndex: index + 1 })
        }
      >
        Move down
      </MenuItem>,
    );
  }
  for (let i = 0; i < data.orderedColumnIds.length; i++) {
    const destinationColumnId = data.orderedColumnIds[i];
    if (destinationColumnId !== columnId) {
      actions.push(
        <MenuItem
          key={i}
          onAction={() =>
            moveCardToColumn({ itemId, sourceColumnId: columnId, destinationColumnId })
          }
        >
          Move card to Column {destinationColumnId}
        </MenuItem>,
      );
    }
  }

  return <>{actions}</>;
}
