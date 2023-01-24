import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { useInstanceId } from '../drag-drop-context/instance-id-context';
import { useMonitorForLifecycle } from '../drag-drop-context/lifecycle-context';
import { attributes, customAttributes, setAttributes } from '../utils/attributes';
import { DraggableClone } from './draggable-clone';
import { DropIndicator } from './drop-indicator';
import { DroppableContextProvider } from './droppable-context';
import { idleState, reducer } from './state';
export function Droppable({
  children,
  droppableId,
  type = 'DEFAULT',
  // This default value replicates `react-beautiful-dnd`,
  direction = 'vertical',
  mode = 'standard',
  renderClone,
  getContainerForClone,
  isDropDisabled = false,
}) {
  const instanceId = useInstanceId();
  const isDropDisabledRef = useRef(isDropDisabled);
  useEffect(() => {
    isDropDisabledRef.current = isDropDisabled;
  }, [isDropDisabled]);
  const data = useMemo(() => {
    return {
      droppableId,
      instanceId,
      isDroppable: true,
      getIsDropDisabled: () => isDropDisabledRef.current,
    };
  }, [droppableId, instanceId]);
  const elementRef = useRef(null);
  const setElement = useCallback(
    (element) => {
      if (element) {
        setAttributes(element, {
          [customAttributes.droppable.type]: type,
          [customAttributes.droppable.direction]: direction,

          /**
           * We set this manually instead of relying on the provided prop,
           * because for virtual lists this can be difficult to apply.
           *
           * `react-beautiful-dnd` does not actually break if this is not applied.
           */
          [attributes.droppable.id]: droppableId,
        });
      }

      elementRef.current = element;
    },
    [direction, droppableId, type],
  );
  const [state, dispatch] = useReducer(reducer, idleState);
  const { draggingFromThisWith, draggingOverWith, isDraggingOver } = state;
  useEffect(() => {
    const element = elementRef.current;
    invariant(element instanceof HTMLElement, 'innerRef must provide an `HTMLElement`');
    return dropTargetForElements({
      element,

      getData() {
        return data;
      },

      canDrop({ source }) {
        if (isDropDisabled) {
          return false;
        }

        return source.data.instanceId === instanceId && source.data.type === type;
      },

      onDragLeave() {
        dispatch({
          type: 'DRAG_CLEAR',
        });
      },
    });
  }, [data, droppableId, instanceId, isDropDisabled, type]);
  const monitorForLifecycle = useMonitorForLifecycle();
  useEffect(() => {
    return monitorForLifecycle({
      onPendingDragStart({ start }) {
        dispatch({
          type: 'DRAG_START',
          payload: {
            droppableId,
            start,
          },
        });
      },

      onPendingDragUpdate({ targetLocation, update }) {
        dispatch({
          type: 'DRAG_UPDATE',
          payload: {
            droppableId,
            targetLocation,
            update,
          },
        });
      },

      onBeforeDragEnd() {
        dispatch({
          type: 'DRAG_CLEAR',
        });
      },
    });
  }, [droppableId, monitorForLifecycle]);
  const provided = useMemo(
    () => ({
      innerRef: setElement,
      droppableProps: {
        [attributes.droppable.contextId]: '',
        [attributes.droppable.id]: droppableId,
      },
      // TODO: should be null if portalling it
      placeholder:
        isDraggingOver && state.source
          ? /*#__PURE__*/ React.createElement(DropIndicator, {
              direction: direction,
              mode: mode,
              source: state.source,
              destination: state.destination,
              targetLocation: state.targetLocation,
            })
          : null,
    }),
    [
      direction,
      droppableId,
      isDraggingOver,
      mode,
      setElement,
      state.destination,
      state.source,
      state.targetLocation,
    ],
  );
  const snapshot = useMemo(
    () => ({
      draggingFromThisWith,
      draggingOverWith,
      isDraggingOver,
      isUsingPlaceholder: isDraggingOver,
    }),
    [draggingFromThisWith, draggingOverWith, isDraggingOver],
  );
  const element = elementRef.current;
  const shouldPortalDropIndicator = isDraggingOver && mode === 'virtual' && element;
  /**
   * Assumes that the ref points to the scroll container.
   */

  useEffect(() => {
    if (!shouldPortalDropIndicator) {
      return;
    }

    const { position } = window.getComputedStyle(element);

    if (position !== 'static') {
      return;
    }

    const prevStyle = element.style.position;
    element.style.position = 'relative';
    return () => {
      element.style.position = prevStyle;
    };
  }, [element, shouldPortalDropIndicator]);
  /**
   * Used to disable the dragging style for the real draggable.
   */

  const hasRenderClone = Boolean(renderClone);
  const contextValue = useMemo(() => {
    return {
      direction,
      droppableId,
      hasRenderClone,
      isDropDisabled,
      type,
    };
  }, [direction, droppableId, hasRenderClone, isDropDisabled, type]);
  return /*#__PURE__*/ React.createElement(
    DroppableContextProvider,
    {
      value: contextValue,
    },
    children(provided, snapshot),
    shouldPortalDropIndicator && /*#__PURE__*/ createPortal(provided.placeholder, element),
    renderClone &&
      /*#__PURE__*/ React.createElement(
        DraggableClone,
        {
          droppableId: droppableId,
          type: type,
          getContainerForClone: getContainerForClone,
        },
        renderClone,
      ),
  );
}
