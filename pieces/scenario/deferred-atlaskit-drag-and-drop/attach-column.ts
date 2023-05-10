import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import invariant from 'tiny-invariant';

// Pulling all the imports AND logic into a separate file to keep the original bundle low
// Alternative: could do the dynamic imports inside an effect and then do the logic in the original file
export function attachColumn({
  columnRef,
  headerRef,
  cardListRef,
  setIsDraggingOver,
  setClosestEdge,
  columnId,
}: {
  columnRef: MutableRefObject<HTMLElement | null>;
  headerRef: MutableRefObject<HTMLElement | null>;
  cardListRef: MutableRefObject<HTMLElement | null>;
  setIsDraggingOver: Dispatch<SetStateAction<boolean>>;
  setClosestEdge: Dispatch<SetStateAction<Edge | null>>;
  columnId: string;
}) {
  invariant(columnRef.current);
  invariant(headerRef.current);
  invariant(cardListRef.current);

  const cleanup = combine(
    draggable({
      element: columnRef.current,
      dragHandle: headerRef.current,
      getInitialData: () => ({ columnId, type: 'column' }),
    }),
    dropTargetForElements({
      element: cardListRef.current,
      getData: () => ({ columnId }),
      canDrop: (args) => args.source.data.type === 'card',
      getIsSticky: () => true,
      onDragEnter: () => setIsDraggingOver(true),
      onDragLeave: () => setIsDraggingOver(false),
      onDragStart: () => setIsDraggingOver(true),
      onDrop: () => setIsDraggingOver(false),
    }),
    dropTargetForElements({
      element: columnRef.current,
      canDrop: (args) => args.source.data.type === 'column',
      getIsSticky: () => true,
      getData: ({ input, element }) => {
        const data = {
          columnId,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
      onDragEnter: (args) => {
        setClosestEdge(extractClosestEdge(args.self.data));
      },
      onDrag: (args) => {
        setClosestEdge(extractClosestEdge(args.self.data));
      },
      onDragLeave: (args) => {
        setClosestEdge(null);
      },
      onDrop: (args) => {
        setClosestEdge(null);
      },
    }),
  );

  return cleanup;
}
