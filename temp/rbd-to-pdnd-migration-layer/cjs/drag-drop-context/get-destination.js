"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDestination = getDestination;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function getDestination(_ref) {
  var start = _ref.start,
      target = _ref.target;

  if (target === null) {
    return null;
  }
  /**
   * When reordering an item to an index greater than its current index
   * in the same list, then the visual index needs adjustment.
   *
   * This is to account for the item itself moving, which would cause a shift.
   */


  var isSameList = start.droppableId === target.droppableId;
  var isMovingForward = target.index > start.index;
  var shouldAdjust = isSameList && isMovingForward;

  if (!shouldAdjust) {
    return _objectSpread({}, target);
  }

  return _objectSpread(_objectSpread({}, target), {}, {
    index: target.index - 1
  });
}