import { customAttributes } from './attributes';
export function getDroppablesOfType(type) {
  // eslint-disable-next-line compat/compat
  var selector = "[".concat(customAttributes.droppable.type, "=\"").concat(CSS.escape(type), "\"]");
  var result = document.querySelectorAll(selector);
  return Array.from(result);
}