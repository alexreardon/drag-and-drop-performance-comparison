import { extractClosestEdge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { isDraggableData } from '../draggable/data';
import { isDroppableData } from '../droppable/data';
import { customAttributes, getAttribute } from '../utils/attributes';
import { queryAllDraggables } from '../utils/query-draggable';

function getDraggableLocationFromDraggableData({
  droppableId,
  getIndex,
  ...data
}) {
  let index = getIndex();
  const closestEdge = extractClosestEdge(data);

  if (closestEdge === 'bottom' || closestEdge === 'right') {
    index += 1;
  }

  return {
    droppableId,
    index
  };
}

function getDraggableLocationFromDroppableData({
  droppableId
}) {
  const draggables = queryAllDraggables(droppableId);
  let index = 0;

  for (const draggable of draggables) {
    const draggableIndex = parseInt(getAttribute(draggable, customAttributes.draggable.index), 10);
    index = Math.max(index, draggableIndex + 1);
  }

  return {
    droppableId,
    index
  };
}
/**
 * Derives a `DraggableLocation` (`react-beautiful-dnd`)
 * from a `DragLocation` (`@atlaskit/drag-and-drop`).
 */


export function getDraggableLocation(location) {
  const {
    dropTargets
  } = location; // If there are no drop targets then there is no destination.

  if (dropTargets.length === 0) {
    return null;
  } // Obtains the innermost drop target.


  const target = dropTargets[0]; // If the target is a draggable we can extract its index.

  if (isDraggableData(target.data)) {
    return getDraggableLocationFromDraggableData(target.data);
  } // If the target is a droppable, there is no index to extract.
  // We default to the end of the droppable.


  if (isDroppableData(target.data)) {
    return getDraggableLocationFromDroppableData(target.data);
  } // The target is not from the migration layer.


  return null;
}
/**
 * Checks if two `DraggableLocation` values are equivalent.
 */

export function isSameLocation(a, b) {
  if ((a === null || a === void 0 ? void 0 : a.droppableId) !== (b === null || b === void 0 ? void 0 : b.droppableId)) {
    return false;
  }

  if ((a === null || a === void 0 ? void 0 : a.index) !== (b === null || b === void 0 ? void 0 : b.index)) {
    return false;
  }

  return true;
}