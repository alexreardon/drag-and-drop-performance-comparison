import React, { useEffect, useMemo, useReducer } from 'react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { useCapturedDimensions } from '../drag-drop-context/captured-dimensions-context';
import { getDraggableLocation } from '../drag-drop-context/draggable-location';
import { useInstanceId } from '../drag-drop-context/instance-id-context';
import { useMonitorForLifecycle } from '../drag-drop-context/lifecycle-context';
import { isDraggableData } from '../draggable/data';
import { idleState, reducer } from '../draggable/state';
import { useDragPreview } from '../draggable/use-drag-preview';
import { attributes } from '../utils/attributes';

function getBody() {
  return document.body;
}
/**
 * Calls the `renderClone` function.
 *
 * Only rendered during drags.
 */


function DraggableCloneInner({
  children,
  droppableId,
  type,
  draggableId,
  index,
  draggingOver,
  style,

  /**
   * Defaults to `document.body`
   */
  getContainerForClone = getBody
}) {
  const provided = useMemo(() => {
    return {
      innerRef: () => {},
      draggableProps: {
        [attributes.draggable.contextId]: '',
        [attributes.draggable.id]: draggableId,
        style
      },
      dragHandleProps: null
    };
  }, [draggableId, style]);
  const snapshot = useMemo(() => {
    return {
      isDragging: true,
      isDropAnimating: false,
      isClone: true,
      dropAnimation: null,
      draggingOver,
      // the id of a draggable that you are combining with
      combineWith: null,
      // a combine target is being dragged over by
      combineTargetFor: null,
      // What type of movement is being done: 'FLUID' or 'SNAP'
      mode: 'FLUID'
    };
  }, [draggingOver]);
  const rubric = useMemo(() => {
    return {
      draggableId,
      type,
      source: {
        droppableId,
        index
      }
    };
  }, [draggableId, droppableId, index, type]);
  return /*#__PURE__*/createPortal(children(provided, snapshot, rubric), getContainerForClone());
}
/**
 * Wrapper that is always rendered if there is a `renderClone` function.
 *
 * It sets up a monitor, and needs to observe the entire lifecycle.
 */


export function DraggableClone({
  children,
  droppableId,
  type,
  getContainerForClone
}) {
  const instanceId = useInstanceId();
  const [state, dispatch] = useReducer(reducer, idleState);
  const monitorForLifecycle = useMonitorForLifecycle();
  useEffect(() => {
    return combine(monitorForLifecycle({
      onPendingDragStart({
        location,
        start
      }) {
        if (droppableId !== start.source.droppableId) {
          return;
        }

        dispatch({
          type: 'START_DRAG',
          payload: {
            start,
            location
          }
        });
      },

      onBeforeDragEnd({
        draggableId
      }) {
        if (!state.isDragging) {
          return;
        }

        if (draggableId !== state.draggableId) {
          return;
        }

        dispatch({
          type: 'DROP'
        });
      }

    }), monitorForElements({
      canMonitor({
        source
      }) {
        invariant(isDraggableData(source.data));
        return source.data.instanceId === instanceId && source.data.droppableId === droppableId;
      },

      onDrag({
        location
      }) {
        dispatch({
          type: 'UPDATE_CURSOR',
          payload: {
            location
          }
        });
      },

      onDropTargetChange({
        location
      }) {
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination: getDraggableLocation(location.current)
          }
        });
      }

    }));
  }, [droppableId, instanceId, monitorForLifecycle, state]);
  const dimensions = useCapturedDimensions();
  const dragPreview = useDragPreview(dimensions, state);

  if (!state.isDragging) {
    return null;
  }

  return /*#__PURE__*/React.createElement(DraggableCloneInner, {
    droppableId: droppableId,
    type: type,
    draggableId: state.draggableId,
    index: state.start.index,
    draggingOver: state.draggingOver,
    style: dragPreview.style,
    getContainerForClone: getContainerForClone
  }, children);
}