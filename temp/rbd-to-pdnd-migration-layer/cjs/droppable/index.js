"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Droppable = Droppable;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _element = require("@atlaskit/drag-and-drop/adapter/element");

var _instanceIdContext = require("../drag-drop-context/instance-id-context");

var _lifecycleContext = require("../drag-drop-context/lifecycle-context");

var _attributes = require("../utils/attributes");

var _draggableClone = require("./draggable-clone");

var _dropIndicator = require("./drop-indicator");

var _droppableContext = require("./droppable-context");

var _state = require("./state");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Droppable(_ref) {
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
  var instanceId = (0, _instanceIdContext.useInstanceId)();
  var isDropDisabledRef = (0, _react.useRef)(isDropDisabled);
  (0, _react.useEffect)(function () {
    isDropDisabledRef.current = isDropDisabled;
  }, [isDropDisabled]);
  var data = (0, _react.useMemo)(function () {
    return {
      droppableId: droppableId,
      instanceId: instanceId,
      isDroppable: true,
      getIsDropDisabled: function getIsDropDisabled() {
        return isDropDisabledRef.current;
      }
    };
  }, [droppableId, instanceId]);
  var elementRef = (0, _react.useRef)(null);
  var setElement = (0, _react.useCallback)(function (element) {
    if (element) {
      var _setAttributes;

      (0, _attributes.setAttributes)(element, (_setAttributes = {}, (0, _defineProperty2.default)(_setAttributes, _attributes.customAttributes.droppable.type, type), (0, _defineProperty2.default)(_setAttributes, _attributes.customAttributes.droppable.direction, direction), (0, _defineProperty2.default)(_setAttributes, _attributes.attributes.droppable.id, droppableId), _setAttributes));
    }

    elementRef.current = element;
  }, [direction, droppableId, type]);

  var _useReducer = (0, _react.useReducer)(_state.reducer, _state.idleState),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var draggingFromThisWith = state.draggingFromThisWith,
      draggingOverWith = state.draggingOverWith,
      isDraggingOver = state.isDraggingOver;
  (0, _react.useEffect)(function () {
    var element = elementRef.current;
    (0, _tinyInvariant.default)(element instanceof HTMLElement, 'innerRef must provide an `HTMLElement`');
    return (0, _element.dropTargetForElements)({
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
          type: 'DRAG_CLEAR'
        });
      }
    });
  }, [data, droppableId, instanceId, isDropDisabled, type]);
  var monitorForLifecycle = (0, _lifecycleContext.useMonitorForLifecycle)();
  (0, _react.useEffect)(function () {
    return monitorForLifecycle({
      onPendingDragStart: function onPendingDragStart(_ref3) {
        var start = _ref3.start;
        dispatch({
          type: 'DRAG_START',
          payload: {
            droppableId: droppableId,
            start: start
          }
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
            update: update
          }
        });
      },
      onBeforeDragEnd: function onBeforeDragEnd() {
        dispatch({
          type: 'DRAG_CLEAR'
        });
      }
    });
  }, [droppableId, monitorForLifecycle]);
  var provided = (0, _react.useMemo)(function () {
    var _droppableProps;

    return {
      innerRef: setElement,
      droppableProps: (_droppableProps = {}, (0, _defineProperty2.default)(_droppableProps, _attributes.attributes.droppable.contextId, ''), (0, _defineProperty2.default)(_droppableProps, _attributes.attributes.droppable.id, droppableId), _droppableProps),
      // TODO: should be null if portalling it
      placeholder: isDraggingOver && state.source ? /*#__PURE__*/_react.default.createElement(_dropIndicator.DropIndicator, {
        direction: direction,
        mode: mode,
        source: state.source,
        destination: state.destination,
        targetLocation: state.targetLocation
      }) : null
    };
  }, [direction, droppableId, isDraggingOver, mode, setElement, state.destination, state.source, state.targetLocation]);
  var snapshot = (0, _react.useMemo)(function () {
    return {
      draggingFromThisWith: draggingFromThisWith,
      draggingOverWith: draggingOverWith,
      isDraggingOver: isDraggingOver,
      isUsingPlaceholder: isDraggingOver
    };
  }, [draggingFromThisWith, draggingOverWith, isDraggingOver]);
  var element = elementRef.current;
  var shouldPortalDropIndicator = isDraggingOver && mode === 'virtual' && element;
  /**
   * Assumes that the ref points to the scroll container.
   */

  (0, _react.useLayoutEffect)(function () {
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
  }, [element, shouldPortalDropIndicator]);
  /**
   * Used to disable the dragging style for the real draggable.
   */

  var hasRenderClone = Boolean(renderClone);
  var contextValue = (0, _react.useMemo)(function () {
    return {
      direction: direction,
      droppableId: droppableId,
      hasRenderClone: hasRenderClone,
      isDropDisabled: isDropDisabled,
      type: type
    };
  }, [direction, droppableId, hasRenderClone, isDropDisabled, type]);
  return /*#__PURE__*/_react.default.createElement(_droppableContext.DroppableContextProvider, {
    value: contextValue
  }, children(provided, snapshot), shouldPortalDropIndicator && /*#__PURE__*/(0, _reactDom.createPortal)(provided.placeholder, element), renderClone && /*#__PURE__*/_react.default.createElement(_draggableClone.DraggableClone, {
    droppableId: droppableId,
    type: type,
    getContainerForClone: getContainerForClone
  }, renderClone));
}