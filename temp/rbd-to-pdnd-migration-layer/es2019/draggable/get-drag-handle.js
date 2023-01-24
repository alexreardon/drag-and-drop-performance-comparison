import { attributes } from '../utils/attributes';
/**
 * Obtains the `HTMLElement` with the `provided.dragHandleProps`
 */

export function getDragHandle({
  draggableElement,
  draggableId
}) {
  // Check if the element is also the drag handle.
  if (draggableId === draggableElement.getAttribute(attributes.dragHandle.draggableId)) {
    return draggableElement;
  } // Otherwise the drag handle is a descendant.


  return draggableElement.querySelector(`[${attributes.dragHandle.draggableId}="${draggableId}"]`);
}