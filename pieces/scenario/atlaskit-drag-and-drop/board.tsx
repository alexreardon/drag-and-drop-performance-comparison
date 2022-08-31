import { useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';

import invariant from 'tiny-invariant';
import { extractClosestEdge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';
import { reorderWithEdge } from '@atlaskit/drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import { ColumnMap, ColumnType, getInitialData, Item } from '../../data/tasks';
import { Column } from '../deferred-atlaskit-drag-and-drop/column';
import { columnGap, gridSize } from '../../util/constants';

const boardStyles = css({
  display: 'flex',
  padding: columnGap,
  justifyContent: 'center',
  gap: columnGap,
  flexDirection: 'row',
  '--grid': `${gridSize}px`,
});

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForElements({
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }
          // need to handle drop

          // 1. remove element from original position
          // 2. move to new position

          if (source.data.type === 'column') {
            const startIndex: number = data.orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId,
            );

            const target = location.current.dropTargets[0];
            const finishIndex: number = data.orderedColumnIds.findIndex(
              (id) => id === target.data.columnId,
            );
            const edge: Edge | null = extractClosestEdge(target.data);

            const updated = reorderWithEdge({
              list: data.orderedColumnIds,
              startIndex,
              finishIndex,
              edge,
              axis: 'horizontal',
            });

            setData({ ...data, orderedColumnIds: updated });
          }
          // Dragging a card
          if (source.data.type === 'card') {
            const itemId = source.data.itemId;
            invariant(typeof itemId === 'string');
            // TODO: these lines not needed if item has columnId on it
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === 'string');
            const sourceColumn = data.columnMap[sourceId];
            const itemIndex = sourceColumn.items.findIndex((item) => item.itemId === itemId);
            const item: Item = sourceColumn.items[itemIndex];

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === 'string');
              const destinationColumn = data.columnMap[destinationId];
              invariant(destinationColumn);

              // reordering in same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.items,
                  startIndex: itemIndex,
                  finishIndex: sourceColumn.items.length - 1,
                  edge: null,
                  axis: 'vertical',
                });
                const updatedMap = {
                  ...data.columnMap,
                  [sourceColumn.columnId]: {
                    ...sourceColumn,
                    items: updated,
                  },
                };
                setData({ ...data, columnMap: updatedMap });
                return;
              }

              // moving to a new column
              const updatedMap = {
                ...data.columnMap,
                [sourceColumn.columnId]: {
                  ...sourceColumn,
                  items: sourceColumn.items.filter((i) => i.itemId !== itemId),
                },
                [destinationColumn.columnId]: {
                  ...destinationColumn,
                  items: [...destinationColumn.items, item],
                },
              };

              setData({ ...data, columnMap: updatedMap });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] = location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === 'string');
              const destinationColumn = data.columnMap[destinationColumnId];

              const finishIndex = destinationColumn.items.findIndex(
                (item) => item.itemId === destinationCardRecord.data.itemId,
              );
              const edge: Edge | null = extractClosestEdge(destinationCardRecord.data);

              // case 1: ordering in the same column
              if (sourceColumn === destinationColumn) {
                const updated = reorderWithEdge({
                  list: sourceColumn.items,
                  startIndex: itemIndex,
                  finishIndex,
                  edge,
                  axis: 'vertical',
                });
                const updatedSourceColumn: ColumnType = {
                  ...sourceColumn,
                  items: updated,
                };
                const updatedMap: ColumnMap = {
                  ...data.columnMap,
                  [sourceColumn.columnId]: updatedSourceColumn,
                };
                setData({ ...data, columnMap: updatedMap });
                return;
              }

              // case 2: moving into a new column relative to a card

              const updatedSourceColumn: ColumnType = {
                ...sourceColumn,
                items: sourceColumn.items.filter((i) => i !== item),
              };
              const updated: Item[] = Array.from(destinationColumn.items);
              const destinationIndex = edge === 'bottom' ? finishIndex + 1 : finishIndex;
              updated.splice(destinationIndex, 0, item);

              const updatedDestinationColumn: ColumnType = {
                ...destinationColumn,
                items: updated,
              };
              const updatedMap: ColumnMap = {
                ...data.columnMap,
                [sourceColumn.columnId]: updatedSourceColumn,
                [destinationColumn.columnId]: updatedDestinationColumn,
              };
              setData({ ...data, columnMap: updatedMap });
            }
          }
        },
      }),
    );
  }, [data]);

  return (
    <div css={boardStyles} ref={ref}>
      {data.orderedColumnIds.map((columnId) => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
      })}
    </div>
  );
}
