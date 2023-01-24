import { customAttributes } from './attributes';
export function getElementByDraggableLocation(location) {
  if (!location) {
    return null;
  }

  const selector = [// eslint-disable-next-line compat/compat
  `[${customAttributes.draggable.droppableId}="${CSS.escape(location.droppableId)}"]`, `[${customAttributes.draggable.index}="${location.index}"]`].join(''); // TODO: narrow by context as well

  return document.querySelector(selector);
}