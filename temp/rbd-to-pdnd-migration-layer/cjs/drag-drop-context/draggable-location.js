"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDraggableLocation = getDraggableLocation;
exports.isSameLocation = isSameLocation;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _closestEdge = require("@atlaskit/drag-and-drop-hitbox/addon/closest-edge");

var _data = require("../draggable/data");

var _data2 = require("../droppable/data");

var _attributes = require("../utils/attributes");

var _queryDraggable = require("../utils/query-draggable");

var _excluded = ["droppableId", "getIndex"];

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getDraggableLocationFromDraggableData(_ref) {
  var droppableId = _ref.droppableId,
      getIndex = _ref.getIndex,
      data = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var index = getIndex();
  var closestEdge = (0, _closestEdge.extractClosestEdge)(data);

  if (closestEdge === 'bottom' || closestEdge === 'right') {
    index += 1;
  }

  return {
    droppableId: droppableId,
    index: index
  };
}

function getDraggableLocationFromDroppableData(_ref2) {
  var droppableId = _ref2.droppableId;
  var draggables = (0, _queryDraggable.queryAllDraggables)(droppableId);
  var index = 0;

  var _iterator = _createForOfIteratorHelper(draggables),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var draggable = _step.value;
      var draggableIndex = parseInt((0, _attributes.getAttribute)(draggable, _attributes.customAttributes.draggable.index), 10);
      index = Math.max(index, draggableIndex + 1);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return {
    droppableId: droppableId,
    index: index
  };
}
/**
 * Derives a `DraggableLocation` (`react-beautiful-dnd`)
 * from a `DragLocation` (`@atlaskit/drag-and-drop`).
 */


function getDraggableLocation(location) {
  var dropTargets = location.dropTargets; // If there are no drop targets then there is no destination.

  if (dropTargets.length === 0) {
    return null;
  } // Obtains the innermost drop target.


  var target = dropTargets[0]; // If the target is a draggable we can extract its index.

  if ((0, _data.isDraggableData)(target.data)) {
    return getDraggableLocationFromDraggableData(target.data);
  } // If the target is a droppable, there is no index to extract.
  // We default to the end of the droppable.


  if ((0, _data2.isDroppableData)(target.data)) {
    return getDraggableLocationFromDroppableData(target.data);
  } // The target is not from the migration layer.


  return null;
}
/**
 * Checks if two `DraggableLocation` values are equivalent.
 */


function isSameLocation(a, b) {
  if ((a === null || a === void 0 ? void 0 : a.droppableId) !== (b === null || b === void 0 ? void 0 : b.droppableId)) {
    return false;
  }

  if ((a === null || a === void 0 ? void 0 : a.index) !== (b === null || b === void 0 ? void 0 : b.index)) {
    return false;
  }

  return true;
}