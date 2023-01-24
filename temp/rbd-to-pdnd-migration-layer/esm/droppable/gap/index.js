import invariant from 'tiny-invariant';
import { customAttributes, getAttribute } from '../../utils/attributes';
import { queryDraggableByIndex } from '../../utils/query-draggable';
import { getDistance } from './get-distance';

function getDroppableId(element) {
  return getAttribute(element, customAttributes.draggable.droppableId);
}

function getIndex(element) {
  var value = getAttribute(element, customAttributes.draggable.index);
  var index = parseInt(value);
  invariant(Number.isInteger(index), 'The index is valid');
  return index;
}
/**
 * ASSUMPTIONS:
 * - Adjacent `<Draggable>` items are visually adjacent.
 * - If there is an adjacent element, it is rendered.
 */


export function calculateGap(_ref) {
  var element = _ref.element,
      where = _ref.where,
      direction = _ref.direction;
  var droppableId = getDroppableId(element);
  var index = getIndex(element);
  var indexBefore = index - 1;
  var indexAfter = index + 1;
  var isBefore = where === 'before';
  var adjacentElement = queryDraggableByIndex({
    droppableId: droppableId,
    index: isBefore ? indexBefore : indexAfter
  });

  if (adjacentElement === null) {
    /**
     * If there is no adjacent element, we can guess based on margins.
     */
    var _getComputedStyle = getComputedStyle(element),
        marginTop = _getComputedStyle.marginTop,
        marginRight = _getComputedStyle.marginRight,
        marginBottom = _getComputedStyle.marginBottom,
        marginLeft = _getComputedStyle.marginLeft;

    if (direction === 'horizontal') {
      return parseFloat(marginLeft) + parseFloat(marginRight);
    }

    return parseFloat(marginTop) + parseFloat(marginBottom);
  }

  var distance = getDistance({
    direction: direction,
    a: element.getBoundingClientRect(),
    b: adjacentElement.getBoundingClientRect()
  });
  return distance;
}
export function getGapOffset(_ref2) {
  var element = _ref2.element,
      where = _ref2.where,
      direction = _ref2.direction;
  var gap = calculateGap({
    element: element,
    where: where,
    direction: direction
  });

  if (where === 'before') {
    return -gap / 2;
  }

  return gap / 2;
}