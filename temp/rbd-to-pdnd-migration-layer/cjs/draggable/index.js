"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Draggable = Draggable;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _bindEventListener = require("bind-event-listener");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _closestEdge = require("@atlaskit/drag-and-drop-hitbox/addon/closest-edge");

var _element = require("@atlaskit/drag-and-drop/adapter/element");

var _combine = require("@atlaskit/drag-and-drop/util/combine");

var _disableNativeDragPreview = require("@atlaskit/drag-and-drop/util/disable-native-drag-preview");

var _capturedDimensionsContext = require("../drag-drop-context/captured-dimensions-context");

var _draggableLocation = require("../drag-drop-context/draggable-location");

var _instanceIdContext = require("../drag-drop-context/instance-id-context");

var _keyboardContext = require("../drag-drop-context/keyboard-context");

var _lifecycleContext = require("../drag-drop-context/lifecycle-context");

var _droppableContext = require("../droppable/droppable-context");

var _attributes = require("../utils/attributes");

var _getDragHandle = require("./get-drag-handle");

var _placeholder = require("./placeholder");

var _state = require("./state");

var _useDragPreview = require("./use-drag-preview");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var noop = function noop() {};

function Draggable(_ref) {
  var children = _ref.children,
      draggableId = _ref.draggableId,
      index = _ref.index;

  var _useDroppableContext = (0, _droppableContext.useDroppableContext)(),
      direction = _useDroppableContext.direction,
      droppableId = _useDroppableContext.droppableId,
      type = _useDroppableContext.type;

  var instanceId = (0, _instanceIdContext.useInstanceId)();
  var elementRef = (0, _react.useRef)(null);
  var dragHandleRef = (0, _react.useRef)(null);
  var setElement = (0, _react.useCallback)(function (element) {
    if (element) {
      var _setAttributes;

      // TODO: cleanup

      /**
       * The migration layer attaches some additional data attributes.
       *
       * These are not applied through render props, to avoid changing the type
       * interface of the migration layer.
       */
      (0, _attributes.setAttributes)(element, (_setAttributes = {}, (0, _defineProperty2.default)(_setAttributes, _attributes.customAttributes.draggable.droppableId, droppableId), (0, _defineProperty2.default)(_setAttributes, _attributes.customAttributes.draggable.index, index.toString()), _setAttributes));
    }

    elementRef.current = element;
    dragHandleRef.current = element ? (0, _getDragHandle.getDragHandle)({
      draggableElement: element,
      draggableId: draggableId
    }) : null;
  }, [draggableId, droppableId, index]);
  var indexRef = (0, _react.useRef)(index);
  indexRef.current = index;
  var getIndex = (0, _react.useCallback)(function () {
    return indexRef.current;
  }, []);

  var _useReducer = (0, _react.useReducer)(_state.reducer, _state.idleState),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var data = (0, _react.useMemo)(function () {
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

  var _useDroppableContext2 = (0, _droppableContext.useDroppableContext)(),
      hasRenderClone = _useDroppableContext2.hasRenderClone,
      isDropDisabled = _useDroppableContext2.isDropDisabled;

  var shouldHide = isDragging && hasRenderClone; //&& state.mode === 'FLUID';

  var monitorForLifecycle = (0, _lifecycleContext.useMonitorForLifecycle)();

  var _useKeyboardContext = (0, _keyboardContext.useKeyboardContext)(),
      startKeyboardDrag = _useKeyboardContext.startKeyboardDrag;

  (0, _react.useEffect)(function () {
    if (isDragging) {
      return;
    }

    var element = elementRef.current;
    (0, _tinyInvariant.default)(element instanceof HTMLElement);
    var dragHandle = dragHandleRef.current;
    (0, _tinyInvariant.default)(dragHandle instanceof HTMLElement);
    return (0, _bindEventListener.bindAll)(dragHandle, [{
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
  (0, _react.useEffect)(function () {
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
    (0, _tinyInvariant.default)(element instanceof HTMLElement);
    var dragHandle = dragHandleRef.current;
    (0, _tinyInvariant.default)(dragHandle instanceof HTMLElement);
    return (0, _element.draggable)({
      canDrag: function canDrag() {
        return !isDragging;
      },
      element: element,
      dragHandle: dragHandle,
      getInitialData: function getInitialData() {
        return data;
      },
      onGenerateDragPreview: _disableNativeDragPreview.disableNativeDragPreview
    });
  }, [data, isDragging, shouldHide]);
  /**
   * We don't want a placeholder if using keyboard controls,
   * because the element doesn't get hidden.
   */

  var hasPlaceholder = isDragging && state.mode === 'FLUID';
  var placeholderRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    /**
     * Swapping the drop target to the placeholder is important
     * to ensure that hovering over where the item was won't result in a
     * drop at the end of the list.
     */
    var element = hasPlaceholder ? placeholderRef.current : elementRef.current;
    (0, _tinyInvariant.default)(element instanceof HTMLElement);
    return (0, _element.dropTargetForElements)({
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
        return (0, _closestEdge.attachClosestEdge)(data, {
          element: element,
          input: input,
          allowedEdges: direction === 'vertical' ? ['top', 'bottom'] : ['left', 'right']
        });
      }
    });
  }, [data, direction, hasPlaceholder, isDropDisabled, type]);
  var isMountedRef = (0, _react.useRef)(true);
  (0, _react.useEffect)(function () {
    return function () {
      isMountedRef.current = false;
    };
  }, []);
  (0, _react.useEffect)(function () {
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
    return (0, _combine.combine)(monitorForLifecycle({
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

        (0, _tinyInvariant.default)(isMountedRef.current, 'isMounted onBeforeDragEnd');
        dispatch({
          type: 'DROP'
        });
      }
    }), (0, _element.monitorForElements)({
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
        var destination = (0, _draggableLocation.getDraggableLocation)(location.current);
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination: destination
          }
        });
      }
    }));
  }, [data.draggableId, data.instanceId, monitorForLifecycle]);
  var dimensions = (0, _capturedDimensionsContext.useCapturedDimensions)();
  var dragPreview = (0, _useDragPreview.useDragPreview)(dimensions, state);
  var provided = (0, _react.useMemo)(function () {
    var _draggableProps, _dragHandleProps;

    return {
      draggableProps: (_draggableProps = {}, (0, _defineProperty2.default)(_draggableProps, _attributes.attributes.draggable.contextId, ''), (0, _defineProperty2.default)(_draggableProps, _attributes.attributes.draggable.id, draggableId), (0, _defineProperty2.default)(_draggableProps, "style", hasRenderClone ? undefined : dragPreview.style), _draggableProps),
      dragHandleProps: (_dragHandleProps = {
        'aria-labelledby': ''
      }, (0, _defineProperty2.default)(_dragHandleProps, _attributes.attributes.dragHandle.contextId, ''), (0, _defineProperty2.default)(_dragHandleProps, _attributes.attributes.dragHandle.draggableId, draggableId), (0, _defineProperty2.default)(_dragHandleProps, "tabIndex", 0), (0, _defineProperty2.default)(_dragHandleProps, "draggable", false), (0, _defineProperty2.default)(_dragHandleProps, "onDragStart", noop), _dragHandleProps),
      innerRef: setElement
    };
  }, [dragPreview.style, draggableId, hasRenderClone, setElement]);
  var snapshot = (0, _react.useMemo)(function () {
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
  var rubric = (0, _react.useMemo)(function () {
    return {
      draggableId: draggableId,
      type: type,
      source: {
        droppableId: droppableId,
        index: index
      }
    };
  }, [draggableId, droppableId, index, type]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, shouldHide ? null : children(provided, snapshot, rubric), hasPlaceholder && /*#__PURE__*/_react.default.createElement(_placeholder.Placeholder, {
    ref: placeholderRef
  }));
}