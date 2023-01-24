/**
 * All state for the Draggable is one place.
 *
 * This avoids rerenders (caused by unbatched state updates),
 * but also keeps state logic together.
 */
import invariant from 'tiny-invariant';
import { getDraggableLocation } from '../drag-drop-context/draggable-location';
export const idleState = {
  isDragging: false,
  draggingOver: null
};
export function reducer(state, action) {
  if (action.type === 'START_DRAG') {
    invariant(!state.isDragging, 'The draggable is idle.');
    const {
      start,
      location
    } = action.payload;
    const draggingOver = start.source.droppableId;
    const nextState = { ...state,
      isDragging: true,
      draggingOver,
      location: null,
      start: start.source,
      draggableId: start.draggableId,
      mode: start.mode
    };

    if (location) {
      return reducer(nextState, {
        type: 'UPDATE_CURSOR',
        payload: {
          location
        }
      });
    }

    return nextState;
  }

  if (action.type === 'UPDATE_DRAG') {
    invariant(state.isDragging, 'The draggable is dragging.');
    const {
      destination
    } = action.payload;
    const draggingOver = destination ? destination.droppableId : null;
    return { ...state,
      draggingOver
    };
  }

  if (action.type === 'UPDATE_CURSOR') {
    const {
      location
    } = action.payload;
    const nextState = { ...state,
      location
    };

    if (!state.isDragging) {
      /**
       * Virtualized items can unmount and remount during the drag.
       *
       * When they remount, their internal state won't have them marked as
       * dragging.
       *
       * TODO: find a nicer solution
       */
      const destination = getDraggableLocation(location.current);
      const draggingOver = destination ? destination.droppableId : null;
      Object.assign(nextState, {
        isDragging: true,
        draggingOver
      });
    }

    return nextState;
  }

  if (action.type === 'DROP') {
    invariant(state.isDragging, 'The draggable is dragging.');
    return idleState;
  }

  return state;
}