"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDraggableData = isDraggableData;

/**
 * Data that is attached to drags. The same data is used for the `draggable()`
 * and `dropTargetForElements()` calls related to a `<Draggable>` instance.
 */
function isDraggableData(data) {
  // TODO: this could use a symbol for stricter checking
  return data.isDraggable === true;
}