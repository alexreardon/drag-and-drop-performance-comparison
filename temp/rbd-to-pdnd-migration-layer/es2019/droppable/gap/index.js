import invariant from 'tiny-invariant';
import { customAttributes, getAttribute } from '../../utils/attributes';
import { queryDraggableByIndex } from '../../utils/query-draggable';
import { getDistance } from './get-distance';

function getDroppableId(element) {
  return getAttribute(element, customAttributes.draggable.droppableId);
}

function getIndex(element) {
  const value = getAttribute(element, customAttributes.draggable.index);
  const index = parseInt(value);
  invariant(Number.isInteger(index), 'The index is valid');
  return index;
}
/**
 * ASSUMPTIONS:
 * - Adjacent `<Draggable>` items are visually adjacent.
 * - If there is an adjacent element, it is rendered.
 */


export function calculateGap({
  element,
  where,
  direction
}) {
  const droppableId = getDroppableId(element);
  const index = getIndex(element);
  const indexBefore = index - 1;
  const indexAfter = index + 1;
  const isBefore = where === 'before';
  let adjacentElement = queryDraggableByIndex({
    droppableId,
    index: isBefore ? indexBefore : indexAfter
  });

  if (adjacentElement === null) {
    /**
     * If there is no adjacent element, we can guess based on margins.
     */
    const {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft
    } = getComputedStyle(element);

    if (direction === 'horizontal') {
      return parseFloat(marginLeft) + parseFloat(marginRight);
    }

    return parseFloat(marginTop) + parseFloat(marginBottom);
  }

  const distance = getDistance({
    direction,
    a: element.getBoundingClientRect(),
    b: adjacentElement.getBoundingClientRect()
  });
  return distance;
}
export function getGapOffset({
  element,
  where,
  direction
}) {
  const gap = calculateGap({
    element,
    where,
    direction
  });

  if (where === 'before') {
    return -gap / 2;
  }

  return gap / 2;
}