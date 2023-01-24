import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';
import { attachClosestEdge } from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { disableNativeDragPreview } from '@atlaskit/drag-and-drop/util/disable-native-drag-preview';
import { useCapturedDimensions } from '../drag-drop-context/captured-dimensions-context';
import { getDraggableLocation } from '../drag-drop-context/draggable-location';
import { useInstanceId } from '../drag-drop-context/instance-id-context';
import { useKeyboardContext } from '../drag-drop-context/keyboard-context';
import { useMonitorForLifecycle } from '../drag-drop-context/lifecycle-context';
import { useDroppableContext } from '../droppable/droppable-context';
import { attributes, customAttributes, setAttributes } from '../utils/attributes';
import { getDragHandle } from './get-drag-handle';
import { Placeholder } from './placeholder';
import { idleState, reducer } from './state';
import { useDragPreview } from './use-drag-preview';

var noop = function noop() {};

export function Draggable(_ref) {
  var children = _ref.children,
      draggableId = _ref.draggableId,
      index = _ref.index;

  var _useDroppableContext = useDroppableContext(),
      direction = _useDroppableContext.direction,
      droppableId = _useDroppableContext.droppableId,
      type = _useDroppableContext.type;

  var instanceId = useInstanceId();
  var elementRef = useRef(null);
  var dragHandleRef = useRef(null);
  var setElement = useCallback(function (element) {
    if (element) {
      var _setAttributes;

      // TODO: cleanup

      /**
       * The migration layer attaches some additional data attributes.
       *
       * These are not applied through render props, to avoid changing the type
       * interface of the migration layer.
       */
      setAttributes(element, (_setAttributes = {}, _defineProperty(_setAttributes, customAttributes.draggable.droppableId, droppableId), _defineProperty(_setAttributes, customAttributes.draggable.index, index.toString()), _setAttributes));
    }

    elementRef.current = element;
    dragHandleRef.current = element ? getDragHandle({
      draggableElement: element,
      draggableId: draggableId
    }) : null;
  }, [draggableId, droppableId, index]);
  var indexRef = useRef(index);
  indexRef.current = index;
  var getIndex = useCallback(function () {
    return indexRef.current;
  }, []);

  var _useReducer = useReducer(reducer, idleState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var data = useMemo(function () {
    return {
      draggableId: draggableId,
      droppableId: droppableId,
      getIndex: getIndex,
      instanceId: instanceId,
      isDraggable: true,
      type: type
    };
  }, [draggableId, droppableId, getIndex, instanceId, type]);
  var isDragging = state.isDragging,
      draggingOver = state.draggingOver;

  var _useDroppableContext2 = useDroppableContext(),
      hasRenderClone = _useDroppableContext2.hasRenderClone,
      isDropDisabled = _useDroppableContext2.isDropDisabled;

  var shouldHide = isDragging && hasRenderClone; //&& state.mode === 'FLUID';

  var monitorForLifecycle = useMonitorForLifecycle();

  var _useKeyboardContext = useKeyboardContext(),
      startKeyboardDrag = _useKeyboardContext.startKeyboardDrag;

  useEffect(function () {
    if (isDragging) {
      return;
    }

    var element = elementRef.current;
    invariant(element instanceof HTMLElement);
    var dragHandle = dragHandleRef.current;
    invariant(dragHandle instanceof HTMLElement);
    return bindAll(dragHandle, [{
      type: 'keydown',
      listener: function listener(event) {
        if (event.key === ' ') {
          event.preventDefault();
          startKeyboardDrag({
            draggableId: draggableId,
            type: type,
            getSourceLocation: function getSourceLocation() {
              return {
                droppableId: droppableId,
                index: getIndex()
              };
            },
            sourceElement: element
          });
        }
      }
    }]);
  }, [draggableId, droppableId, getIndex, isDragging, startKeyboardDrag, type]);
  useEffect(function () {
    if (shouldHide) {
      /**
       * If we render a clone, then we need to unmount the original element.
       *
       * Because of this, `elementRef.current` will become `null` and we will
       * no longer have a valid `element` reference.
       *
       * In this case, not having a valid `element` is expected,
       * instead of being an error.
       */
      return;
    }

    var element = elementRef.current;
    invariant(element instanceof HTMLElement);
    var dragHandle = dragHandleRef.current;
    invariant(dragHandle instanceof HTMLElement);
    return draggable({
      canDrag: function canDrag() {
        return !isDragging;
      },
      element: element,
      dragHandle: dragHandle,
      getInitialData: function getInitialData() {
        return data;
      },
      onGenerateDragPreview: disableNativeDragPreview
    });
  }, [data, isDragging, shouldHide]);
  /**
   * We don't want a placeholder if using keyboard controls,
   * because the element doesn't get hidden.
   */

  var hasPlaceholder = isDragging && state.mode === 'FLUID';
  var placeholderRef = useRef(null);
  useEffect(function () {
    /**
     * Swapping the drop target to the placeholder is important
     * to ensure that hovering over where the item was won't result in a
     * drop at the end of the list.
     */
    var element = hasPlaceholder ? placeholderRef.current : elementRef.current;
    invariant(element instanceof HTMLElement);
    return dropTargetForElements({
      element: element,
      getIsSticky: function getIsSticky() {
        return true;
      },
      canDrop: function canDrop(_ref2) {
        var source = _ref2.source;

        if (isDropDisabled) {
          return false;
        }

        return source.data.type === type;
      },
      getData: function getData(_ref3) {
        var input = _ref3.input;
        return attachClosestEdge(data, {
          element: element,
          input: input,
          allowedEdges: direction === 'vertical' ? ['top', 'bottom'] : ['left', 'right']
        });
      }
    });
  }, [data, direction, hasPlaceholder, isDropDisabled, type]);
  var isMountedRef = useRef(true);
  useEffect(function () {
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(function () {
    /**
     * Drag events need to be monitored independently because the original
     * element can be unmounted for two (valid) reasons.
     *
     * The original element can be unmounted during the drag for two reasons:
     *
     * 1. A `renderClone` method has been provided to the containing
     *    `<Droppable />` element. In this case the element is unmounted so
     *    that it is not visible while the clone is.
     *
     * 2. The user portals the element while it is being dragged. This would
     *    result in the original `HTMLElement` being unmounted.
     *
     * TODO: test an example with user-portaled draggables,
     *       might need to bring onDropTargetChange in too
     */
    return combine(monitorForLifecycle({
      onPendingDragStart: function onPendingDragStart(_ref4) {
        var start = _ref4.start,
            location = _ref4.location;

        if (data.draggableId !== start.draggableId) {
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
      // FIXME: ...
      // onPendingDragUpdate({ update }) {
      //   if (data.draggableId !== update.draggableId) {
      //     return;
      //   }
      //   const { destination = null } = update;
      //   dispatch({ type: 'UPDATE_DRAG', payload: { destination } });
      // },
      onBeforeDragEnd: function onBeforeDragEnd(_ref5) {
        var draggableId = _ref5.draggableId;

        if (draggableId !== data.draggableId) {
          return;
        }

        invariant(isMountedRef.current, 'isMounted onBeforeDragEnd');
        dispatch({
          type: 'DROP'
        });
      }
    }), monitorForElements({
      canMonitor: function canMonitor(_ref6) {
        var source = _ref6.source;
        return source.data.instanceId === data.instanceId && source.data.draggableId === data.draggableId;
      },
      onDrag: function onDrag(_ref7) {
        var location = _ref7.location;
        dispatch({
          type: 'UPDATE_CURSOR',
          payload: {
            location: location
          }
        });
      },
      onDropTargetChange: function onDropTargetChange(_ref8) {
        var location = _ref8.location;
        var destination = getDraggableLocation(location.current);
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination: destination
          }
        });
      }
    }));
  }, [data.draggableId, data.instanceId, monitorForLifecycle]);
  var dimensions = useCapturedDimensions();
  var dragPreview = useDragPreview(dimensions, state);
  var provided = useMemo(function () {
    var _draggableProps, _dragHandleProps;

    return {
      draggableProps: (_draggableProps = {}, _defineProperty(_draggableProps, attributes.draggable.contextId, ''), _defineProperty(_draggableProps, attributes.draggable.id, draggableId), _defineProperty(_draggableProps, "style", hasRenderClone ? undefined : dragPreview.style), _draggableProps),
      dragHandleProps: (_dragHandleProps = {
        'aria-labelledby': ''
      }, _defineProperty(_dragHandleProps, attributes.dragHandle.contextId, ''), _defineProperty(_dragHandleProps, attributes.dragHandle.draggableId, draggableId), _defineProperty(_dragHandleProps, "tabIndex", 0), _defineProperty(_dragHandleProps, "draggable", false), _defineProperty(_dragHandleProps, "onDragStart", noop), _dragHandleProps),
      innerRef: setElement
    };
  }, [dragPreview.style, draggableId, hasRenderClone, setElement]);
  var snapshot = useMemo(function () {
    return {
      isDragging: isDragging,
      draggingOver: draggingOver,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: null,
      combineWith: null,
      combineTargetFor: null,
      mode: null
    };
  }, [draggingOver, isDragging]);
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, shouldHide ? null : children(provided, snapshot, rubric), hasPlaceholder && /*#__PURE__*/React.createElement(Placeholder, {
    ref: placeholderRef
  }));
}