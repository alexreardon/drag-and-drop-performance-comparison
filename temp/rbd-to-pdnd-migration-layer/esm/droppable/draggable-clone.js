import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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


function DraggableCloneInner(_ref) {
  var children = _ref.children,
      droppableId = _ref.droppableId,
      type = _ref.type,
      draggableId = _ref.draggableId,
      index = _ref.index,
      draggingOver = _ref.draggingOver,
      style = _ref.style,
      _ref$getContainerForC = _ref.getContainerForClone,
      getContainerForClone = _ref$getContainerForC === void 0 ? getBody : _ref$getContainerForC;
  var provided = useMemo(function () {
    var _draggableProps;

    return {
      innerRef: function innerRef() {},
      draggableProps: (_draggableProps = {}, _defineProperty(_draggableProps, attributes.draggable.contextId, ''), _defineProperty(_draggableProps, attributes.draggable.id, draggableId), _defineProperty(_draggableProps, "style", style), _draggableProps),
      dragHandleProps: null
    };
  }, [draggableId, style]);
  var snapshot = useMemo(function () {
    return {
      isDragging: true,
      isDropAnimating: false,
      isClone: true,
      dropAnimation: null,
      draggingOver: draggingOver,
      // the id of a draggable that you are combining with
      combineWith: null,
      // a combine target is being dragged over by
      combineTargetFor: null,
      // What type of movement is being done: 'FLUID' or 'SNAP'
      mode: 'FLUID'
    };
  }, [draggingOver]);
  var rubric = useMemo(function () {
    return {
      draggableId: draggableId,
      type: type,
      source: {
        droppableId: droppableId,
        index: index
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


export function DraggableClone(_ref2) {
  var children = _ref2.children,
      droppableId = _ref2.droppableId,
      type = _ref2.type,
      getContainerForClone = _ref2.getContainerForClone;
  var instanceId = useInstanceId();

  var _useReducer = useReducer(reducer, idleState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var monitorForLifecycle = useMonitorForLifecycle();
  useEffect(function () {
    return combine(monitorForLifecycle({
      onPendingDragStart: function onPendingDragStart(_ref3) {
        var location = _ref3.location,
            start = _ref3.start;

        if (droppableId !== start.source.droppableId) {
          return;
        }

        dispatch({
          type: 'START_DRAG',
          payload: {
            start: start,
            location: location
          }
        });
      },
      onBeforeDragEnd: function onBeforeDragEnd(_ref4) {
        var draggableId = _ref4.draggableId;

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
      canMonitor: function canMonitor(_ref5) {
        var source = _ref5.source;
        invariant(isDraggableData(source.data));
        return source.data.instanceId === instanceId && source.data.droppableId === droppableId;
      },
      onDrag: function onDrag(_ref6) {
        var location = _ref6.location;
        dispatch({
          type: 'UPDATE_CURSOR',
          payload: {
            location: location
          }
        });
      },
      onDropTargetChange: function onDropTargetChange(_ref7) {
        var location = _ref7.location;
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination: getDraggableLocation(location.current)
          }
        });
      }
    }));
  }, [droppableId, instanceId, monitorForLifecycle, state]);
  var dimensions = useCapturedDimensions();
  var dragPreview = useDragPreview(dimensions, state);

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