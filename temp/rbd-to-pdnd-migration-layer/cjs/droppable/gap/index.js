"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateGap = calculateGap;
exports.getGapOffset = getGapOffset;

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _attributes = require("../../utils/attributes");

var _queryDraggable = require("../../utils/query-draggable");

var _getDistance = require("./get-distance");

function getDroppableId(element) {
  return (0, _attributes.getAttribute)(element, _attributes.customAttributes.draggable.droppableId);
}

function getIndex(element) {
  var value = (0, _attributes.getAttribute)(element, _attributes.customAttributes.draggable.index);
  var index = parseInt(value);
  (0, _tinyInvariant.default)(Number.isInteger(index), 'The index is valid');
  return index;
}
/**
 * ASSUMPTIONS:
 * - Adjacent `<Draggable>` items are visually adjacent.
 * - If there is an adjacent element, it is rendered.
 */


function calculateGap(_ref) {
  var element = _ref.element,
      where = _ref.where,
      direction = _ref.direction;
  var droppableId = getDroppableId(element);
  var index = getIndex(element);
  var indexBefore = index - 1;
  var indexAfter = index + 1;
  var isBefore = where === 'before';
  var adjacentElement = (0, _queryDraggable.queryDraggableByIndex)({
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

  var distance = (0, _getDistance.getDistance)({
    direction: direction,
    a: element.getBoundingClientRect(),
    b: adjacentElement.getBoundingClientRect()
  });
  return distance;
}

function getGapOffset(_ref2) {
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