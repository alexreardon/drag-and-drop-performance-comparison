"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementByDraggableLocation = getElementByDraggableLocation;

var _attributes = require("./attributes");

function getElementByDraggableLocation(location) {
  if (!location) {
    return null;
  }

  var selector = [// eslint-disable-next-line compat/compat
  "[".concat(_attributes.customAttributes.draggable.droppableId, "=\"").concat(CSS.escape(location.droppableId), "\"]"), "[".concat(_attributes.customAttributes.draggable.index, "=\"").concat(location.index, "\"]")].join(''); // TODO: narrow by context as well

  return document.querySelector(selector);
}