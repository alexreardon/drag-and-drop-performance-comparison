'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.DropIndicator = void 0;

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'));

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = require('react');

var _react2 = require('@emotion/react');

var _tinyInvariant = _interopRequireDefault(require('tiny-invariant'));

var _draggableLocation = require('../../drag-drop-context/draggable-location');

var _attributes = require('../../utils/attributes');

var _constants = require('./constants');

var _getDimensions = require('./get-dimensions');

var baseStyles = (0, _react2.css)({
  background: 'var(--ds-border-brand, #0C66E4)',
  scrollMarginBlock: 24,
});
var virtualStyles = (0, _react2.css)({
  position: 'absolute',
  top: 0,
  left: 0,
});
var directionStyles = {
  horizontal: (0, _react2.css)({
    width: _constants.lineThickness,
    height: '100%',
    marginLeft: -_constants.lineThickness,
  }),
  vertical: (0, _react2.css)({
    width: '100%',
    height: _constants.lineThickness,
    marginTop: -_constants.lineThickness,
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

  var _directionMapping$dir = _constants.directionMapping[direction],
    mainAxis = _directionMapping$dir.mainAxis,
    crossAxis = _directionMapping$dir.crossAxis;
  return (
    (_ref2 = {
      transform: ''
        .concat(mainAxis.style.transform, '(')
        .concat(dimensions.mainAxis.offset - indicatorOffset, 'px)'),
    }),
    (0, _defineProperty2.default)(_ref2, crossAxis.style.length, dimensions.crossAxis.length),
    (0, _defineProperty2.default)(_ref2, crossAxis.style.offset, dimensions.crossAxis.offset),
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
  return (0, _draggableLocation.isSameLocation)(source, destination);
}

var dropIndicatorData = (0, _defineProperty2.default)(
  {},
  _attributes.customAttributes.dropIndicator,
  '',
);

var DropIndicator = function DropIndicator(_ref4) {
  var direction = _ref4.direction,
    mode = _ref4.mode,
    source = _ref4.source,
    destination = _ref4.destination,
    targetLocation = _ref4.targetLocation;
  var ref = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    dimensions = _useState2[0],
    setDimensions = _useState2[1];

  (0, _react.useEffect)(
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
        (0, _getDimensions.getDimensions)({
          targetLocation: targetLocation,
          direction: direction,
          mode: mode,
        }),
      );
    },
    [direction, destination, mode, source, targetLocation],
  );
  (0, _react.useEffect)(
    function () {
      var _element$scrollIntoVi;

      if (dimensions === null) {
        return;
      }

      var element = ref.current;
      (0, _tinyInvariant.default)(element instanceof HTMLElement); // TODO: only scrollIntoView if done by keyboard
      // FIXME: using ?.() because not supported in Jest... should address that there not here

      (_element$scrollIntoVi = element.scrollIntoView) === null || _element$scrollIntoVi === void 0
        ? void 0
        : _element$scrollIntoVi.call(element, {
            block: 'nearest',
          });
    },
    [dimensions],
  );
  var mainAxis = _constants.directionMapping[direction].mainAxis;
  var indicatorOffset = ref.current ? ref.current[mainAxis.offset] : 0;
  var dynamicStyles = getDynamicStyles({
    direction: direction,
    dimensions: dimensions,
    indicatorOffset: indicatorOffset,
  });
  var isVirtual = mode === 'virtual';
  return (0, _react2.jsx)(
    'div',
    (0, _extends2.default)(
      {
        ref: ref,
        css: [baseStyles, directionStyles[direction], isVirtual && virtualStyles],
        style: dynamicStyles,
      },
      dropIndicatorData,
    ),
  );
};

exports.DropIndicator = DropIndicator;
