"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDragHandle = getDragHandle;

var _attributes = require("../utils/attributes");

/**
 * Obtains the `HTMLElement` with the `provided.dragHandleProps`
 */
function getDragHandle(_ref) {
  var draggableElement = _ref.draggableElement,
      draggableId = _ref.draggableId;

  // Check if the element is also the drag handle.
  if (draggableId === draggableElement.getAttribute(_attributes.attributes.dragHandle.draggableId)) {
    return draggableElement;
  } // Otherwise the drag handle is a descendant.


  return draggableElement.querySelector("[".concat(_attributes.attributes.dragHandle.draggableId, "=\"").concat(draggableId, "\"]"));
}