import type { ColumnMap, ColumnType, Data, Item } from '../../data/tasks';
import type { ElementEventBasePayload } from '@atlaskit/drag-and-drop/adapter/element';
import { reorder as reorderArray } from '@atlaskit/drag-and-drop/util/reorder';
import invariant from 'tiny-invariant';
import { extractClosestEdge, Edge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { getDestinationIndex } from './get-destination-index';

function assertIsString(value: unknown): asserts value is string {
  invariant(typeof value === 'string');
}

export function getDataWithColumnReordering({
  startIndex,
  finishIndex,
  data,
}: {
  startIndex: number;
  finishIndex: number;
  data: Data;
}): Data | null {
  const reordered = reorderArray({
    list: data.orderedColumnIds,
    startIndex: startIndex,
    finishIndex,
  });

  return { columnMap: data.columnMap, orderedColumnIds: reordered };
}

export function getDataWithItemMovement(
  args: Parameters<typeof moveItem>[0] & { data: Data },
): Data | null {
  const map = moveItem(args);
  if (map == null) {
    return null;
  }
  return {
    orderedColumnIds: args.data.orderedColumnIds,
    columnMap: {
      ...args.data.columnMap,
      ...map,
    },
  };
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
}): ColumnMap | null {
  if (source === destination) {
    // not moving anywhere, can skip this update
    if (startIndex === finishIndex) {
      return null;
    }

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
  newSourceItems.splice(startIndex, 1);

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

    return getDataWithColumnReordering({
      startIndex,
      finishIndex: getDestinationIndex({ edge, startIndex, finishIndex, axis: 'vertical' }),
      data,
    });
  }

  // moving a card
  const source: ColumnType = data.columnMap[sourceId];
  const startIndex: number = source.items.findIndex(
    (item) => item.itemId === result.source.data.itemId,
  );
  const item: Item = source.items[startIndex];

  // last record will always be a column
  const destinationColumnRecord = result.location.current.dropTargets.at(-1);
  invariant(destinationColumnRecord);
  const destinationId = destinationColumnRecord.data.columnId;
  assertIsString(destinationId);
  const destination = data.columnMap[destinationId];

  // moving relative to a column
  if (result.location.current.dropTargets.length === 1) {
    // moving in same column: move to last position
    const finishIndex = source === destination ? source.items.length - 1 : destination.items.length;
    return getDataWithItemMovement({ item, source, destination, startIndex, finishIndex, data });
  }

  // moving relative to a card in a column
  if (result.location.current.dropTargets.length === 2) {
    const destinationCardRecord = result.location.current.dropTargets[0];
    assertIsString(destinationCardRecord.data.itemId);
    const edge: Edge | null = extractClosestEdge(destinationCardRecord.data);
    const indexInDesintation = destination.items.findIndex(
      (member) => member.itemId === destinationCardRecord.data.itemId,
    );

    const finishIndex: number = (() => {
      if (source === destination) {
        // reordering in same list
        return getDestinationIndex({
          edge,
          startIndex,
          finishIndex: indexInDesintation,
          axis: 'vertical',
        });
      }
      // moving into new list
      return edge === 'bottom' ? indexInDesintation + 1 : indexInDesintation;
    })();
    return getDataWithItemMovement({ item, source, destination, startIndex, finishIndex, data });
  }

  // should never get here
  return null;
}
