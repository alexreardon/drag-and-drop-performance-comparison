import { createContext, ReactNode } from 'react';
import { Data } from '../../data/tasks';
import { MenuItem } from '../../shared/menu-button';
import { announce } from '@atlaskit/drag-and-drop-live-region';
import { getCardMoveResult } from './reorder';
import invariant from 'tiny-invariant';
import { useRequiredContext } from '../../shared/use-required-context';

type CardAction =
  | {
      type: 'move-card-backward';
    }
  | {
      type: 'move-card-forward';
    }
  | {
      type: 'move-card-to-column';
      columnId: string;
    };

type ColumnAction =
  | {
      type: 'move-column-backward';
    }
  | {
      type: 'move-column-forward';
    };

// const announce = console.warn;

export function createKeyboardActions({
  getData,
  setData,
}: {
  getData: () => Data;
  setData: (data: Data) => void;
}) {
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

  function getAvailableCardActions({
    itemId,
    columnId,
  }: {
    itemId: string;
    columnId: string;
  }): ReactNode[] {
    const data: Data = getData();
    const column = data.columnMap[columnId];
    const index = column.items.findIndex((item) => item.itemId === itemId);

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

    return actions;
  }

  function performCardAction({
    itemId,
    columnId,
    action,
  }: {
    itemId: string;
    columnId: string;
    action: CardAction;
  }) {
    const data: Data = getData();
    const column = data.columnMap[columnId];
    console.warn(`Action: ${action.type}`, action);
  }

  function getAvailableColumnActions(): CardAction[] {
    return [];
  }

  function performColumnAction(action: CardAction) {}

  return {
    getAvailableCardActions,
    performCardAction,
    getAvailableColumnActions,
    performColumnAction,
  };
}

export const KeyboardActionContext = createContext<ReturnType<typeof createKeyboardActions> | null>(
  null,
);

export function CardActions({ cardId, columnId }) {
  useRequiredContext();
}
