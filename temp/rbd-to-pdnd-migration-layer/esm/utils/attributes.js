import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import invariant from 'tiny-invariant';
export var attributes = {
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

export var customAttributes = {
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
export function getAttribute(element, attribute) {
  var value = element.getAttribute(attribute);
  invariant(value !== null, "Expected '".concat(attribute, "' to be present"));
  return value;
}
export function setAttributes(element, attributes) {
  for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
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