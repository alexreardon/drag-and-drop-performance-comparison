import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';

import { useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';
import { isSameLocation } from '../../drag-drop-context/draggable-location';
import { customAttributes } from '../../utils/attributes';
import { directionMapping, lineThickness } from './constants';
import { getDimensions } from './get-dimensions';
var baseStyles = css({
  background: 'var(--ds-border-brand, #0C66E4)',
  scrollMarginBlock: 24,
});
var virtualStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
});
var directionStyles = {
  horizontal: css({
    width: lineThickness,
    height: '100%',
    marginLeft: -lineThickness,
  }),
  vertical: css({
    width: '100%',
    height: lineThickness,
    marginTop: -lineThickness,
  }),
};

function getDynamicStyles(_ref) {
  var _ref2;

  var direction = _ref.direction,
    dimensions = _ref.dimensions,
    indicatorOffset = _ref.indicatorOffset;

  if (dimensions === null) {
    /**
     * We hide the indicator initially until dimensions can be taken.
     */
    return {
      opacity: 0,
    };
  }

  var _directionMapping$dir = directionMapping[direction],
    mainAxis = _directionMapping$dir.mainAxis,
    crossAxis = _directionMapping$dir.crossAxis;
  return (
    (_ref2 = {
      transform: ''
        .concat(mainAxis.style.transform, '(')
        .concat(dimensions.mainAxis.offset - indicatorOffset, 'px)'),
    }),
    _defineProperty(_ref2, crossAxis.style.length, dimensions.crossAxis.length),
    _defineProperty(_ref2, crossAxis.style.offset, dimensions.crossAxis.offset),
    _ref2
  );
} // function isLastItem(source: DragSource): boolean {
//   const droppableId = extractDroppableId(source.data);
//   const draggables = queryAllDraggables(droppableId);
//   const after = draggables.filter(draggable => {
//     const index = parseInt(
//       getAttribute(draggable, customAttributes.draggable.index),
//       10,
//     );
//     return index > extractIndex(source.data);
//   });
//   return after.length === 0;
// }

/**
 * Determines if the drop indicator should be hidden.
 *
 * This is desired when the current drop target would not change the position
 * of the draggable.
 *
 * TODO: test
 */

function shouldHide(_ref3) {
  var source = _ref3.source,
    _ref3$destination = _ref3.destination,
    destination = _ref3$destination === void 0 ? null : _ref3$destination;
  return isSameLocation(source, destination);
}

var dropIndicatorData = _defineProperty({}, customAttributes.dropIndicator, '');

export var DropIndicator = function DropIndicator(_ref4) {
  var direction = _ref4.direction,
    mode = _ref4.mode,
    source = _ref4.source,
    destination = _ref4.destination,
    targetLocation = _ref4.targetLocation;
  var ref = useRef(null);

  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    dimensions = _useState2[0],
    setDimensions = _useState2[1];

  useEffect(
    function () {
      if (!targetLocation) {
        return setDimensions(null);
      }

      if (
        shouldHide({
          source: source,
          destination: destination,
        })
      ) {
        return setDimensions(null);
      }

      return setDimensions(
        getDimensions({
          targetLocation: targetLocation,
          direction: direction,
          mode: mode,
        }),
      );
    },
    [direction, destination, mode, source, targetLocation],
  );
  useEffect(
    function () {
      var _element$scrollIntoVi;

      if (dimensions === null) {
        return;
      }

      var element = ref.current;
      invariant(element instanceof HTMLElement); // TODO: only scrollIntoView if done by keyboard
      // FIXME: using ?.() because not supported in Jest... should address that there not here

      (_element$scrollIntoVi = element.scrollIntoView) === null || _element$scrollIntoVi === void 0
        ? void 0
        : _element$scrollIntoVi.call(element, {
            block: 'nearest',
          });
    },
    [dimensions],
  );
  var mainAxis = directionMapping[direction].mainAxis;
  var indicatorOffset = ref.current ? ref.current[mainAxis.offset] : 0;
  var dynamicStyles = getDynamicStyles({
    direction: direction,
    dimensions: dimensions,
    indicatorOffset: indicatorOffset,
  });
  var isVirtual = mode === 'virtual';
  return jsx(
    'div',
    _extends(
      {
        ref: ref,
        css: [baseStyles, directionStyles[direction], isVirtual && virtualStyles],
        style: dynamicStyles,
      },
      dropIndicatorData,
    ),
  );
};
