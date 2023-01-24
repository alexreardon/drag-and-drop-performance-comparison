import { customAttributes } from './attributes';
export function getElementByDraggableLocation(location) {
  if (!location) {
    return null;
  }

  var selector = [// eslint-disable-next-line compat/compat
  "[".concat(customAttributes.draggable.droppableId, "=\"").concat(CSS.escape(location.droppableId), "\"]"), "[".concat(customAttributes.draggable.index, "=\"").concat(location.index, "\"]")].join(''); // TODO: narrow by context as well

  return document.querySelector(selector);
}