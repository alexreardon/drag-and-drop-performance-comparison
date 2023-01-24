"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDimensions = getDimensions;

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _getElementByDraggableLocation = require("../../utils/get-element-by-draggable-location");

var _gap = require("../gap");

var _constants = require("./constants");

function findScrollContainer(element) {
  var _getComputedStyle = getComputedStyle(element),
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  if (overflowX === 'scroll' || overflowX === 'auto' || overflowY === 'scroll' || overflowY === 'auto') {
    return element;
  }

  var parentElement = element.parentElement;

  if (parentElement === null) {
    return null;
  }

  return findScrollContainer(parentElement);
}
/**
 * Returns the closest element that is offset relative to the scroll container.
 */


function getOffsetElement(_ref) {
  var element = _ref.element,
      mode = _ref.mode;

  if (mode === 'standard') {
    return element;
  }

  var offsetParent = element.offsetParent;

  if (!offsetParent) {
    /**
     * Sometimes this function gets called after the element has been
     * disconnected / unmounted.
     *
     * This is a bailout. It could be handled more explicitly.
     */
    return element;
  }

  (0, _tinyInvariant.default)(offsetParent instanceof HTMLElement);
  return offsetParent;
}

function getDroppableOffset(_ref2) {
  var element = _ref2.element,
      direction = _ref2.direction;
  var mainAxis = _constants.directionMapping[direction].mainAxis;
  var scrollContainer = findScrollContainer(element);

  if (!scrollContainer) {
    return 0;
  }
  /**
   * If the scroll container has static positioning,
   * then we need to add the scroll container's offset as well.
   */


  var _getComputedStyle2 = getComputedStyle(scrollContainer),
      position = _getComputedStyle2.position;

  if (position !== 'static') {
    return 0;
  }

  return scrollContainer[mainAxis.offset];
}

function measure(_ref3) {
  var element = _ref3.element,
      isForwardEdge = _ref3.isForwardEdge,
      mode = _ref3.mode,
      direction = _ref3.direction;
  var _directionMapping$dir = _constants.directionMapping[direction],
      mainAxis = _directionMapping$dir.mainAxis,
      crossAxis = _directionMapping$dir.crossAxis;
  var offsetElement = getOffsetElement({
    element: element,
    mode: mode
  });
  var gapOffset = (0, _gap.getGapOffset)({
    element: element,
    where: isForwardEdge ? 'after' : 'before',
    direction: direction
  });
  var baseOffset = offsetElement[mainAxis.offset] - _constants.lineOffset;
  var mainAxisOffset = isForwardEdge ? baseOffset + element[mainAxis.length] : baseOffset;
  return {
    mainAxis: {
      offset: mainAxisOffset + gapOffset
    },
    crossAxis: {
      offset: offsetElement[crossAxis.offset],
      length: offsetElement[crossAxis.length]
    }
  };
}

function getDimensions(_ref4) {
  var targetLocation = _ref4.targetLocation,
      direction = _ref4.direction,
      mode = _ref4.mode;

  // TODO: restore indicator for empty droppable
  // if (target.data.isDroppable) {
  //   const draggables = queryAllDraggables(extractDroppableId(target.data));
  //   /**
  //    * If there are no draggables, then the indicator should be at the top.
  //    */
  //   if (draggables.length === 0) {
  //     const mainAxisOffset = getDroppableOffset({
  //       element: target.element,
  //       direction,
  //     });
  //     return {
  //       mainAxis: {
  //         offset: mainAxisOffset,
  //       },
  //       crossAxis: {
  //         offset: 0,
  //         length: '100%',
  //       },
  //     };
  //   }
  //   /**
  //    * Otherwise, if there are draggables, then the indicator is at the end.
  //    */
  //   const lastItem = draggables[draggables.length - 1];
  //   const offsetElement = getOffsetElement({ element: lastItem, mode });
  //   const gapOffset = getGapOffset({
  //     element: lastItem,
  //     where: 'after',
  //     direction,
  //   });
  //   const mainAxisOffset =
  //     offsetElement[mainAxis.offset] + lastItem[mainAxis.length] - lineOffset;
  //   const crossAxisOffset = offsetElement[crossAxis.offset];
  //   const crossAxisLength = offsetElement[crossAxis.length];
  //   return {
  //     mainAxis: {
  //       offset: mainAxisOffset + gapOffset,
  //     },
  //     crossAxis: {
  //       offset: crossAxisOffset,
  //       length: crossAxisLength,
  //     },
  //   };
  // }
  if (targetLocation.index === 0) {
    var _element = (0, _getElementByDraggableLocation.getElementByDraggableLocation)(targetLocation);

    if (!_element) {
      return null;
    }

    return measure({
      element: _element,
      isForwardEdge: false,
      mode: mode,
      direction: direction
    });
  }

  var element = (0, _getElementByDraggableLocation.getElementByDraggableLocation)({
    droppableId: targetLocation.droppableId,
    index: targetLocation.index - 1
  });

  if (!element) {
    return null;
  }

  return measure({
    element: element,
    isForwardEdge: true,
    mode: mode,
    direction: direction
  });
}