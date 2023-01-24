import { attributes } from '../utils/attributes';
/**
 * Obtains the `HTMLElement` with the `provided.dragHandleProps`
 */

export function getDragHandle(_ref) {
  var draggableElement = _ref.draggableElement,
      draggableId = _ref.draggableId;

  // Check if the element is also the drag handle.
  if (draggableId === draggableElement.getAttribute(attributes.dragHandle.draggableId)) {
    return draggableElement;
  } // Otherwise the drag handle is a descendant.


  return draggableElement.querySelector("[".concat(attributes.dragHandle.draggableId, "=\"").concat(draggableId, "\"]"));
}