import { attributes, customAttributes } from './attributes';

function escape(value) {
  // This rule incorrectly identifies CSS.escape as unsupported in Safari
  // eslint-disable-next-line compat/compat
  return CSS.escape(value);
} // TODO: test with multiple `<DragDropContext>` instances
// FIXME: These won't distinguish between them


export function queryDraggableByIndex({
  droppableId,
  index
}) {
  const selector = [`[${customAttributes.draggable.droppableId}="${escape(droppableId)}"]`, `[${customAttributes.draggable.index}="${index}"]`].join('');
  const result = document.querySelector(selector);
  return result;
}
export function queryAllDraggables(droppableId) {
  const selector = [`[${customAttributes.draggable.droppableId}="${escape(droppableId)}"]`, `[${attributes.draggable.id}]`].join('');
  const draggables = Array.from(document.querySelectorAll(selector));
  return draggables;
}