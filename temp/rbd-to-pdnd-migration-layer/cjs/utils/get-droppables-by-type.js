"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDroppablesOfType = getDroppablesOfType;

var _attributes = require("./attributes");

function getDroppablesOfType(type) {
  // eslint-disable-next-line compat/compat
  var selector = "[".concat(_attributes.customAttributes.droppable.type, "=\"").concat(CSS.escape(type), "\"]");
  var result = document.querySelectorAll(selector);
  return Array.from(result);
}