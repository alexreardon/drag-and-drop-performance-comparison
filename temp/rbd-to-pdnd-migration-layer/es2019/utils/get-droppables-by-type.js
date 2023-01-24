import { customAttributes } from './attributes';
export function getDroppablesOfType(type) {
  // eslint-disable-next-line compat/compat
  const selector = `[${customAttributes.droppable.type}="${CSS.escape(type)}"]`;
  const result = document.querySelectorAll(selector);
  return Array.from(result);
}