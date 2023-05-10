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
import { scrollJustEnoughIntoView } from '@atlaskit/pragmatic-drag-and-drop/util/scroll-just-enough-into-view';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import invariant from 'tiny-invariant';

export type DraggableState = 'idle' | 'generate-preview' | 'dragging';

// Pulling all the imports AND logic into a separate file to keep the original bundle low
// Alternative: could do the dynamic imports inside an effect and then do the logic in the original file
export function attachCard({
  ref,
  setState,
  setClosestEdge,
  itemId,
  columnId,
}: {
  ref: MutableRefObject<HTMLElement | null>;
  setState: Dispatch<SetStateAction<DraggableState>>;
  setClosestEdge: Dispatch<SetStateAction<Edge | null>>;
  itemId: string;
  columnId: string;
}) {
  invariant(ref.current);
  const cleanup = combine(
    draggable({
      element: ref.current,
      getInitialData: () => ({ type: 'card', itemId, columnId }),
      onGenerateDragPreview: ({ source }) => {
        scrollJustEnoughIntoView({ element: source.element });
        setState('generate-preview');
      },
      onDragStart: () => setState('dragging'),
      onDrop: () => setState('idle'),
    }),
    dropTargetForElements({
      element: ref.current,
      canDrop: (args) => args.source.data.type === 'card',
      getIsSticky: () => true,
      getData: ({ input, element }) => {
        const data = { type: 'card', itemId, columnId };

        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        });
      },
      onDragEnter: (args) => {
        if (args.source.data.itemId !== itemId) {
          setClosestEdge(extractClosestEdge(args.self.data));
        }
      },
      onDrag: (args) => {
        if (args.source.data.itemId !== itemId) {
          setClosestEdge(extractClosestEdge(args.self.data));
        }
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
