import type { DraggableLocation, DropResult } from 'react-beautiful-dnd';
import type { ColumnMap, ColumnType, Data, Item } from '../../data/tasks';
import { reorder as reorderArray } from '@atlaskit/pragmatic-drag-and-drop/reorder';

export function reorder({ data, result }: { data: Data; result: DropResult }): Data | null {
  // dropped nowhere
  if (!result.destination) {
    return null;
  }

  const source: DraggableLocation = result.source;
  const destination: DraggableLocation = result.destination;

  // did not move anywhere - can bail early
  if (source.droppableId === destination.droppableId && source.index === destination.index) {
    return null;
  }

  // reordering column
  if (result.type === 'COLUMN') {
    const newOrderedColumnIds: string[] = reorderArray({
      list: data.orderedColumnIds,
      startIndex: source.index,
      finishIndex: destination.index,
    });

    return {
      columnMap: data.columnMap,
      orderedColumnIds: newOrderedColumnIds,
    };
  }

  // moving a card
  const current: ColumnType = data.columnMap[source.droppableId];
  const next: ColumnType = data.columnMap[destination.droppableId];
  const dragging: Item = current.items[source.index];

  // moving in same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Item[] = reorderArray({
      list: current.items,
      startIndex: source.index,
      finishIndex: destination.index,
    });
    const updated: ColumnMap = {
      ...data.columnMap,
      [current.columnId]: {
        ...current,
        items: reordered,
      },
    };
    return {
      columnMap: updated,
      orderedColumnIds: data.orderedColumnIds,
    };
  }

  // moving between lists
  const firstItems = [...current.items];
  firstItems.splice(source.index, 1);
  const first: ColumnType = {
    ...current,
    items: firstItems,
  };

  const secondItems = [...next.items];
  secondItems.splice(destination.index, 0, dragging);
  const second: ColumnType = {
    ...next,
    items: secondItems,
  };

  const updated: ColumnMap = {
    ...data.columnMap,
    [first.columnId]: first,
    [second.columnId]: second,
  };

  return {
    columnMap: updated,
    orderedColumnIds: data.orderedColumnIds,
  };
}
