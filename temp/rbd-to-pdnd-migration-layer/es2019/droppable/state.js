export const idleState = {
  draggingFromThisWith: null,
  draggingOverWith: null,
  isDraggingOver: false,
  source: null,
  destination: null,
  targetLocation: null
};
export function reducer(state, action) {
  if (action.type === 'DRAG_START') {
    const {
      droppableId,
      start
    } = action.payload;
    const {
      draggableId,
      source
    } = start;
    const isDraggingOver = source.droppableId === droppableId;
    const draggingOverWith = isDraggingOver ? draggableId : null;
    const isDraggingFrom = source.droppableId === droppableId;
    const draggingFromThisWith = isDraggingFrom ? draggableId : null;
    return { ...state,
      isDraggingOver,
      draggingFromThisWith,
      draggingOverWith,
      source: start.source,
      destination: start.source,
      targetLocation: start.source
    };
  }

  if (action.type === 'DRAG_UPDATE') {
    const {
      droppableId,
      targetLocation,
      update
    } = action.payload;
    const {
      destination = null,
      draggableId,
      source
    } = update;
    const isDraggingOver = (destination === null || destination === void 0 ? void 0 : destination.droppableId) === droppableId;
    const draggingOverWith = isDraggingOver ? draggableId : null;
    const isDraggingFrom = source.droppableId === droppableId;
    const draggingFromThisWith = isDraggingFrom ? draggableId : null;
    return { ...state,
      isDraggingOver,
      draggingFromThisWith,
      draggingOverWith,
      source: update.source,
      destination,
      targetLocation
    };
  }

  if (action.type === 'DRAG_CLEAR') {
    return idleState;
  }

  return state;
}