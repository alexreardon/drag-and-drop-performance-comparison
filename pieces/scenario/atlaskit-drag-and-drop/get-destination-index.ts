import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

export function getDestinationIndex({
  edge,
  startIndex,
  finishIndex,
  axis,
}: {
  edge: Edge | null;
  startIndex: number;
  finishIndex: number;
  axis: 'vertical' | 'horizontal';
}): number {
  // invalid index's
  if (startIndex === -1 || finishIndex === -1) {
    return startIndex;
  }

  // if we are targeting the same index we don't need to do anything
  if (startIndex === finishIndex) {
    return startIndex;
  }

  if (edge == null) {
    return finishIndex;
  }

  const isGoingAfter: boolean =
    (axis === 'vertical' && edge === 'bottom') || (axis === 'horizontal' && edge === 'right');

  const isMovingForward: boolean = startIndex < finishIndex;
  // moving forward
  if (isMovingForward) {
    return isGoingAfter ? finishIndex : finishIndex - 1;
  }
  // moving backwards
  return isGoingAfter ? finishIndex + 1 : finishIndex;
}
