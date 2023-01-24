import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { autoScroller } from '@atlaskit/drag-and-drop-autoscroll';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/addon/cancel-unhandled';
import { isDraggableData } from '../draggable/data';
import { isDroppableData } from '../droppable/data';
import { cancelDrag } from './cancel-drag';
import { CapturedDimensionsProvider } from './captured-dimensions-context';
import { getDraggableLocation, isSameLocation } from './draggable-location';
import { ErrorBoundary } from './error-boundary';
import { getDestination } from './get-destination';
import { InstanceIdContext } from './instance-id-context';
import { KeyboardContextProvider } from './keyboard-context';
import { LifecycleContextProvider, useLifecycle } from './lifecycle-context';
import { announce, getProvided } from './screen-reader';
import { useScheduler } from './use-scheduler';

const getInstanceId = () => Symbol('<DragDropContext />');

function getDimensions(element) {
  const {
    margin
  } = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return {
    margin,
    rect
  };
}

export function DragDropContext({
  children,
  onBeforeCapture,
  onBeforeDragStart,
  onDragStart,
  onDragUpdate,
  onDragEnd
}) {
  const [instanceId] = useState(getInstanceId);
  const lifecycle = useLifecycle();
  const {
    schedule,
    flush
  } = useScheduler();
  const dragStateRef = useRef({
    isDragging: false
  });
  const getDragState = useCallback(() => {
    return dragStateRef.current;
  }, []);
  useEffect(() => {
    /**
     * If there is a drag when the context unmounts, cancel it.
     */
    return () => {
      const {
        isDragging
      } = getDragState();

      if (isDragging) {
        cancelDrag();
      }
    };
  }, [getDragState]);
  const startDrag = useCallback(({
    draggableId,
    type,
    getSourceLocation,
    sourceElement,
    location,
    mode
  }) => {
    const before = {
      draggableId,
      mode
    }; // This is called in `onDragStart` rather than `onGenerateDragPreview`
    // to avoid a browser bug. Some DOM manipulations can cancel
    // the drag if they happen early in the drag.
    // <https://bugs.chromium.org/p/chromium/issues/detail?id=674882>

    onBeforeCapture === null || onBeforeCapture === void 0 ? void 0 : onBeforeCapture(before);
    const start = {
      mode,
      draggableId,
      type,
      source: getSourceLocation()
    };
    dragStateRef.current = {
      isDragging: true,
      mode,
      capturedDimensions: getDimensions(sourceElement),
      prevDestination: null
    };
    onBeforeDragStart === null || onBeforeDragStart === void 0 ? void 0 : onBeforeDragStart(start);
    /**
     * This is used to signal to <Draggable> and <Droppable> elements
     * to update their state.
     *
     * This must be synchronous so that they have updated their state
     * by the time that `DragStart` is published.
     */

    lifecycle.dispatch('onPendingDragStart', {
      start,
      location
    }); // `onDragStart` is called in the next event loop (via `setTimeout`)
    //
    // We can safely assume that the React state updates have occurred by
    // now, and that the updated `snapshot` has been provided.
    // <https://twitter.com/alexandereardon/status/1585784101885263872>

    schedule(() => {
      const start = {
        mode,
        draggableId,
        type,
        source: getSourceLocation()
      };
      const {
        provided,
        getMessage
      } = getProvided('onDragStart', start);
      onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(start, provided);
      announce(getMessage());
      /**
       * If a drop target is disabled, there needs to be a `DragUpdate`
       * with `destination === null` published.
       *
       * But disabling the drop target won't trigger an `onDropTargetChange`
       * so we need to manually check for this.
       *
       * This is scheduled because changing `isDropDisabled` during
       * `onDragStart` is supported. If it was synchronous then state
       * updates in components won't have occurred yet.
       */

      schedule(() => {
        if (!location) {
          return;
        }

        const droppable = location.initial.dropTargets.find(target => target.data.isDroppable);
        let shouldPublish;

        if (!droppable) {
          /**
           * No droppable being found should only occur if it is disabled.
           */
          shouldPublish = true;
        } else {
          /**
           * Otherwise, if there is a droppable, then we want to publish
           * a `DragUpdate` if it is disabled.
           */
          const {
            data
          } = droppable;
          invariant(isDroppableData(data));
          shouldPublish = data.getIsDropDisabled();
        }

        if (!shouldPublish) {
          return;
        }

        const update = {
          mode,
          draggableId,
          type,
          source: start.source,
          destination: null,
          combine: null // not supported by migration layer

        };
        onDragUpdate === null || onDragUpdate === void 0 ? void 0 : onDragUpdate(update, provided);
      });
    });
  }, [lifecycle, onBeforeCapture, onBeforeDragStart, onDragStart, onDragUpdate, schedule]);
  const updateDrag = useCallback(({
    draggableId,
    type,
    sourceLocation,
    targetLocation
  }) => {
    invariant(dragStateRef.current.isDragging);
    const {
      prevDestination
    } = dragStateRef.current;
    /**
     * Computes where it would actually move to
     */

    const nextDestination = getDestination({
      start: sourceLocation,
      target: targetLocation
    });

    if (isSameLocation(prevDestination, nextDestination)) {
      return;
    }

    dragStateRef.current.prevDestination = nextDestination;
    const update = {
      mode: dragStateRef.current.mode,
      draggableId,
      type,
      source: sourceLocation,
      destination: nextDestination,
      combine: null // not supported by migration layer

    };
    lifecycle.dispatch('onPendingDragUpdate', {
      update,
      targetLocation
    });
    schedule(() => {
      const {
        provided,
        getMessage
      } = getProvided('onDragUpdate', update);
      onDragUpdate === null || onDragUpdate === void 0 ? void 0 : onDragUpdate(update, provided);
      announce(getMessage());
    });
  }, [lifecycle, onDragUpdate, schedule]);
  const stopDrag = useCallback(({
    draggableId,
    type,
    reason = 'DROP',
    sourceLocation,
    targetLocation
  }) => {
    invariant(dragStateRef.current.isDragging);
    const {
      mode
    } = dragStateRef.current;
    dragStateRef.current = {
      isDragging: false
    };
    flush();
    const destination = getDestination({
      start: sourceLocation,
      target: targetLocation
    });
    const result = {
      reason,
      type,
      source: sourceLocation,
      destination,
      mode,
      draggableId,
      combine: null // not supported by migration layer

    };
    /**
     * Tells <Draggable> instances to cleanup.
     */

    lifecycle.dispatch('onBeforeDragEnd', {
      draggableId
    });
    const {
      provided,
      getMessage
    } = getProvided('onDragEnd', result);
    onDragEnd(result, provided);
    announce(getMessage());
  }, [flush, lifecycle, onDragEnd]);
  const dragController = useMemo(() => {
    return {
      getDragState,
      startDrag,
      updateDrag,
      stopDrag
    };
  }, [getDragState, startDrag, stopDrag, updateDrag]);
  const updatePointerDrag = useCallback(({
    location,
    source
  }) => {
    const {
      data
    } = source;
    invariant(isDraggableData(data));
    const {
      draggableId,
      droppableId,
      getIndex,
      type
    } = data;
    updateDrag({
      draggableId,
      type,
      sourceLocation: {
        droppableId,
        index: getIndex()
      },
      targetLocation: getDraggableLocation(location.current)
    });
  }, [updateDrag]);
  useEffect(() => {
    return monitorForElements({
      canMonitor({
        initial,
        source
      }) {
        const isValidDraggable = source.data.instanceId === instanceId;

        if (!isValidDraggable) {
          return false;
        }

        const droppable = initial.dropTargets.find(dropTarget => dropTarget.data.isDroppable);

        if (!droppable) {
          /**
           * There may be no droppable in the `dropTargets` if it is disabled.
           *
           * This is still valid.
           */
          return true;
        }

        const isValidDroppable = droppable.data.instanceId === instanceId;
        return isValidDroppable;
      },

      onDragStart({
        location,
        source
      }) {
        autoScroller.start({
          input: location.current.input
        });
        cancelUnhandled.start();
        const {
          data
        } = source;
        invariant(isDraggableData(data));
        const {
          draggableId,
          droppableId,
          getIndex,
          type
        } = data;
        startDrag({
          draggableId,
          type,

          getSourceLocation() {
            return {
              droppableId,
              index: getIndex()
            };
          },

          sourceElement: source.element,
          location,
          mode: 'FLUID'
        });
      },

      onDrag({
        location,
        source
      }) {
        autoScroller.updateInput({
          input: location.current.input
        });
        updatePointerDrag({
          location,
          source
        });
      },

      onDropTargetChange({
        source,
        location
      }) {
        updatePointerDrag({
          location,
          source
        });
      },

      onDrop({
        location,
        source
      }) {
        autoScroller.stop();
        cancelUnhandled.stop();
        const {
          data
        } = source;
        invariant(isDraggableData(data));
        const {
          draggableId,
          droppableId,
          getIndex,
          type
        } = data;
        stopDrag({
          draggableId,
          type,
          sourceLocation: {
            droppableId,
            index: getIndex()
          },
          targetLocation: getDraggableLocation(location.current)
        });
      }

    });
  }, [flush, instanceId, lifecycle, onBeforeCapture, onBeforeDragStart, onDragEnd, onDragStart, onDragUpdate, schedule, startDrag, stopDrag, updateDrag, updatePointerDrag]);
  return /*#__PURE__*/React.createElement(ErrorBoundary, {
    instanceId: instanceId
  }, /*#__PURE__*/React.createElement(InstanceIdContext.Provider, {
    value: instanceId
  }, /*#__PURE__*/React.createElement(LifecycleContextProvider, {
    lifecycle: lifecycle
  }, /*#__PURE__*/React.createElement(CapturedDimensionsProvider, {
    getDragState: getDragState
  }, /*#__PURE__*/React.createElement(KeyboardContextProvider, {
    dragController: dragController
  }, children)))));
}