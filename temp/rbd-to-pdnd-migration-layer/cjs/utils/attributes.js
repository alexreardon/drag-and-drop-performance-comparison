"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customAttributes = exports.attributes = void 0;
exports.getAttribute = getAttribute;
exports.setAttributes = setAttributes;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var attributes = {
  draggable: {
    contextId: 'data-rbd-draggable-context-id',
    id: 'data-rbd-draggable-id'
  },
  dragHandle: {
    contextId: 'data-rbd-drag-handle-context-id',
    draggableId: 'data-rbd-drag-handle-draggable-id'
  },
  droppable: {
    contextId: 'data-rbd-droppable-context-id',
    id: 'data-rbd-droppable-id'
  },
  placeholder: {
    contextId: 'data-rbd-placeholder-context-id'
  }
};
/**
 * These attributes are not set by `react-beautiful-dnd`,
 * but they expose useful information for the migration layer.
 */

exports.attributes = attributes;
var customAttributes = {
  draggable: {
    droppableId: 'data-rbd-draggable-droppable-id',
    index: 'data-rbd-draggable-index'
  },
  dropIndicator: 'data-rbd-drop-indicator',
  droppable: {
    direction: 'data-rbd-droppable-direction',
    type: 'data-rbd-droppable-type'
  }
};
exports.customAttributes = customAttributes;

function getAttribute(element, attribute) {
  var value = element.getAttribute(attribute);
  (0, _tinyInvariant.default)(value !== null, "Expected '".concat(attribute, "' to be present"));
  return value;
}

function setAttributes(element, attributes) {
  for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    element.setAttribute(key, value);
  }

  return function () {
    for (var _i2 = 0, _Object$keys = Object.keys(attributes); _i2 < _Object$keys.length; _i2++) {
      var _key = _Object$keys[_i2];
      element.removeAttribute(_key);
    }
  };
}