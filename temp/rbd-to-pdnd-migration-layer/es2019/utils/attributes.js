import invariant from 'tiny-invariant';
export const attributes = {
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

export const customAttributes = {
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
  const value = element.getAttribute(attribute);
  invariant(value !== null, `Expected '${attribute}' to be present`);
  return value;
}
export function setAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return () => {
    for (const key of Object.keys(attributes)) {
      element.removeAttribute(key);
    }
  };
}