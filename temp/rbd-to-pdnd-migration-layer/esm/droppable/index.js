import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
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
export function Droppable(_ref) {
  var children = _ref.children,
    droppableId = _ref.droppableId,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'DEFAULT' : _ref$type,
    _ref$direction = _ref.direction,
    direction = _ref$direction === void 0 ? 'vertical' : _ref$direction,
    _ref$mode = _ref.mode,
    mode = _ref$mode === void 0 ? 'standard' : _ref$mode,
    renderClone = _ref.renderClone,
    getContainerForClone = _ref.getContainerForClone,
    _ref$isDropDisabled = _ref.isDropDisabled,
    isDropDisabled = _ref$isDropDisabled === void 0 ? false : _ref$isDropDisabled;
  var instanceId = useInstanceId();
  var isDropDisabledRef = useRef(isDropDisabled);
  useEffect(
    function () {
      isDropDisabledRef.current = isDropDisabled;
    },
    [isDropDisabled],
  );
  var data = useMemo(
    function () {
      return {
        droppableId: droppableId,
        instanceId: instanceId,
        isDroppable: true,
        getIsDropDisabled: function getIsDropDisabled() {
          return isDropDisabledRef.current;
        },
      };
    },
    [droppableId, instanceId],
  );
  var elementRef = useRef(null);
  var setElement = useCallback(
    function (element) {
      if (element) {
        var _setAttributes;

        setAttributes(
          element,
          ((_setAttributes = {}),
          _defineProperty(_setAttributes, customAttributes.droppable.type, type),
          _defineProperty(_setAttributes, customAttributes.droppable.direction, direction),
          _defineProperty(_setAttributes, attributes.droppable.id, droppableId),
          _setAttributes),
        );
      }

      elementRef.current = element;
    },
    [direction, droppableId, type],
  );

  var _useReducer = useReducer(reducer, idleState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];

  var draggingFromThisWith = state.draggingFromThisWith,
    draggingOverWith = state.draggingOverWith,
    isDraggingOver = state.isDraggingOver;
  useEffect(
    function () {
      var element = elementRef.current;
      invariant(element instanceof HTMLElement, 'innerRef must provide an `HTMLElement`');
      return dropTargetForElements({
        element: element,
        getData: function getData() {
          return data;
        },
        canDrop: function canDrop(_ref2) {
          var source = _ref2.source;

          if (isDropDisabled) {
            return false;
          }

          return source.data.instanceId === instanceId && source.data.type === type;
        },
        onDragLeave: function onDragLeave() {
          dispatch({
            type: 'DRAG_CLEAR',
          });
        },
      });
    },
    [data, droppableId, instanceId, isDropDisabled, type],
  );
  var monitorForLifecycle = useMonitorForLifecycle();
  useEffect(
    function () {
      return monitorForLifecycle({
        onPendingDragStart: function onPendingDragStart(_ref3) {
          var start = _ref3.start;
          dispatch({
            type: 'DRAG_START',
            payload: {
              droppableId: droppableId,
              start: start,
            },
          });
        },
        onPendingDragUpdate: function onPendingDragUpdate(_ref4) {
          var targetLocation = _ref4.targetLocation,
            update = _ref4.update;
          dispatch({
            type: 'DRAG_UPDATE',
            payload: {
              droppableId: droppableId,
              targetLocation: targetLocation,
              update: update,
            },
          });
        },
        onBeforeDragEnd: function onBeforeDragEnd() {
          dispatch({
            type: 'DRAG_CLEAR',
          });
        },
      });
    },
    [droppableId, monitorForLifecycle],
  );
  var provided = useMemo(
    function () {
      var _droppableProps;

      return {
        innerRef: setElement,
        droppableProps:
          ((_droppableProps = {}),
          _defineProperty(_droppableProps, attributes.droppable.contextId, ''),
          _defineProperty(_droppableProps, attributes.droppable.id, droppableId),
          _droppableProps),
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
      };
    },
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
  var snapshot = useMemo(
    function () {
      return {
        draggingFromThisWith: draggingFromThisWith,
        draggingOverWith: draggingOverWith,
        isDraggingOver: isDraggingOver,
        isUsingPlaceholder: isDraggingOver,
      };
    },
    [draggingFromThisWith, draggingOverWith, isDraggingOver],
  );
  var element = elementRef.current;
  var shouldPortalDropIndicator = isDraggingOver && mode === 'virtual' && element;
  /**
   * Assumes that the ref points to the scroll container.
   */

  useEffect(
    function () {
      if (!shouldPortalDropIndicator) {
        return;
      }

      var _window$getComputedSt = window.getComputedStyle(element),
        position = _window$getComputedSt.position;

      if (position !== 'static') {
        return;
      }

      var prevStyle = element.style.position;
      element.style.position = 'relative';
      return function () {
        element.style.position = prevStyle;
      };
    },
    [element, shouldPortalDropIndicator],
  );
  /**
   * Used to disable the dragging style for the real draggable.
   */

  var hasRenderClone = Boolean(renderClone);
  var contextValue = useMemo(
    function () {
      return {
        direction: direction,
        droppableId: droppableId,
        hasRenderClone: hasRenderClone,
        isDropDisabled: isDropDisabled,
        type: type,
      };
    },
    [direction, droppableId, hasRenderClone, isDropDisabled, type],
  );
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
