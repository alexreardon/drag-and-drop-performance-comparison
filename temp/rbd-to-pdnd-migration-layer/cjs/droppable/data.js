"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDroppableData = isDroppableData;

// TODO: use a symbol
function isDroppableData(data) {
  return data.isDroppable === true;
}