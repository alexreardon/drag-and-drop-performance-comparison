import { createContext } from 'react';
import { Data } from '../../data/tasks';

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

export function createKeyboardActions({
  getData,
  setData,
}: {
  getData: () => Data;
  setData: (data: Data) => void;
}) {
  function getAvailableCardActions({
    itemId,
    columnId,
  }: {
    itemId: string;
    columnId: string;
  }): CardAction[] {
    const data: Data = getData();
    const column = data.columnMap[columnId];
    const index = column.items.findIndex((item) => item.itemId === itemId);

    let actions: CardAction[] = [];

    if (index !== 0) {
      actions.push({ type: 'move-card-backward' });
    }
    if (index < column.items.length - 1) {
      actions.push({ type: 'move-card-forward' });
    }
    for (let i = 0; i < data.orderedColumnIds.length; i++) {
      if (data.orderedColumnIds[i] !== columnId) {
        actions.push({ type: 'move-card-to-column', columnId: data.orderedColumnIds[i] });
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
