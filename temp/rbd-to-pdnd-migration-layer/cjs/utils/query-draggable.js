"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryAllDraggables = queryAllDraggables;
exports.queryDraggableByIndex = queryDraggableByIndex;

var _attributes = require("./attributes");

function escape(value) {
  // This rule incorrectly identifies CSS.escape as unsupported in Safari
  // eslint-disable-next-line compat/compat
  return CSS.escape(value);
} // TODO: test with multiple `<DragDropContext>` instances
// FIXME: These won't distinguish between them


function queryDraggableByIndex(_ref) {
  var droppableId = _ref.droppableId,
      index = _ref.index;
  var selector = ["[".concat(_attributes.customAttributes.draggable.droppableId, "=\"").concat(escape(droppableId), "\"]"), "[".concat(_attributes.customAttributes.draggable.index, "=\"").concat(index, "\"]")].join('');
  var result = document.querySelector(selector);
  return result;
}

function queryAllDraggables(droppableId) {
  var selector = ["[".concat(_attributes.customAttributes.draggable.droppableId, "=\"").concat(escape(droppableId), "\"]"), "[".concat(_attributes.attributes.draggable.id, "]")].join('');
  var draggables = Array.from(document.querySelectorAll(selector));
  return draggables;
}