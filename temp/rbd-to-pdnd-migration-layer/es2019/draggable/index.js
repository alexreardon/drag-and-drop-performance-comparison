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

const noop = () => {};

export function Draggable({
  children,
  draggableId,
  index
}) {
  const {
    direction,
    droppableId,
    type
  } = useDroppableContext();
  const instanceId = useInstanceId();
  const elementRef = useRef(null);
  const dragHandleRef = useRef(null);
  const setElement = useCallback(element => {
    if (element) {
      // TODO: cleanup

      /**
       * The migration layer attaches some additional data attributes.
       *
       * These are not applied through render props, to avoid changing the type
       * interface of the migration layer.
       */
      setAttributes(element, {
        [customAttributes.draggable.droppableId]: droppableId,
        [customAttributes.draggable.index]: index.toString()
      });
    }

    elementRef.current = element;
    dragHandleRef.current = element ? getDragHandle({
      draggableElement: element,
      draggableId
    }) : null;
  }, [draggableId, droppableId, index]);
  const indexRef = useRef(index);
  indexRef.current = index;
  const getIndex = useCallback(() => {
    return indexRef.current;
  }, []);
  const [state, dispatch] = useReducer(reducer, idleState);
  const data = useMemo(() => {
    return {
      draggableId,
      droppableId,
      getIndex,
      instanceId,
      isDraggable: true,
      type
    };
  }, [draggableId, droppableId, getIndex, instanceId, type]);
  const {
    isDragging,
    draggingOver
  } = state;
  const {
    hasRenderClone,
    isDropDisabled
  } = useDroppableContext();
  const shouldHide = isDragging && hasRenderClone; //&& state.mode === 'FLUID';

  const monitorForLifecycle = useMonitorForLifecycle();
  const {
    startKeyboardDrag
  } = useKeyboardContext();
  useEffect(() => {
    if (isDragging) {
      return;
    }

    const element = elementRef.current;
    invariant(element instanceof HTMLElement);
    const dragHandle = dragHandleRef.current;
    invariant(dragHandle instanceof HTMLElement);
    return bindAll(dragHandle, [{
      type: 'keydown',

      listener(event) {
        if (event.key === ' ') {
          event.preventDefault();
          startKeyboardDrag({
            draggableId,
            type,

            getSourceLocation() {
              return {
                droppableId,
                index: getIndex()
              };
            },

            sourceElement: element
          });
        }
      }

    }]);
  }, [draggableId, droppableId, getIndex, isDragging, startKeyboardDrag, type]);
  useEffect(() => {
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

    const element = elementRef.current;
    invariant(element instanceof HTMLElement);
    const dragHandle = dragHandleRef.current;
    invariant(dragHandle instanceof HTMLElement);
    return draggable({
      canDrag() {
        return !isDragging;
      },

      element,
      dragHandle,

      getInitialData() {
        return data;
      },

      onGenerateDragPreview: disableNativeDragPreview
    });
  }, [data, isDragging, shouldHide]);
  /**
   * We don't want a placeholder if using keyboard controls,
   * because the element doesn't get hidden.
   */

  const hasPlaceholder = isDragging && state.mode === 'FLUID';
  const placeholderRef = useRef(null);
  useEffect(() => {
    /**
     * Swapping the drop target to the placeholder is important
     * to ensure that hovering over where the item was won't result in a
     * drop at the end of the list.
     */
    const element = hasPlaceholder ? placeholderRef.current : elementRef.current;
    invariant(element instanceof HTMLElement);
    return dropTargetForElements({
      element,

      getIsSticky() {
        return true;
      },

      canDrop({
        source
      }) {
        if (isDropDisabled) {
          return false;
        }

        return source.data.type === type;
      },

      getData({
        input
      }) {
        return attachClosestEdge(data, {
          element,
          input,
          allowedEdges: direction === 'vertical' ? ['top', 'bottom'] : ['left', 'right']
        });
      }

    });
  }, [data, direction, hasPlaceholder, isDropDisabled, type]);
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
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
      onPendingDragStart({
        start,
        location
      }) {
        if (data.draggableId !== start.draggableId) {
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

      // FIXME: ...
      // onPendingDragUpdate({ update }) {
      //   if (data.draggableId !== update.draggableId) {
      //     return;
      //   }
      //   const { destination = null } = update;
      //   dispatch({ type: 'UPDATE_DRAG', payload: { destination } });
      // },
      onBeforeDragEnd({
        draggableId
      }) {
        if (draggableId !== data.draggableId) {
          return;
        }

        invariant(isMountedRef.current, 'isMounted onBeforeDragEnd');
        dispatch({
          type: 'DROP'
        });
      }

    }), monitorForElements({
      canMonitor({
        source
      }) {
        return source.data.instanceId === data.instanceId && source.data.draggableId === data.draggableId;
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
        const destination = getDraggableLocation(location.current);
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination
          }
        });
      }

    }));
  }, [data.draggableId, data.instanceId, monitorForLifecycle]);
  const dimensions = useCapturedDimensions();
  const dragPreview = useDragPreview(dimensions, state);
  const provided = useMemo(() => ({
    draggableProps: {
      [attributes.draggable.contextId]: '',
      [attributes.draggable.id]: draggableId,
      style: hasRenderClone ? undefined : dragPreview.style
    },
    dragHandleProps: {
      'aria-labelledby': '',
      [attributes.dragHandle.contextId]: '',
      [attributes.dragHandle.draggableId]: draggableId,
      tabIndex: 0,

      /**
       * This must be `false` for drags to trigger on the draggable `element`,
       * which may be a parent, and not on the `dragHandle`.
       *
       * If the drag triggers on the `dragHandle` it won't be handled by the
       * library.
       */
      draggable: false,
      onDragStart: noop
    },
    innerRef: setElement
  }), [dragPreview.style, draggableId, hasRenderClone, setElement]);
  const snapshot = useMemo(() => ({
    isDragging,
    draggingOver,
    isDropAnimating: false,
    isClone: false,
    dropAnimation: null,
    combineWith: null,
    combineTargetFor: null,
    mode: null
  }), [draggingOver, isDragging]);
  const rubric = useMemo(() => ({
    draggableId,
    type,
    source: {
      droppableId,
      index
    }
  }), [draggableId, droppableId, index, type]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, shouldHide ? null : children(provided, snapshot, rubric), hasPlaceholder && /*#__PURE__*/React.createElement(Placeholder, {
    ref: placeholderRef
  }));
}