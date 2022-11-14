import type { ColumnMap, ColumnType, Data, Item } from '../../data/tasks';
import type { ElementEventBasePayload } from '@atlaskit/drag-and-drop/adapter/element';
import { reorder as reorderArray } from '@atlaskit/drag-and-drop/util/reorder';
import invariant from 'tiny-invariant';
import { reorderWithEdge } from '@atlaskit/drag-and-drop-hitbox/util/reorder-with-edge';
import { extractClosestEdge, Edge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';

function assertIsString(value: unknown): asserts value is string {
  invariant(typeof value === 'string');
}

function moveItem({
  item,
  source,
  destination,
  startIndex,
  finishIndex,
}: {
  item: Item;
  source: ColumnType;
  destination: ColumnType;
  startIndex: number;
  finishIndex: number;
}): ColumnMap {
  if (source === destination) {
    const reordered = reorderArray({
      list: source.items,
      startIndex: startIndex,
      finishIndex,
    });
    return {
      [source.columnId]: {
        ...source,
        items: reordered,
      },
    };
  }
  // moving to new column
  const newSourceItems = [...source.items];
  newSourceItems.splice(startIndex, 0);

  const newDestinationitems = [...destination.items];
  newDestinationitems.splice(finishIndex, 0, item);

  return {
    [source.columnId]: {
      ...source,
      items: newSourceItems,
    },
    [destination.columnId]: {
      ...destination,
      items: newDestinationitems,
    },
  };
}

export function reorder({
  data,
  result,
}: {
  data: Data;
  result: ElementEventBasePayload;
}): Data | null {
  // dropped nowhere
  if (!result.location.current.dropTargets.length) {
    return null;
  }
  const sourceId = result.source.data.columnId;
  assertIsString(sourceId);

  // reordering column
  if (result.source.data.type === 'column') {
    const finish = result.location.current.dropTargets[0];
    const finishId = finish.data.columnId;
    assertIsString(finishId);

    const startIndex: number = data.orderedColumnIds.indexOf(sourceId);
    const finishIndex: number = data.orderedColumnIds.indexOf(finishId);
    const edge: Edge | null = extractClosestEdge(finish.data);

    const updated = reorderWithEdge({
      list: data.orderedColumnIds,
      startIndex,
      finishIndex,
      edge,
      axis: 'horizontal',
    });

    return { columnMap: data.columnMap, orderedColumnIds: updated };
  }

  // moving a card
  const source: ColumnType = data.columnMap[sourceId];
  const cardIndex: number = source.items.findIndex(
    (item) => item.itemId === result.source.data.itemId,
  );
  const card: Item = source.items[cardIndex];

  // last record will always be a column
  const destinationColumnRecord = result.location.current.dropTargets.at(-1);
  invariant(destinationColumnRecord);
  const destinationId = destinationColumnRecord.data.columnId;
  assertIsString(destinationId);
  const destination = data.columnMap[destinationId];

  // moving relative to a column
  if (result.location.current.dropTargets.length === 1) {
    // moving in same column: move to last position
    if (source === destination) {
      const reordered = reorderArray({
        list: source.items,
        startIndex: cardIndex,
        finishIndex: source.items.length - 1,
      });
      const updated: ColumnMap = {
        ...data.columnMap,
        [source.columnId]: {
          ...source,
          items: reordered,
        },
      };
      return {
        orderedColumnIds: data.orderedColumnIds,
        columnMap: updated,
      };
    }
    // moving to new column: remove from current column and add to last index of new column
    const updated: ColumnMap = {
      ...data.columnMap,
      [source.columnId]: {
        ...source,
        items: source.items.filter((item) => item.itemId !== card.itemId),
      },
      [destination.columnId]: {
        ...destination,
        items: [...destination.items, card],
      },
    };
    return {
      orderedColumnIds: data.orderedColumnIds,
      columnMap: updated,
    };
  }

  // moving relative to a card in a column
  if (result.location.current.dropTargets.length === 2) {
    const destinationCardRecord = result.location.current.dropTargets[0];
    assertIsString(destinationCardRecord.data.itemId);
    const edge: Edge | null = extractClosestEdge(destinationCardRecord.data);
    const finishIndex = destination.items.findIndex(
      (member) => member.itemId === destinationCardRecord.data.itemId,
    );

    // moving in same column: move to last position
    if (source === destination) {
      const reordered = reorderWithEdge({
        list: source.items,
        startIndex: startIndex,
        finishIndex,
        edge,
        axis: 'vertical',
      });
      const updated: ColumnMap = {
        ...data.columnMap,
        [source.columnId]: {
          ...source,
          items: reordered,
        },
      };
      return {
        orderedColumnIds: data.orderedColumnIds,
        columnMap: updated,
      };
    }

    // moving to new column
    const updatedItems: Item[] = [...destination.items];
    const destinationIndex = edge === 'bottom' ? finishIndex + 1 : finishIndex;
    updatedItems.splice(destinationIndex, 0, card);

    const updated: ColumnMap = {
      ...data.columnMap,
      [source.columnId]: {
        ...source,
        // remove from original column
        items: source.items.filter((item) => item.itemId !== card.itemId),
      },
      [destination.columnId]: {
        ...destination,
        // insert into new column
        items: updatedItems,
      },
    };
    return {
      orderedColumnIds: data.orderedColumnIds,
      columnMap: updated,
    };
  }

  // should never get here
  return null;
}
