export function getDestination({
  start,
  target
}) {
  if (target === null) {
    return null;
  }
  /**
   * When reordering an item to an index greater than its current index
   * in the same list, then the visual index needs adjustment.
   *
   * This is to account for the item itself moving, which would cause a shift.
   */


  const isSameList = start.droppableId === target.droppableId;
  const isMovingForward = target.index > start.index;
  const shouldAdjust = isSameList && isMovingForward;

  if (!shouldAdjust) {
    return { ...target
    };
  }

  return { ...target,
    index: target.index - 1
  };
}