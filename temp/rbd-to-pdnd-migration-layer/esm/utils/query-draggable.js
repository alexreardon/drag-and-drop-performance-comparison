import { attributes, customAttributes } from './attributes';

function escape(value) {
  // This rule incorrectly identifies CSS.escape as unsupported in Safari
  // eslint-disable-next-line compat/compat
  return CSS.escape(value);
} // TODO: test with multiple `<DragDropContext>` instances
// FIXME: These won't distinguish between them


export function queryDraggableByIndex(_ref) {
  var droppableId = _ref.droppableId,
      index = _ref.index;
  var selector = ["[".concat(customAttributes.draggable.droppableId, "=\"").concat(escape(droppableId), "\"]"), "[".concat(customAttributes.draggable.index, "=\"").concat(index, "\"]")].join('');
  var result = document.querySelector(selector);
  return result;
}
export function queryAllDraggables(droppableId) {
  var selector = ["[".concat(customAttributes.draggable.droppableId, "=\"").concat(escape(droppableId), "\"]"), "[".concat(attributes.draggable.id, "]")].join('');
  var draggables = Array.from(document.querySelectorAll(selector));
  return draggables;
}